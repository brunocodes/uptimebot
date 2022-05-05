const fetch = require('node-fetch');

class UpMonitor {
  DISCORD_MONNOTE_URL; 
  pingInterval;
  serviceStatus;
  constructor(options) {
    if (!options || (options && !options.DISCORD_MONNOTE_URL)) {
      throw new Error("You need to specify an DISCORD_MONNOTE_URL");
    }
    this.DISCORD_MONNOTE_URL = options.DISCORD_MONNOTE_URL;
    this.pingInterval = 1 * 1000 * 60;
    this.serviceStatus = {};    
  }

  pingService( url, cb ) { 
    console.log("pingService")
    let sendDate = (new Date()).getTime();
    fetch( url , {
      method: "GET"
    })
    .then(res=> {
      if (res.status === 200) {
        var receiveDate = (new Date()).getTime();
        var responseTimeMs = receiveDate - sendDate;
        console.log(url + " " + responseTimeMs )
        cb(responseTimeMs);          
      } else {
        cb("OUTAGE");
      }
    })    
  }
  /**
   * Post notification to discord
   * @param {Object} serviceObj 
   */
  postToDiscord(serviceObj) {
    console.log("postToDiscord");
    let serviceID = serviceObj._id;
    // let message = "";
    // if (this.serviceStatus[serviceID].status == "DEGRADED") {
    //   message = "`Degraded System Service !!!` :skull: ";
    // } else if (this.serviceStatus[serviceID].status == "OPERATIONAL") {
    //   message = "System Operational :robot_face:";
    // } else if (this.serviceStatus[serviceID].status == "OUTAGE") {
    //   message = "System Outage :zzz:";
    // }
    // const reqObj = req.body.get_role; const event = reqObj.event; // event id and name  const guildID = reqObj.guild_id; // Guild id   const roleID = reqObj.role_id; // Role id    const channelID = reqObj.channel_id;// Channel id  //const msg = { // Msg Object Event type , msg       event_type: reqObj.msg.type,      event_msg: reqObj.msg.msg,    }
    
    let discordPayload = {
      serviceObj: serviceObj,
      serviceStatus: this.serviceStatus[serviceID],
      
      // text: `*${message}*\n_${serviceID}_`
    };

    fetch( this.DISCORD_MONNOTE_URL , {
      method: "POST",
      headers: {        
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discordPayload)     
      // body: discordPayload
    })
    .then(res=>{
      console.log("* then")
    })
    .catch( err => {
      if (err) console.log(`Error posting to Discord: ${err}`);
    })
  }

  monitor(websites) {
    console.log("* Monitor function");
    // Array Object/service     // _id: 5ee78bce0e0be60f31a6026a,      // name: 'AppName',     // url: 'Applink.com',      // interval: 300,     // channel: '414263279599353860',      // role: '414263279599353856',      // message: 'The monitor <name> is currently DOWN <response type>. <time>',     // usage: 0,     // guildOnly: true,     // timeout: 200,     // active: true,     // guild_id: '414263279599353856'
    websites.forEach(service => {
      console.log("* service loop UP")
      // if (service.active == true) {
        console.log("* service loop")
        this.serviceStatus[service._id] = {
          status: "OPERATIONAL", // initialize all services as operational when we start
          responseTimes: [], // array containing the responses times for last 3 pings
          timeout: service.timeout // load up the timout from the config
        };
  
        setInterval(() => {
          this.pingService(service.url, serviceResponse => {
            if (
              serviceResponse === "OUTAGE" &&
              this.serviceStatus[service._id].status !== "OUTAGE"
            ) {
              // only update and post to Slack on state change
              this.serviceStatus[service._id].status = "OUTAGE";
              this.postToDiscord(service);
            } else {
              let responseTimes = this.serviceStatus[service._id].responseTimes;
              responseTimes.push(serviceResponse);
  
              // check degraded performance if we have 3 responses so we can average them
              if (responseTimes.length > 3) {
                // remove the oldest response time (beginning of array)
                responseTimes.shift();
  
                // compute average of last 3 response times
                let avgResTime =
                  responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
                let currService = this.serviceStatus[service._id];
  
                if (
                  avgResTime > currService.timeout &&
                  currService.status !== "DEGRADED"
                ) {
                  currService.status = "DEGRADED";
                  this.postToDiscord(service);
                } else if (
                  avgResTime < currService.timeout &&
                  currService.status !== "OPERATIONAL"
                ) {
                  currService.status = "OPERATIONAL";
                  this.postToDiscord(service);
                }
              }
            }
          });
        }, this.pingInterval);
      // }
    });
  }
}

module.exports = UpMonitor;