const GuildEvent  = require('../models/GuildEvent');
const PingData  = require('../models/PingData');
const EventLog = require('../models/EventLog');

class UpMonDB {
    /**
   * Save ping data
   * @param {ObjectID} eventID 
   * @param {Number} resTime 
   * @param {String} status
   * @param {Number} resNum
   */
  savePing(eventID, resTime, status, resNum) {
    try {      
      new PingData({
        event_id: eventID,
        res_time: resTime,
        status: status,
        res_num: resNum
      }).save()
    } catch (error) {
      console.log(error);    
    }
  }
  /**
   * Update status of monitor event
   * @param {ObjectID} eventID - service ObjectID
   * @param {String} eventStatus - Current event satatus
   */
  updateStatus(eventID, eventStatus) {
    try {
      GuildEvent.updateOne(
        {"_id": eventID},
        {$set: {status: eventStatus}},
        (err)=> {
          if(err) console.log(err);      
        }
      )
    } catch (error) {
      console.log(error);
    }
  }
  
  updateOperational(eID, eStatus) {
    try {
      EventLog.find({event_id: eID, event_type: eStatus})
      .sort({initial_date: -1})
      .limit(1)
      .exec((err, logDoc)=> {
        if(!err) {
          console.log(logDoc[0]._id);
          EventLog.updateOne(
            {_id: logDoc[0]._id},
            {$set: { end_date: new Date().getTime()}},
            (err)=> {
              if(err) console.log(err);      
            }
          );
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  updatefromOutage(eID, eStatus) {
    try {
      EventLog.find({event_id: eID, event_type: eStatus})
      .sort({initial_date: -1})
      .limit(1)
      .exec((err, logDoc)=> {
        if(!err) {
          console.log(logDoc[0]._id);
          EventLog.updateOne(
            {_id: logDoc[0]._id},
            {$set: { end_date: new Date().getTime()}},
            (err)=> {
              if(err) console.log(err);      
            }
          );
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  updatefromDegrade(eID, eStatus) {
    try {
      EventLog.find({event_id: eID, event_type: eStatus})
      .sort({initial_date: -1})
      .limit(1)
      .exec((err, logDoc)=> {
        if(!err) {
          console.log(logDoc[0]._id);
          EventLog.updateOne(
            {_id: logDoc[0]._id},
            {$set: { end_date: new Date().getTime()}},
            (err)=> {
              if(err) console.log(err);      
            }
          );
        }
      });
    } catch (error) {
      console.log(error);      
    }
  }

  pauseEvent(uID, eID, eName, eType) {
    try {
      new EventLog({
        user_id: uID,
        event_id: eID,
        monitor_name: eName,
        event_type: eType,
      }).save()
    } catch (error) {
      console.log(error);
    }
  }

  updateFromPause(eID, eStatus) {
    try {
      EventLog.find({event_id: eID, event_type: eStatus})
      .sort({initial_date: -1})
      .limit(1)
      .exec((err, logDoc)=> {
        if(!err) {
          console.log(logDoc[0]._id);
          EventLog.updateOne(
            {_id: logDoc[0]._id},
            {$set: { end_date: new Date().getTime()}},
            (err)=> {
              if(err) console.log(err);      
            }
          );
        }
      });
    } catch (error) {
      console.log(error);
    }    
  }

  startEvent(uID, eID, eName, eType) {
    try {
      new EventLog({
        user_id: uID,
        event_id: eID,
        monitor_name: eName,
        event_type: eType,
        end_date: new Date().getTime()
      }).save()
    } catch (error) {
      console.log(error);
    }
  }

  upMonEvent(uID, eID, eName, eType, resNum, resStatus) {
    try {
      new EventLog({
        user_id: uID,
        event_id: eID,
        monitor_name: eName,
        event_type: eType,
        res_num: resNum,
        res_status: resStatus,
      }).save()
    } catch (error) {
      console.log(error);
    }
  }
  
  deletePingData(eventID) {
    try {
      PingData.deleteMany({event_id: eventID}, err => {
        if (err) {          
          console.log(err);
        }      
      })
    } catch (error) {
      console.log(error);
    }
  }

  deleteEventLogs(eventID) {
    try {
      EventLog.deleteMany({event_id: eventID}, err => {
        if (err) {          
          console.log(err);
        }      
      })
    } catch (error) {
      console.log(error);
    }
  }
  getMonitorCurrentStatus(eventID, callback) {    
    GuildEvent.findOne({_id: eventID}, (err, thisEvent)=> {
      if(err) {
        callback("error")
      } else if (thisEvent) {        
        callback(null, thisEvent.status)
      }
    })
  }
}
module.exports = UpMonDB; 