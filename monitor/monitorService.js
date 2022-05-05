const UpMon = require('./UpMon');
const GuildEvent  = require('../models/GuildEvent');
const upmon = new UpMon({ DISCORD_MONNOTE_URL: "http://localhost:5050/discord/monnote" });

GuildEvent.find({}, (err, allEvents)=> {
    if (err) { console.log(err) }
    let activeMonitorEvents = [];
    for (const event in allEvents) {
        if (allEvents.hasOwnProperty(event)) {
            const currentEvent = allEvents[event];
            delete currentEvent._doc.__v;
            const container = { ...currentEvent._doc };                
            container.timeoutId = undefined;
            container.serviceStatus = {};
            activeMonitorEvents.push(container);
        }
    }
    if (activeMonitorEvents.length > 0) {                
        upmon.startAll(activeMonitorEvents);
        console.log('* UpMon has started. ' + activeMonitorEvents.length + ' services loaded');
    }
});

/**
 * addService function.
 * @param {Object} serviceObj
 */
module.exports.addService = addService = (serviceObj) => {    
    upmon.addService(serviceObj);
}
/**
 * addEditedService function.
 * @param {Object} serviceObj
 */
module.exports.addEditedService = addEditedService = (serviceObj) => {    
    upmon.addEditedService(serviceObj);
}
/**
 * removeService function.
 * @param {String} id
 */
module.exports.removeService = removeService = (id) => {  
    upmon.removeService(id);
}
/**
 * stop function.
 * @param {String} id
 */
module.exports.stop = stop = (id) => {  
    upmon.stop(id);
}
/**
 * Start function.
 * @param {String} id
 */
module.exports.start = start = (id) => {
    upmon.start(id);
}
/**  
 * Notification error event listener 
 * @param {Object} error
 * @param {Object} service
 */
upmon.on('ping-service-error', (error, service)=> {
    console.log(error);
    console.log(service);
});