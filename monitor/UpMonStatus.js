const UpMonDB = require('./UpMonDB');
const monDB = new UpMonDB();

class UpMonStatus {
    monitorCreated(uID, eID, eName) {
        monDB.upMonEvent(
            uID, eID, 
            eName, "OPERATIONAL", 
            200, "OK"
        );
    }
    monitorOutage(serviceObj, serviceResponse) {
        if(serviceObj.serviceStatus.previousStatus === "DEGRADED") {
            monDB.updatefromDegrade( serviceObj._id, "DEGRADED");            
            monDB.updateStatus(serviceObj._id, serviceObj.serviceStatus.status);
            monDB.upMonEvent(
                serviceObj.user_id, serviceObj._id, 
                serviceObj.name, serviceObj.serviceStatus.status, 
                serviceResponse.res_num, serviceResponse.res_status
            );
        } else if(serviceObj.serviceStatus.previousStatus === "OPERATIONAL") {
            monDB.updateOperational(serviceObj._id, "OPERATIONAL")
            monDB.updateStatus(serviceObj._id, serviceObj.serviceStatus.status);
            monDB.upMonEvent(
                serviceObj.user_id, serviceObj._id, 
                serviceObj.name, serviceObj.serviceStatus.status, 
                serviceResponse.res_num, serviceResponse.res_status
            );
        }
    }
    recoveredFromOutage(serviceObj, serviceResponse) {
        // Update Monitor status
        monDB.updateStatus(serviceObj._id, serviceObj.serviceStatus.status);
        // Updade OUTAGE log with end date
        monDB.updatefromOutage(serviceObj._id, "OUTAGE");
        // Create OPERATIONAL Log 
        monDB.upMonEvent(
            serviceObj.user_id, serviceObj._id, 
            serviceObj.name, serviceObj.serviceStatus.status, 
            serviceResponse.res_num, serviceResponse.res_status
        );
    }
    
    monitorDegraded(serviceObj, serviceResponse, responseTimesArray) {
        console.log('Mon Degraded: ', serviceObj._id);
        monDB.updateOperational(serviceObj._id, "OPERATIONAL");
        monDB.updateStatus(serviceObj._id, serviceObj.serviceStatus.status);
        // Create DEGRADED Log 
        monDB.upMonEvent(
            serviceObj.user_id, serviceObj._id, 
            serviceObj.name, serviceObj.serviceStatus.status, 
            serviceResponse.res_num, serviceResponse.res_status
        );
    }
    recoveredFromDegraded(serviceObj, serviceResponse) {
        monDB.getMonitorCurrentStatus(serviceObj._id ,(err, returnStatus)=> {
            console.log("returnStatus:" , returnStatus);
            if(!err) {
                if(returnStatus === "DEGRADED") {
                    // Updade DEGRADED log with end date
                    monDB.updatefromDegrade( serviceObj._id, "DEGRADED");
                    // Update Monitor status
                    monDB.updateStatus(serviceObj._id, serviceObj.serviceStatus.status);
                    // Create OPERATIONAL Log 
                    monDB.upMonEvent(
                        serviceObj.user_id, serviceObj._id, 
                        serviceObj.name, serviceObj.serviceStatus.status, 
                        serviceResponse.res_num, serviceResponse.res_status
                    );
                } else if (returnStatus === "OPERATIONAL") {
                    // Updade DEGRADED log with end date
                    monDB.updateOperational( serviceObj._id, "OPERATIONAL");
                    // Update Monitor status
                    monDB.updateStatus(serviceObj._id, serviceObj.serviceStatus.status);
                    // Create OPERATIONAL Log 
                    monDB.upMonEvent(
                        serviceObj.user_id, serviceObj._id, 
                        serviceObj.name, serviceObj.serviceStatus.status, 
                        serviceResponse.res_num, serviceResponse.res_status
                    );
                }
            }
        });
    }
    // @api/app
    monitorPaused(uID, eID, eName, eStatus, currentStatus) {
        monDB.getMonitorCurrentStatus(eID ,(err, returnStatus)=>{
            console.log("returnStatus:" , returnStatus);
            if(!err) {
                if(returnStatus === "DEGRADED") {
                    monDB.updatefromDegrade(eID, "DEGRADED");
                    monDB.updateStatus(eID, eStatus);
                    monDB.pauseEvent(uID, eID, eName, eStatus); 
                } else if(returnStatus === "OUTAGE") {
                    monDB.updatefromOutage(eID, "OUTAGE");
                    monDB.updateStatus(eID, eStatus);
                    monDB.pauseEvent(uID, eID, eName, eStatus);            
                } else if (returnStatus === "OPERATIONAL") {
                    monDB.updateOperational(eID, "OPERATIONAL")
                    monDB.updateStatus(eID, eStatus);
                    monDB.pauseEvent(uID, eID, eName, eStatus);
                }
            }
        });
    }
    // monitorPaused(uID, eID, eName, eStatus, currentStatus) {
    //     if(currentStatus === "DEGRADED") {
    //         monDB.updatefromDegrade( eID, "DEGRADED");
    //         monDB.updateStatus(eID,eStatus);
    //         monDB.pauseEvent(uID, eID, eName, eStatus);
    //     } else if(currentStatus === "OUTAGE") {
    //         monDB.updatefromOutage(serviceObj._id, "OUTAGE");
    //         monDB.updateStatus(eID,eStatus);
    //         monDB.pauseEvent(uID, eID, eName, eStatus);            
    //     } else {
    //         monDB.updateOperational(eID, "OPERATIONAL")
    //         monDB.updateStatus(eID,eStatus);
    //         monDB.pauseEvent(uID, eID, eName, eStatus);
    //     }
    // }
    resetFromPaused(uID, eID, eName) {
        monDB.startEvent(uID, eID, eName, "START");
        monDB.updateFromPause(eID, "PAUSE");
        monDB.updateStatus(eID, "OPERATIONAL")
        monDB.upMonEvent(
            uID, eID, 
            eName, "OPERATIONAL", 
            200, "OK"
        );
    }
}

module.exports = UpMonStatus;