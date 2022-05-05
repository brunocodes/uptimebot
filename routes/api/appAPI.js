const router = require('express').Router();
const DiscordUser = require('../../models/DiscordUser');
const EventLog = require('../../models/EventLog');
const Guild = require('../../models/Guild');
const GuildEvent = require('../../models/GuildEvent');
const PingData = require('../../models/PingData');
require('../../monitor/monitorService');
const UpMonDB = require('../../monitor/UpMonDB');
const monDB = new UpMonDB();
const UpMonStatus = require('../../monitor/UpMonStatus');
const monStatus = new UpMonStatus();
const {logger, log4js} = require('../../logging/logger');
const roleConfig = {
  FREEROLE: "FREE",
  freeLimit: 25,
  PROROLE: "PRO",
  proLimit: 50,
  TESTERROLE: "TESTER",
  testerLimit: 50,
  ADMINROLE: "ADMIN",
  adminLimit: 50
};

const authCheck = (req, res, next)=> {
  if(!req.user){
    res.status(400).send('Bad Request')
  } else {    
    next();
  }
};

const monitorLimitCheck = (req, res, next)=> {  
  if(!req.user._id) {
    res.status(400).send('Bad Request')
  } else {
    try {
      const userID = req.user._id;
      const queryGuilds = {user_id: userID};

      Guild.find(queryGuilds)
      .populate('events')
      .exec((err, userguilds)=> {
        if (err) {
          console.log(err);
          res.json({
            message: "Error finding server"
          });
        } else if (userguilds) {
          let eventCount = 0;
          for (const guild in userguilds) {
            if (userguilds.hasOwnProperty(guild)) {
              const currentGuild = userguilds[guild];
              currentLength = currentGuild.events.length;
              eventCount += currentLength;
            }
          }
          if (eventCount < roleConfig.freeLimit && req.user.role == roleConfig.FREEROLE) {
            next()
          } else if (eventCount < roleConfig.proLimit && req.user.role == roleConfig.PROROLE) {
            next()
          } else {
            res.status(400).send('Bad Request');
          }
        }
      });
    } catch (error) {
      console.log(error);
      logger.error("appAPI monitorLimitCheck function error.",req.user, req.body, error);
    }
  }
};

// @route   POST app/stop-service
// @desc    Stop/pause service 
// @access  Private
router.post("/stop-service", authCheck, (req, res)=> {
  try {
    const reqObj = req.body;
    const gID = reqObj.guild_id;
    const eID = reqObj.event_id; 
    const eName = reqObj.event_name;
    const uID = req.user._id;
    const eStatus = reqObj.status;

    GuildEvent.updateOne(
      { "_id": eID },
      { $set: { active: false } },
      (err)=> {
        if(err) console.log(err);      
      }
    ).then( ()=> {
      stop(eID);
      res.json({
        message: "Service Stopped" 
      })
    }).then(()=> {
      monStatus.monitorPaused(uID, eID, eName, "PAUSE", eStatus)
    });
  } catch (error) {
    console.log(error);
    logger.error("appAPI stop-service POST route error.",req.user, req.body, error);
  } finally {
    logger.info("appAPI stop-service POST route.",req.user, req.body);
  }
});

// @route   POST app/start-service
// @desc    Stop/pause service 
// @access  Private
router.post("/start-service", authCheck, (req, res)=> {
  try {
    const reqObj = req.body;
    const gID = reqObj.guild_id;
    const eID = reqObj.event_id;
    const eName = reqObj.event_name;
    const uID = req.user._id;

    GuildEvent.updateOne(
      { "_id": eID },
      { $set: { active: true } },
      (err)=> {
        if(err) console.log(err);      
      }
    ).then( ()=> {
      start(eID);
      res.json({
        message: "Service Started" 
      })
    }).then( ()=> {
      monStatus.resetFromPaused(uID, eID, eName);
    });
  } catch (error) {
    console.log(error);
    logger.error("appAPI start-service POST route error.",req.user, req.body, error)
  } finally {
    logger.info("appAPI start-service POST route.",req.user, req.body)
  }
  
});

