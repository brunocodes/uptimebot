import React, { useState, useEffect } from 'react';
import { ListGroup, Table, Badge, Button, Spinner } from 'react-bootstrap';

const EventLogs = ({eventID})=> {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [logsPerPage] = useState(10);

    useEffect(() => {
        getLogs()
    }, []);
    const getLogs = () => {
        try {
            setLoading(true);
            fetch("http://localhost:5050/app/geteventlogs", {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify({
                    event: { eventID: eventID }
                })
            })
            .then(res => {
                if(res.status === 200) {
                    return res.json();
                } else {
                    throw Error("Failed to retrieve monitoring events") 
                }                
            }).then(res=> {
                setLogs(res.event_logs);
                setLoading(false);
            })         
        } catch (error) {
            console.log(error);
        }
    };

    // Get current posts
    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className='container'>
            <Logs logs={currentLogs} loading={loading} getLogs={getLogs} />
            <Pagination
                postsPerPage={logsPerPage}
                totalPosts={logs.length}
                paginate={paginate}
            />            
        </div>
    )
}

const Logs = ({ logs, loading, getLogs }) => {
    if (loading) {
      return <Spinner animation="border" variant="light" />;
    }
  
    return (
        <ListGroup.Item style={{ backgroundColor: "#404044" }}>
            <Button variant="outline-success" className="float-right" size="sm" onClick={()=> {getLogs()}}>
                <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                </svg>
                {" "} Refresh
            </Button>
            <p className="text-center">Latest events of all monitors (Up, Down, Latency, Pause, start)</p>
            <Table responsive bordered hover variant="dark" size="sm" style={{ backgroundColor: "#404044" }}>
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Monitor</th>
                        <th>Time</th>
                        <th>Reason</th>
                        <th>Duration (DD:HH:MM)</th>
                    </tr>
                </thead>
                <tbody>
                {!logs ?  null : logs.map(( eventLog ) => (                
                    <tr key={eventLog.initial_date}>
                    {eventType(eventLog)}
                    </tr>
                )) }
                </tbody>
            </Table>            
        </ListGroup.Item>    
    );
};
const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
    const pageNumbers = [];
  
    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
      pageNumbers.push(i);
    }
  
    return (
      <nav>
        <ul className="pagination justify-content-center">
          {pageNumbers.map(number => (
            <li key={number} className="page-item">
              <a onClick={() => paginate(number)} className='page-link' style={{backgroundColor: "#4c4c51"}}>
                {number}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
};
const eventType = (eventLog) => {
    let returnValue;
    const initialTime = new Date(eventLog.initial_date).toLocaleTimeString();
    const yearDate = eventLog.initial_date.slice(0, 10)
    let timeStart = new Date(eventLog.initial_date).getTime();
    let timeEnd = new Date(eventLog.end_date).getTime();
    let secDiff = (timeEnd - timeStart) / 1000; 
    secDiff /= 60;
    let totalMins = Math.abs(Math.round(secDiff));
    let hours = Math.floor(totalMins / 60);
    let minutesRaw = totalMins % 60;    
    // days / hours / min
    let days = Math.floor(hours / 24);
    let hoursView = Math.floor(hours) % 24;    
    let minutes = minutesRaw < 10 ? `0${minutesRaw}` : minutesRaw;
    let hoursDisplay = hoursView < 10 ? `0${hoursView}` : hoursView;
    
    // Current event time 
    let currentEventEndTime = new Date().getTime();
    let currentEventsecDiff = (currentEventEndTime - timeStart) / 1000; 
    currentEventsecDiff /= 60;
    let currentEventTotalMins = Math.abs(Math.round(currentEventsecDiff));
    let currentEventHours = Math.floor(currentEventTotalMins / 60);
    let currentMinutes = currentEventTotalMins % 60;
    // current days / hours / min
    let currentDays = Math.floor(currentEventHours / 24);
    let currentHours = Math.floor(currentEventHours) % 24;
    //let currentMinutes = (currentEventHours - Math.floor(currentEventHours)) * 60;
    let currentMins = currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes;
    let currentHoursDisplay = currentHours < 10 ? `0${currentHours}` : currentHours;
    let currentTime = `${currentDays}:${currentHoursDisplay}:${currentMins}`;

    //let durration = Number.isNaN(hours) && Number.isNaN(minutes) ? currentTime :`${hours}:${minutes}`;
    let durration = Number.isNaN(hours) && Number.isNaN(minutesRaw) ? currentTime :`${days}:${hoursDisplay}:${minutes}`;
    switch (eventLog.event_type) {
        case "OPERATIONAL":
            returnValue = (<>
                <td><Badge variant="success">Up</Badge></td>
                <td>{eventLog.monitor_name}</td>
                <td>{initialTime +" - "+ yearDate}</td>
                <td>{eventLog.res_status} {eventLog.res_num}</td>
                <td>{durration}</td>
            </>)
            break;
        case "DEGRADED":
            returnValue = (<>
                <td><Badge variant="warning">Degraded</Badge></td>
                <td>{eventLog.monitor_name}</td>
                <td>{initialTime +" - "+ yearDate}</td>
                <td>{eventLog.event_type}</td>
                <td>{durration}</td>
            </>)
            break;
        case "OUTAGE":
            returnValue = (<>
                <td><Badge variant="danger">Down</Badge></td>
                <td>{eventLog.monitor_name}</td>
                <td>{initialTime +" - "+ yearDate}</td>
                <td>{eventLog.event_type}</td>
                <td>{durration}</td>
            </>)
            break;
        case "PAUSE":
            returnValue = (<>
                <td><Badge variant="light">Paused</Badge></td>
                <td>{eventLog.monitor_name}</td>
                <td>{initialTime +" - "+ yearDate}</td>
                <td>{eventLog.event_type}</td>
                <td>{durration}</td>
            </>)
            break;
        case "START":
            returnValue = (<>
                <td><Badge variant="primary">Started</Badge></td>
                <td>{eventLog.monitor_name}</td>
                <td>{initialTime +" - "+ yearDate}</td>
                <td>{eventLog.event_type}</td>
                <td>{durration}</td>
            </>)
            break;
        default:
            returnValue = "";
            break;
    }
    return returnValue;
};
export default EventLogs;