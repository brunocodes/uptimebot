import React, { Component } from 'react'
import { Nav, ListGroup, Container, Row, Col, Button, Card, Table, Badge, Pagination } from 'react-bootstrap';

export default class EventLogs2 extends Component {

    state = {
        userEvenLogs: [],
        moreData: false,
        fetchingMoreData: false,

        offset: 0,
        tableData: [],
        orgtableData: [],
        perPage: 20,
        currentPage: 0

    }

    componentDidMount() {
        this.initialEventLogs();
    }
    handleEventLogsClick = (e)=> {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.loadMoreData()
        });
    };
    loadMoreData() {
		const data = this.state.orgtableData;
		
		const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
		this.setState({
			pageCount: Math.ceil(data.length / this.state.perPage),
			tableData: slice
		})
	
    }

    initialEventLogs = () => {
        try {
            fetch("http://localhost:5050/app/getlogs", {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify({
                    event: { eventID: this.props.eventID }
                })
            })
            .then(res => {
                if(res.status === 200) {
                    return res.json();
                } else {
                    throw Error("Failed to retrieve monitoring events") 
                }                
            }).then(res=> {
                this.setState({
                    userEvenLogs: res.event_logs
                });
            })         
        } catch (error) {
            console.log(error);
        }
    };

    eventTypeBadge = (eventType) => {
        switch (eventType) {
            case "OPERATIONAL":
                return <Badge variant="success">Up</Badge>;
                break;
            case "DEGRADED":
                return <Badge variant="warning">Degraded</Badge>;
                break;
            case "OUTAGE":
                return <Badge variant="danger">Down</Badge>;
                break;
            case "PAUSE":
                return <Badge variant="light">Paused</Badge>;
                break;
            case "START":
                return <Badge variant="primary">Started</Badge>;
                break;
            default:
                return "";
                break;
        }
    };
    
    eventType = (eventLog) => {
        switch (eventLog.event_type) {
            case "OPERATIONAL":
                return (<tr>
                        <td><Badge variant="success">Up</Badge></td>
                        <td>{eventLog.monitor_name}</td>
                        <td>{eventLog.initial_date}</td>
                        <td>{eventLog.res_status} {eventLog.res_num}</td>
                        <td>{eventLog.end_date}</td>
                    </tr>)
                break;
            case "DEGRADED":
                return (<tr>
                        <td><Badge variant="warning">Degraded</Badge></td>
                        <td>{eventLog.monitor_name}</td>
                        <td>{eventLog.initial_date}</td>
                        <td>{eventLog.event_type}</td>
                        <td>{eventLog.end_date}</td>
                    </tr>)
                break;
            case "OUTAGE":
                return (<tr>
                        <td><Badge variant="danger">Down</Badge></td>
                        <td>{eventLog.monitor_name}</td>
                        <td>{eventLog.initial_date}</td>
                        <td>{eventLog.event_type}</td>
                        <td>{eventLog.end_date}</td>
                    </tr>)
                break;
            case "PAUSE":
                return (<tr>
                    <td><Badge variant="light">Paused</Badge></td>
                    <td>{eventLog.monitor_name}</td>
                    <td>{eventLog.initial_date}</td>
                    <td>{eventLog.event_type}</td>
                    <td>{eventLog.end_date}</td>
                </tr>)
                break;
            case "START":
                return (<tr>
                    <td><Badge variant="primary">Started</Badge></td>
                    <td>{eventLog.monitor_name}</td>
                    <td>{eventLog.initial_date}</td>
                    <td>{eventLog.event_type}</td>
                    <td>{eventLog.end_date}</td>
                </tr>)
                break;
            default:
                return "";
                break;
        }
    };
    moreDataClick = () => {
        let active = 1;
        let items = [];
        for (let number = 1; number <= 10; number++) {
        items.push(
            <Pagination.Item key={number} active={number === active}>
            {number}
            </Pagination.Item>,
        );
        }

        const paginationBasic = (
            <div>    
                <Pagination size="sm">{items}</Pagination>
            </div>
        );
        this.setState({fetchingMoreData: true})
        try {
            fetch("http://localhost:5050/app/geteventlogs", {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify({
                    event: { eventID: this.props.eventID }
                })
            })
            .then(res => {
                if(res.status === 200) {
                    return res.json();
                } else {
                    throw Error("Failed to retrieve monitoring events logs") 
                }                
            }).then(res=> {
                this.setState({
                    userEvenLogs: res.event_logs,
                    moreData: !this.state.moreData,
                    fetchingMoreData: false
                });
            })         
        } catch (error) {
            console.log(error);
        }
    }
    completeEventLogs = () => {        
        try {
            fetch("http://localhost:5050/app/geteventlogs", {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify({
                    event: { eventID: this.props.eventID }
                })
            })
            .then(res => {
                if(res.status === 200) {
                    return res.json();
                } else {
                    throw Error("Failed to retrieve monitoring events") 
                }                
            }).then(res=> {
                this.setState({
                    userEvenLogs: res.event_logs                    
                });
            })         
        } catch (error) {
            console.log(error);
        }
    };
    
    render() {
        const { userEvenLogs, moreData, fetchingMoreData } = this.state;
        return (
            <ListGroup.Item style={{ backgroundColor: "#404044" }}>
            <p className="text-center">Latest events of all monitors (Up, Down, Latency, Pause, start)</p>
                <Table responsive bordered hover variant="dark" size="sm" style={{ backgroundColor: "#404044" }}>
                    <thead>
                        <tr>
                            <th>Event</th>
                            <th>Monitor</th>
                            <th>Time</th>
                            <th>Reason</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                    {!userEvenLogs ?  null : userEvenLogs.map(( eventLog ) => (
                    <>
                        {this.eventType(eventLog)}
                    </>
                    )) }
                    </tbody>
                </Table>
                {!moreData ? <Button variant="outline-info" size="sm" onClick={this.moreDataClick}>More Logs</Button>
                :<Pagination size="sm" onClick={(e)=>{this.handleEventLogsClick(e)}} >
                    <Pagination.Item active={true}>{1}</Pagination.Item>
                    <Pagination.Item>{2}</Pagination.Item>
                    <Pagination.Item>{3}</Pagination.Item>
                </Pagination>}
                                     
            </ListGroup.Item>
        )
    }
}