// @route   DELETE app/endaccount
// @desc    Delete all user and guild data on request.
// @access  Private
router.delete("/endaccount", authCheck, (req, res)=> {
  if(req.user.id === userID) {
    try {
      const reqObj = req.body;
      const userID = reqObj.user_id;  
      const queryGuilds = { user_id:  req.user._id};

      Guild.find(queryGuilds)
      .populate('events')
      .exec((err, userguilds)=> {
        if (err) {
          console.log(err);
          res.json({
            message: "Error finding server"
          });
          return;
        } else if (userguilds) {
          for (const guild in userguilds) {
            if (userguilds.hasOwnProperty(guild)) {
              const currentGuild = userguilds[guild];
              if (Array.isArray(currentGuild.events)) {
                currentGuild.events.map( event=> {
                  removeService( event._id.toString() );              
                });
              }
            }
          }
        }
        const queryUser = { user_id: req.user._id };
        GuildEvent.deleteMany( queryUser, err => {
          if (err) {          
            res.json({
              message: "Error finding user"
            });
          }      
        })
        .then(()=> {
          const queryUser = { user_id: req.user._id };
          Guild.deleteMany( queryUser, err => {
            if (err) {            
              res.json({
                message: "Error finding servers"
              });
            }
          })
          .then(()=> {
            const queryUser = { _id: req.user._id };
            DiscordUser.deleteOne( queryUser , (err) => {
              if (err) {              
                res.json({
                  message: "Error finding servers"
                });
              } else {
                console.log("Successful deletion");
                res.json({
                  message: "Successful deletion"
                });              
              }            
            });
          });
        })
      });
    } catch (error) {
      logger.error("appAPI endaccount route error.",req.user, req.body, error);
    } finally {
      logger.info("appAPI endaccount DELETE route.",req.user, req.body);
    }
  }
});

// @route   POST app/addevent
// @desc    POST a new event to the guild events database
// @access  Private
router.post("/addevent", authCheck, monitorLimitCheck, (req, res)=> {
  try {
    const reqEvent = req.body.event;
    const reqGID = reqEvent.guild_id;
    const queryGuild = { guild_id: reqGID, user_id: req.user._id };

    Guild.findOne( queryGuild , (err, guild)=> {
      if (err) {
        console.log(err);
        res.json({
          message: "Error finding server"
        });
      } else if(guild) { 
        new GuildEvent({
          user_id: req.user._id,
          guild_id: reqEvent.guild_id,
          name: reqEvent.name,
          url: reqEvent.url,
          interval: reqEvent.interval,
          channel: reqEvent.channel,
          channel_name: reqEvent.channel_name,
          role: reqEvent.role,
          role_name: reqEvent.role_name,
          message: reqEvent.message,
          timeout: reqEvent.timeout,
          active: reqEvent.active,
          timezone: reqEvent.timezone
        }).save()
        .then( (guildevent) => {
          if (Array.isArray(guild.events)) {
            guild.events.push(guildevent._id)
            guild.save()
          }
          monStatus.monitorCreated(req.user._id, guildevent._id, guildevent.name)
          res.json({
            message: "Monitoring added successfully"
          });
          delete guildevent._doc.__v;
          addService(guildevent._doc);
        })
      }
    });
  } catch (error) {
    console.log(error);
    logger.error("appAPI addevent POST route error.",req.user, req.body, error)
  } finally {
    logger.info("appAPI addevent POST route.",req.user, req.body);
  }
  
});

