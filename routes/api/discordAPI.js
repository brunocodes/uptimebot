const router = require('express').Router();
const fetch = require('node-fetch');
const  {GuildMonitorEvent, getChannelID, getRoleID, guildCheck} = require('../../discordbot/discordBot');
const {logger, log4js} = require('../../logging/logger');
require('dotenv').config();

const sessionAuthCheck = (req, res, next) => {
  if(true ){ // if user req.user._id 
    res.status(403).send('Forbidden')
  } else {
      next();
  }
};

const frontAuthCheck = (req, res, next) => {
  if(req.headers.origin !== process.env.HOME_PAGE){
    res.status(403).send('Forbidden')
  } else {
      next();
  }
};

const backAuthCheck = (req, res, next) => {
  if(req.headers.host != process.env.HOME_PAGE && req.body.internalSercretString == "hf384IIllc91518f54044d38b657b0b1"){
    res.status(403).send('Forbidden')
  } else {
      next();
  }
};


// @route   POST discord/channelid
// @desc    Get channel id by guild id and channel name.
// @access  Private
router.post("/channelid", frontAuthCheck, (req, res) => {  
  try {
    const reqObj = req.body.get_channel;
    const guildID = reqObj.guild_id;
    const channelName = reqObj.channel_name;

    const results = getChannelID(guildID, channelName);  
    if (results) {
      res.json({
        channel: results
      });
    }
  } catch (error) {
    console.log(error);
    logger.error("discordAPI /channelid POST route error.",req.user, req.body, error);    
  } finally {
    logger.info("discordAPI stop-service POST route.",req.user, req.body);
  }
});

// @route   POST discord/roleid
// @desc    Get role id by guild id and role name.
// @access  Private
router.post("/roleid", frontAuthCheck, (req, res) => {
  try {
    const reqObj = req.body.get_role;
    const guildID = reqObj.guild_id;
    const roleName = reqObj.role_name;

    const results = getRoleID( guildID, roleName);  
    if (results) {
      res.json({
        role: results
      });
    }
  } catch (error) {
    console.log(error);
    logger.error("discordAPI /roleid POST route error.",req.user, req.body, error);
  } finally {
    logger.info("discordAPI /roleid POST route.",req.user, req.body);
  }
});

// @route   POST discord/monnote
// @desc    Monitor notifications Down/UP // DEGRADED OPERATIONAL OUTAGE
// @access  Private
router.post("/monnote", backAuthCheck, (req, res) => {
  try {
    const eventServiceObj = req.body.serviceObj;  
    const serviceStatusObj = req.body.serviceObj.serviceStatus;

    const guildID = eventServiceObj.guild_id;
    const roleID = eventServiceObj.role; 
    const channelID = eventServiceObj.channel;

    if (serviceStatusObj.status == "OUTAGE") {
      const msg = `The monitor ${eventServiceObj.name} is currently DOWN :arrow_down:. ${serviceStatusObj.requestTime}`;
      GuildMonitorEvent( guildID, channelID, roleID, msg);
      res.json({
        message: "Alert posted successfully"
      }); 

    } else if (serviceStatusObj.status == "DEGRADED") {
      if(serviceStatusObj.previousStatus === "OUTAGE") {
        const msg = `The monitor ${eventServiceObj.name} is currently OPERATIONAL :arrow_up: but experiencing Latency. ${serviceStatusObj.requestTime}`;
        GuildMonitorEvent( guildID, channelID, roleID, msg);
        res.json({
          message: "Alert posted successfully"
        });
      } else {
        const msg2 = `The monitor ${eventServiceObj.name} is currently experiencing Latency. ${serviceStatusObj.requestTime}`;
        GuildMonitorEvent( guildID, channelID, roleID, msg2);
        res.json({
          message: "Alert posted successfully"
        });
      }
    } else if (serviceStatusObj.status == "OPERATIONAL") {
      const msg = `The monitor ${eventServiceObj.name} is currently OPERATIONAL :arrow_up:. ${serviceStatusObj.requestTime}`;
      GuildMonitorEvent( guildID, channelID, roleID, msg);
      res.json({
        message: "Alert posted successfully"
      });
    }
  } catch (error) {
    console.log(error);
    logger.error("discordAPI /monnote POST route error.",req.user, req.body, error);
  } finally {
    logger.info("discordAPI /monnote POST route.",req.user, req.body);
  }
});

// @route   GET discord/getguilds
// @desc    Twitch API GET Channel modertion events
// @access  Public
router.get("/getguilds", frontAuthCheck, (req, res) => {
  try {
    const userToken = req.user.token;

    fetch(`https://discord.com/api/users/@me/guilds`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    })
    .then((response) => {      
      if(response.status === 401) {
        throw Error("User token 401 Unauthorized");
      } else if(response.status === 200) {
        return response.json();
      } else {
        throw Error("There was an error retrieving server list");
      }  
    })
    .then((response) => {
      // console.log(response);
      const reqGulids = response;
      const resCheck = guildCheck();  
      const container = {};
      const resGulids =  reqGulids.map( server => {
        const guildTrue = resCheck.find( (id) => id == server.id ? true : false );    
        // if guildTrue and server.permissions == 2147483647    
        if (guildTrue && server.permissions == 2147483647) {
          const container = { ...server };
          container.managed = true;
          container.admin = true;   
          delete container.features;
          return container;
          
        }
        // if guildTrue false and server.permissions == 2147483647
        else if (!guildTrue && server.permissions == 2147483647) {
          const container = { ...server };
          container.managed = false;
          container.admin = true;
          delete container.features;   
          return container;
        }
        // if server.permissions !== 2147483647 
        else if (server.permissions !== 2147483647) {
          const container = { ...server };
          container.managed = false;
          container.admin = false;
          delete container.features;
          return container;
        }  
      });  
      res.json({
        managedGuilds: resGulids
      });
    });
  } catch (error) {
    if(error.message == "User token 401 Unauthorized") {
      console.log(error);  
      res.status(401).send(error.message);
    } else {
      console.log(error);
      res.status(400).send(error.message);
    }
    logger.error("discordAPI /getguilds GET route error.",req.user, error);
  } finally {
    logger.info("discordAPI /getguilds GET route.",req.user);
  }
});

// @route   POST discord/managed
// @desc    Bot Managed guilds
// @access  Private
// router.post("/managed", frontAuthCheck, (req, res) => {
//   console.log(req.headers.origin);
//   const reqGulids = req.body.guilds;
//   const resCheck = guildCheck();  
//   const resGulids =  reqGulids.map((server) => {
//     const container = {};
//     const guildTrue = resCheck.find((id) => id == server.id ? true : false);
//     // if guildTrue and server.permissions == 2147483647    
//     if (guildTrue && server.permissions == 2147483647) {
//       const container = {...server};
//       container.managed = true;
//       container.admin = true;      
//       return container;
      
//     }
//     // if guildTrue false and server.permissions == 2147483647
//     else if (!guildTrue && server.permissions == 2147483647) {
//       const container = {...server};
//       container.managed = false;
//       container.admin = true;      
//       return container;
//     }
//     // if server.permissions !== 2147483647 
//     else if (server.permissions !== 2147483647) {
//       const container = {...server};
//       container.managed = false;
//       container.admin = false;      
//       return container;
//     }  
//   });  
//   res.json({
//       managedGuilds: resGulids
//   });
//   logger.info("discordAPI /managed POST route.",req.user, req.body);
// });

module.exports = router;