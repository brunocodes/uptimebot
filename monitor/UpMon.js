const EventEmitter = require('events').EventEmitter;
const fetch = require('node-fetch');
const UpMonDB = require('./UpMonDB')
const monDB = new UpMonDB();
const UpMonStatus = require('./UpMonStatus');
const monStat = new UpMonStatus();
const { logger } = require('../logging/logger');

/**
 * UpMon Service monitoring Class.
 * @extends EventEmitter
 */
class UpMon extends EventEmitter {
  /**
   * UpMon Service monitoring
   * @param {String} DISCORD_MONNOTE_URL - URL to post notification
   * @prop {Number} pingInterval - 6 0000 00
   * @param {Object[]} services - Array of service Objects
   */
  DISCORD_MONNOTE_URL;  pingInterval;  services;
  constructor(options) {
    super();
    if (!options || (options && !options.DISCORD_MONNOTE_URL)) {
      throw new Error("You need to specify an DISCORD_MONNOTE_URL");
    }
    this.DISCORD_MONNOTE_URL = options.DISCORD_MONNOTE_URL;
    this.pingInterval = 1 * 1000 * 60;
    this.services = [];
  }
  /**
   * Post notification to discord
   * @param {Object} serviceObj 
   */
  postToDiscord(serviceObj) {    
    try {
      const discordPayload = {
        serviceObj: serviceObj,
        internalSercretString: "h1f384IIllc91518f54044d38b657b0b1"
      };
      fetch(this.DISCORD_MONNOTE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discordPayload)      
      })
      .then((res) => {
        console.log("* then")
      })
    } catch (error) {
      if(error) {
        console.log(`Error posting to Discord: ${err}`);
        logger.error("Error UpMon class method postToDiscord.",{error})
        //this.emit('notification-error', {error: error, service: serviceObj});
      }
    }
  }
  /**
   * Ping service
   * @param {Object} params - service Object
   * @param {Function} callback - ping result callback
   */
  ping(service, callback) {
    try {
      service.serviceStatus.requestTime = new Date().toLocaleString('en-US', {
        timeZone: `${service.timezone}`
      });
      const sendDate = (new Date()).getTime();

      fetch(service.url, {
        method: "GET"
      })
      .then(res => {
        console.log(res.status);
        const receiveDate = (new Date()).getTime();
        const responseTimeMs = receiveDate - sendDate;        
        monDB.savePing(service._id, responseTimeMs, res.statusText, res.status);
        if (res.status === 200) {
          // callback(responseTimeMs);
          const responseObj = {
            response: responseTimeMs,
            res_num: res.status,
            res_status: res.statusText
          }
          callback(responseObj);
        } else {          
          // callback("OUTAGE");
          const responseObj2 = {
            response: "OUTAGE",
            res_num: res.status,
            res_status: res.statusText
          }
          callback(responseObj2);
        }
      })
    } catch (error) {
      // FetchError // UnhandledPromiseRejectionWarning // this.emit('ping-service-error', error, service);
      const responseObj3 = {
        response: "ERROR",
        res_num: res.status,
        res_status: res.statusText
      }
      callback(responseObj3);     
      console.log(error);
      logger.error("Error UpMon class method ping.",{error, responseObj3})
    }    
  };
  
  /**
   * Launch
   * @param {Object} serviceObj
   */
  _launch(serviceObj) {    
    let self = this;
    let nextDelay = serviceObj.interval * this.pingInterval;
    this.ping( serviceObj , (serviceResponse) => {      
      if (serviceObj.active) {
      serviceResponse.response === "ERROR" ? self._launch(serviceObj) : 
        serviceObj.timeoutId = setTimeout( ()=> {
          if (serviceResponse.response === "OUTAGE" && serviceObj.serviceStatus.status !== "OUTAGE") { 
            // Outage - only update and post to Discord on state change
            serviceObj.serviceStatus.previousStatus = serviceObj.serviceStatus.status;
            serviceObj.serviceStatus.status = "OUTAGE";
            this.postToDiscord(serviceObj);
            monStat.monitorOutage(serviceObj, serviceResponse);
          } else {
            let responseTimes = serviceObj.serviceStatus.responseTimes;            
            if (Number.isInteger(serviceResponse.response)) {
              responseTimes.push(serviceResponse.response) 
            }                       
            // check degraded performance if we have 3 responses so we can average them
            if (responseTimes.length > 3) {              
              responseTimes.shift(); // remove the oldest response time (beginning of array)
              let avgResTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length; // compute average of last 3 response times
              let currService = serviceObj.serviceStatus;
    
              if (avgResTime > currService.timeout && currService.status !== "DEGRADED") {
                serviceObj.serviceStatus.previousStatus = serviceObj.serviceStatus.status;
                if(serviceObj.serviceStatus.status === "OUTAGE") {
                  monDB.updatefromOutage(serviceObj._id, "OUTAGE")
                  currService.status = "DEGRADED";
                  this.postToDiscord(serviceObj);
                  monStat.monitorDegraded(serviceObj, serviceResponse, serviceObj.serviceStatus.responseTimes);
                } else {
                  currService.status = "DEGRADED";
                  this.postToDiscord(serviceObj);
                  monStat.monitorDegraded(serviceObj, serviceResponse, serviceObj.serviceStatus.responseTimes);
                }
              } else if (avgResTime < currService.timeout && currService.status !== "OPERATIONAL") { // Recovered from DEGRADED
                serviceObj.serviceStatus.previousStatus = serviceObj.serviceStatus.status;
                currService.status = "OPERATIONAL";
                this.postToDiscord(serviceObj);
                monStat.recoveredFromDegraded(serviceObj, serviceResponse);                
              }
            } else if(serviceObj.serviceStatus.status === "OUTAGE" && Number.isInteger(serviceResponse.response)) { // Recovered from OUTAGE
              if ( serviceObj.serviceStatus.status !== "OPERATIONAL" ) {
                serviceObj.serviceStatus.previousStatus = serviceObj.serviceStatus.status;
                serviceObj.serviceStatus.status = "OPERATIONAL";
                this.postToDiscord(serviceObj);
                monStat.recoveredFromOutage(serviceObj, serviceResponse);
              }
            }
          }          
          self._launch(serviceObj);
        }, nextDelay);
      }
    });
  };
  /**
   * Starts all services
   * @param {Object[]} servicesArray - Array of service Objects
   * @prop {Number} delay - Delay when starting services, to avoid an initial load peak
   */
  startAll(servicesArray) {    
    const delay = 3000; // 1000  = 1 sec   
    servicesArray.forEach( serviceObj => {
      if (serviceObj.active) {
        setTimeout( ()=> {
          serviceObj.serviceStatus = {
            status: "OPERATIONAL",
            previousStatus: "",
            responseTimes: [],
            timeout: serviceObj.timeout,
            requestTime: ""
          };
          this.services.push(serviceObj);
          this.start(serviceObj._id);
        }, delay);
      } else {
        serviceObj.serviceStatus = {
          status: "OPERATIONAL", // Initialize all services as operational when we start
          previousStatus: "",
          responseTimes: [], // Array containing the responses times for last 3 pings
          timeout: serviceObj.timeout, // Load up the timout from the config
          requestTime: "" // Time of the initial request
        };
        this.services.push(serviceObj);
      }
    });
  };  
  /**
   * Stop all services
   */
  stopAll() {
    let self = this;
    this.services.forEach( serviceObj => {
      if (serviceObj.active) {
        self.stop(serviceObj._id);
      }
    });
  };
  /**
   * Add service to the list of active services
   * @param {Object} serviceObj - service object
   */
  addService(serviceObj) {
    let container = {
      ...serviceObj,
      timeoutId: undefined,
      serviceStatus: {
        status: "OPERATIONAL", // Initialize all services as operational when we start
        previousStatus: "",
        responseTimes: [], // Array containing the responses times for last 3 pings
        timeout: serviceObj.timeout, // Load up the timout from the config
        requestTime: "" // Time of the initial request
      }
    }
    this.services.push(container);
    this.start(container._id);
  };
  /**
   * Add a edited service to the list of active services
   * @param {Object} serviceObj - service object
   */
  addEditedService(serviceObj) {
    let container = {
      ...serviceObj,
      timeoutId: undefined,
      serviceStatus: {
        status: "OPERATIONAL", // Initialize all services as operational when we start 
        previousStatus: "",
        responseTimes: [], // Array containing the responses times for last 3 pings
        timeout: serviceObj.timeout, // Load up the timout from the config
        requestTime: "" // Time of the initial request
      }
    }
    this.services.push(container);
    if(serviceObj.active) {
      this.editedStart(container._id);
    }
    
  };
  /**
   * Remove service from the list of active services
   * @param {String} id - service id
   */
  removeService(id) {
    if (!id) throw new Error('no id provided');

    let pos = this.services.map( s => {
      return s._id.toString();
    }).indexOf(id);

    if (pos == -1) {
      throw new Error('service with id ' + id + ' not found');
    } else {
      // ToDo if sercive active stop and slice - else if slice
      this.stop(id);
      this.services.splice(pos, 1);
    }
  };
  /**
   * Stops one service
   * @param {String} id - service id
   */
  stop(id) {
    let service = this.getServiceById(id);
    if (!id || !service) {
      throw new Error('invalid service id');
    } else {
      console.log("* Service Stopped");
      console.log(service.name);
      clearTimeout(service.timeoutId);
      service.active = false;
    }
  };
  /**
   * Start one service
   * @param {String} id - service id
   */
  start(id) {    
    let service = this.getServiceById(id);    
    if (!id || !service) {
      throw new Error('invalid service id');
    } else {
      if (service.active) { // if active true
        this._launch(service);
      } else if (!service.active) { // else if active false
        console.log( "* Service Started" );
        console.log(service.name);
        service.active = true;
        this._launch(service);
      } 
    } 
  };
  /**
   * Start one service
   * @param {String} id - service id
   */
  editedStart(id) {
    console.log("* Start + " + id);
    let service = this.getServiceById(id);
    console.log("* Start  service + Name: " + service.name); console.log( service );
    if (!id || !service) {
      throw new Error('invalid service id');
    } else { 
      if (service.active) { // if active true
        console.log( "* Service Started PLZ" );
        console.log(service.name);        
        this._launch(service);
      }
    } 
  };
  /**
   * Get service by id
   * @param {String} id - service id
   * @returns {Object} - Returns service object that matches id
   */
  getServiceById(id) {
    return this.services.filter( s => {
      return s._id == id;
    })[0];
  };
}

module.exports = UpMon;