// @route   POST app/editevent
// @desc    POST a new event to the guild events database
// @access  Private
router.post("/editevent", authCheck, (req, res)=> {
  try {
    const reqEvent = req.body.event;
    const reqGID = reqEvent.guild_id;
    const eventID = reqEvent._id;

    GuildEvent.updateOne(
      { _id: eventID},
      { $set: {       
        name: reqEvent.name,
        url: reqEvent.url,
        interval: reqEvent.interval,
        channel: reqEvent.channel,
        channel_name: reqEvent.channel_name,
        role: reqEvent.role,
        role_name: reqEvent.role_name,
        message: reqEvent.message,      
        guildOnly: reqEvent.guildOnly,
        timeout: reqEvent.timeout,
        active: reqEvent.active,
        timezone: reqEvent.timezone
      } },
      (err)=> {
        if(err) {
          res.json({
            error: "There was an error updating the monitor."
          })
        }
      }
    ).then( ()=> {    
      // Handle change to UpMon - Remove
      console.log("* Remove Re-Add");
      removeService(eventID);
    }).then( ()=> {
      // Handle change to UpMon - Re-Add    
      const query = { _id: eventID };
  
      GuildEvent.findOne( query , (err, event)=> {
        if (err) {
          console.log(err);
          res.json({
            error: err
          });
        } else if(event) {
          delete event._doc.__v;
          addEditedService(event._doc);
          res.json({
            message: "Monitor updated" 
          });
          console.log("* Edit Re-Add event: ");
          console.log(event._doc);
        }
      });
      
    })

  } catch (error) {
    console.log(error);
    logger.error("appAPI editevent POST route error.",req.user, req.body, error)
  } finally {
    logger.info("appAPI editevent POST route.",req.user, req.body);
  }
});

// @route   POST app/guildevents
// @desc    Get events with post body Object
// @access  Private
router.post("/guildevents", authCheck ,(req, res)=> {
  try {
    const reqEvent = req.body.event;
    const reqGID = reqEvent.guild_id;  
    const queryGuild = { guild_id: reqGID, user_id: req.user._id };

    Guild.findOne( queryGuild )
    .populate('events')
    .exec(function (err, guild) {
      if (err) {
        console.log(err);
        res.json({
          message: "Error finding server"
        });
      } else if (!err) {
        if (!guild.events) {
          res.json({
            events: []
          });
        } else if (guild.events) { 
          if (Array.isArray(guild.events)) {          
            res.json({
              events: guild.events,
              name: guild.guild_name,
              icon: guild.icon
            });
          }
        }
      } 
    });        
  } catch (error) {
    console.log(error);
    logger.error("appAPI /guildevents POST route error.",req.user, req.body, error)
  } finally {
    logger.info("appAPI /guildevents POST route.",req.user, req.body);
  }
  
});

// @route   DELETE app/dropevent
// @desc    Delete event with DELETE body Object
// @access  Private
router.delete("/dropevent", authCheck, (req, res)=> {
  try {
    const reqEvent = req.body.event;
    const reqGID = reqEvent.guild_id;
    const eventID = reqEvent.event_id;  
    const queryEvent = { _id: eventID };
    const queryGuild = { guild_id: reqGID, user_id: req.user._id };

    GuildEvent.deleteOne( queryEvent, err => {
      if (err) {
        console.log(err);
        res.json({
          message: "Error finding user"
        });
      }      
    })
    .then( ()=> {
      Guild.findOne( queryGuild, ( err, guild )=> {
        if (guild) {
          if (Array.isArray(guild.events)) {
            guild.events.pull(eventID);          
            guild.save()
          }
        } else if (err) {
          console.log(err);
          res.json({
            message: "Error deleting event reference"
          });
        }
      });
    })
    .then( ()=> {
      res.json({
        message: "Monitor has been removed"
      });
      removeService(eventID);
      monDB.deletePingData(eventID);
      monDB.deleteEventLogs(eventID);
    })
    .then(()=> {
      monDB.deletePingData(eventID);
      monDB.deleteEventLogs(eventID);
    })
  } catch (error) {
    console.log(error);
    logger.error("appAPI /dropevent POST route error.",req.user, req.body, error);
  } finally {
    logger.info("appAPI /dropevent POST route.",req.user, req.body);
  }
});

// @route   POST app/addevent
// @desc    POST a new event to the guild events database
// @access  Private
router.post("/limit-check", authCheck, monitorLimitCheck, (req, res)=> {
  res.status(200).send('Good Request');
  console.log("Inside limit-check");
  logger.info("appAPI /limit-check POST route.",req.user, req.body)
});

// @route   POST app/creatguild
// @desc    Get/Create events with post body Object
// @access  Private
router.post("/createguild", authCheck, (req, res)=> {
  try {
    const reqEvent = req.body.event;
    const reqGID = reqEvent.guild_id;
    const queryGuild = { guild_id: reqGID, user_id: req.user._id };

    Guild.findOne( queryGuild, (err, guild)=> {
      if (!err) {
        const hasFields = reqEvent.guild_id && reqEvent.name && reqEvent.admin && reqEvent.icon;
        if (!guild && hasFields) {                        
          new Guild({
            user_id: req.user._id,
            guild_id: reqEvent.guild_id,
            guild_name: reqEvent.name,
            admin: reqEvent.admin,
            icon: reqEvent.icon,        
          }).save()
          .then( () => {        
            res.json({
              message: "Guild Commands DB created"
            });        
          });
        } else if (guild) {      
          res.json({
            message: "Guild Allready exists"
          });      
        }
      }
    });
  } catch (error) {
    res.json({
      message: "Error finding server"
    });
    console.log(error);
    logger.error("appAPI /createguild POST route error.",req.user, req.body, error);
  } finally {
    logger.info("appAPI /createguild POST route.",req.user, req.body);
  }
});

// @route   GET app/getuserlogs
// @desc    Get user events logs
// @access  Private
router.get("/getuserlogs", authCheck ,(req, res)=> {  
  try {
    const queryUserLogs = { user_id: req.user._id };

    EventLog.find(queryUserLogs)
    .sort({initial_date: -1})
    .limit(20)
    .exec((err, logsObj)=> {
      if(!err) {
        const eventLogsArry = [];
        for (const event in logsObj) {
          if (logsObj.hasOwnProperty(event)) {
            const currEvent = logsObj[event];
            delete currEvent._doc.__v;
            delete currEvent._doc._id;
            delete currEvent._doc.event_id;
            delete currEvent._doc.user_id;
            eventLogsArry.push(currEvent._doc);
          }
        }
        res.json({
          event_logs: eventLogsArry
        });
      }
    })    
  } catch (error) {
    console.log(error);
    logger.error("appAPI /getuserlogs GET route error.",req.user , error);
  } finally {
    logger.info("appAPI /getuserlogs GET route.",req.user);
  }
  
});

// @route   POST app/eventoverview
// @desc    Get event overview data for an monitor with post body Object
// @access  Private
router.post("/eventoverview", authCheck ,(req, res)=> {
  // 24h
  const currentTime = new Date().getTime();

  // 7 days 

  // 30 days 


  try {
    const reqEvent = req.body.event;
    const reqEID = reqEvent.eventID;  
    const queryEventLogs = {event_id: reqEID};
    
    EventLog.find(queryEventLogs)  
    .sort({initial_date: -1})
    .limit(100)
    .exec((err, logsObj)=> {
      if(!err) {
        const eventLogsArry = [];
        for (const event in logsObj) {
          if (logsObj.hasOwnProperty(event)) {
            const currEvent = logsObj[event];
            delete currEvent._doc.__v;
            delete currEvent._doc._id;
            delete currEvent._doc.event_id;
            delete currEvent._doc.user_id;
            eventLogsArry.push(currEvent._doc);
          }
        }
        if(eventLogsArry.length > 0) {
          res.json({
            event_logs: eventLogsArry
          });
        }
      }    
      
    });
  } catch (error) {
    console.log(error);
    logger.error("appAPI /geteventlogs POST route error.",req.user, req.body, error);
  } finally {
    logger.info("appAPI /geteventlogs POST route.",req.user, req.body);
  }
});

// @route   POST app/geteventlogs
// @desc    Get event logs with post body Object
// @access  Private
router.post("/geteventlogs", authCheck ,(req, res)=> {
  try {
    const reqEvent = req.body.event;
    const reqEID = reqEvent.eventID;  
    const queryEventLogs = {event_id: reqEID};
    
    EventLog.find(queryEventLogs)  
    .sort({initial_date: -1})
    .limit(100)
    .exec((err, logsObj)=> {
      if(!err) {
        const eventLogsArry = [];
        for (const event in logsObj) {
          if (logsObj.hasOwnProperty(event)) {
            const currEvent = logsObj[event];
            delete currEvent._doc.__v;
            delete currEvent._doc._id;
            delete currEvent._doc.event_id;
            delete currEvent._doc.user_id;
            eventLogsArry.push(currEvent._doc);
          }
        }
        if(eventLogsArry.length > 0) {
          res.json({
            event_logs: eventLogsArry
          });
        }
      }    
      
    });
  } catch (error) {
    console.log(error);
    logger.error("appAPI /geteventlogs POST route error.",req.user, req.body, error);
  } finally {
    logger.info("appAPI /geteventlogs POST route.",req.user, req.body);
  }
});

// @route   POST app/getlogs
// @desc    Get event logs with post body Object
// @access  Private
router.post("/getlogs", authCheck ,(req, res)=> {
  try {
    const reqEvent = req.body.event;
    const reqEID = reqEvent.eventID;  
    const queryEventLogs = {event_id: reqEID};

    EventLog.find(queryEventLogs)  
    .sort({initial_date: -1})
    .limit(20)
    .exec((err, logsObj)=> {
      if(!err) {
        const eventLogsArry = [];
        for (const event in logsObj) {
          if (logsObj.hasOwnProperty(event)) {
            const currEvent = logsObj[event];
            delete currEvent._doc.__v;
            delete currEvent._doc._id;
            delete currEvent._doc.event_id;
            delete currEvent._doc.user_id;
            eventLogsArry.push(currEvent._doc);
          }
        }
        if(eventLogsArry.length > 0) {
          res.json({
            event_logs: eventLogsArry
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
    logger.error("appAPI /getlogs POST route error.",req.user, req.body, error);
  } finally {
    logger.info("appAPI /geteventlogs POST route.",req.user, req.body);
  }
});

// @route   POST app/pingdata
// @desc    Get ping data
// @access  Private
router.post("/pingdata", authCheck ,(req, res)=> {
  try {
    const eventID = req.body.event.event_id;  
    const queryGuild = {event_id: eventID};
    const pingLimit = req.user.role === roleConfig.PROROLE ? 60 : 12;

    PingData.find(queryGuild)
    .sort({date: -1})
    .limit(pingLimit)
    .exec((err, pingDataObj)=> {
      if(!err) {
        let pingDataArray = [];
        for (const pingdata in pingDataObj) {
          if (pingDataObj.hasOwnProperty(pingdata)) {
            const currentPingData = pingDataObj[pingdata];
            delete currentPingData._doc.__v;
            delete currentPingData._doc._id;
            delete currentPingData._doc.event_id;
            pingDataArray.push(currentPingData._doc);
          }
        } 
        if(pingDataArray.length > 0) {
          let newArray = [];
          for (let ping = pingDataArray.length - 1; ping >= 0; ping--) {
            const newPing = pingDataArray[ping];
            newArray.push(newPing)
          }
          if(newArray.length > 0) {
            res.json({
              ping_data: newArray
            });
          }
        }
      }
    })
  } catch (error) {
    console.log(error);
    logger.error("appAPI /pingdata POST route error.",req.user, req.body, error);
  } finally {
    logger.info("appAPI /pingdata POST route.",req.user, req.body);
  }
});

// @route   POST app/pingdata2
// @desc    Get ping data
// @access  Private
router.post("/pingdata2", authCheck ,(req, res)=> {
  try {
    const eventID = req.body.event.event_id;  
    const queryGuild = {event_id: eventID};
    const pingLimit = req.user.role === roleConfig.PROROLE ? 120 : 24;

    PingData.find(queryGuild)
    .sort({date: -1})
    .limit(pingLimit)
    .exec((err, pingDataObj)=> {
      let pingDataArray = [];
      for (const pingdata in pingDataObj) {
        if (pingDataObj.hasOwnProperty(pingdata)) {
          const currentPingData = pingDataObj[pingdata];
          delete currentPingData._doc.__v;
          delete currentPingData._doc._id;
          delete currentPingData._doc.event_id;
          pingDataArray.push(currentPingData._doc);
        }
      }
      if(pingDataArray.length > 0) {
        let newArray = [];
        for (let ping = pingDataArray.length - 1; ping >= 0; ping--) {
          const newPing = pingDataArray[ping];
          newArray.push(newPing)
        }
        if(newArray.length > 0) {
          res.json({
            ping_data: newArray
          });
        }
      }
    })
  } catch (error) {
    console.log(error );
    logger.error("appAPI /pingdata2 POST route error.",req.user, req.body, error);
  }
  
});

// @route   POST app/pingdata3
// @desc    Get ping data
// @access  Private
router.post("/pingdata3", authCheck ,(req, res)=> { 
  try {
    const eventID = req.body.event.event_id;  
    const queryGuild = {event_id: eventID};
    const pingLimit = req.user.role === roleConfig.PROROLE ? 180 : 36;

    PingData.find(queryGuild)
    .sort({date: -1})
    .limit(pingLimit)
    .exec((err, pingDataObj)=> {
      let pingDataArray = [];
      for (const pingdata in pingDataObj) {
        if (pingDataObj.hasOwnProperty(pingdata)) {
          const currentPingData = pingDataObj[pingdata];
          delete currentPingData._doc.__v;
          delete currentPingData._doc._id;
          delete currentPingData._doc.event_id;
          pingDataArray.push(currentPingData._doc);
        }
      }
      if(pingDataArray.length > 0) {
        let newArray = [];
        for (let ping = pingDataArray.length - 1; ping >= 0; ping--) {
          const newPing = pingDataArray[ping];
          newArray.push(newPing)
        }
        if(newArray.length > 0) {
          res.json({
            ping_data: newArray
          });
        }
      }
    })
  } catch (error) {
    console.log(error);
    logger.error("appAPI /pingdata3 POST route error.",req.user, req.body, error);
  }
});

// @route   POST app/pingdata6
// @desc    Get ping data
// @access  Private
router.post("/pingdata6", authCheck ,(req, res)=> { 
  try {
    const eventID = req.body.event.event_id;  
    const queryGuild = {event_id: eventID};
    const pingLimit = req.user.role === roleConfig.PROROLE ? 360 : 72;

    PingData.find(queryGuild)
    .sort({date: -1})
    .limit(pingLimit)
    .exec((err, pingDataObj)=> {
      let pingDataArray = [];
      for (const pingdata in pingDataObj) {
        if (pingDataObj.hasOwnProperty(pingdata)) {
          const currentPingData = pingDataObj[pingdata];
          delete currentPingData._doc.__v;
          delete currentPingData._doc._id;
          delete currentPingData._doc.event_id;
          pingDataArray.push(currentPingData._doc);
        }
      }
      if(pingDataArray.length > 0) {
        let newArray = [];
        for (let ping = pingDataArray.length - 1; ping >= 0; ping--) {
          const newPing = pingDataArray[ping];
          newArray.push(newPing)
        }
        if(newArray.length > 0) {
          res.json({
            ping_data: newArray
          });
        }
      }
    })
  } catch (error) {
    console.log(error);
    logger.error("appAPI /pingdata6 POST route error.",req.user, req.body, error);
  }
});

// @route   POST app/pingdata12
// @desc    Get ping data
// @access  Private
router.post("/pingdata12", authCheck ,(req, res)=> {
  try {
    const eventID = req.body.event.event_id;  
    const queryGuild = {event_id: eventID};
    const pingLimit = req.user.role === roleConfig.PROROLE ? 720 : 144;

    PingData.find(queryGuild)
    .sort({date: -1})
    .limit(pingLimit)
    .exec((err, pingDataObj)=> {
      let pingDataArray = [];
      for (const pingdata in pingDataObj) {
        if (pingDataObj.hasOwnProperty(pingdata)) {
          const currentPingData = pingDataObj[pingdata];
          delete currentPingData._doc.__v;
          delete currentPingData._doc._id;
          delete currentPingData._doc.event_id;
          pingDataArray.push(currentPingData._doc);
        }
      }
      if(pingDataArray.length > 0) {
        let newArray = [];
        for (let ping = pingDataArray.length - 1; ping >= 0; ping--) {
          const newPing = pingDataArray[ping];
          newArray.push(newPing)
        }
        if(newArray.length > 0) {
          res.json({
            ping_data: newArray
          });
        }
      }
    })
  } catch (error) {
    console.log(error);
    logger.error("appAPI /pingdata12 POST route error.",req.user, req.body, error);
  }
});

module.exports = router;