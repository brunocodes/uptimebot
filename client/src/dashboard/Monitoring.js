import React, { Component } from 'react';
import { Nav, ListGroup, Container, Row, Col, Button, Card, Table, Badge, Accordion } from 'react-bootstrap';
import NavServer from './nav/NavServer';
import EditModal from './EditModal';
import MonitorData from './MonitorData';
import AddModal from './AddModal';
import UserEventLogs from './UserEventLogs';

export default class Monitoring extends Component {
    state = {                
        events: [],
        guildName: "",
        guildIcon: null,
        limitReached: false,
        eventsOverview: {
            items: 0,
            active: 0,
            paused: 0
        },        
        isAdding: false,
        isViewingMonitorData: false,
        currentMonitor: {}
    };
    
    componentDidMount() {
        this.fetchEvents()
    }
    fetchEvents() {
        try {
            // const discordID = this.props.userID;
            const currentServer = this.props.server;
            const myEvent = {
                guild_id: currentServer
            };
            fetch("http://localhost:5050/app/guildevents", {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify({
                    event: myEvent
                })
            })
            .then(res => {
                if(res.status === 200) {
                    return res.json();
                } else {
                    throw Error("Failed to retrieve monitoring events") 
                }                
            })
            .then(res => {
                console.log(res.events);
                this.setState({
                    events: res.events,
                    guildName: res.name,
                    guildIcon: res.icon,
                    hasCommads: true
                });
                if (this.state.events.length >= 1) {
                    let items = 0;
                    let active = 0;
                    let paused = 0;
                    this.state.events.forEach( event => {
                        items++; 
                        if ( event.active === true ) {
                            active++;
                        }
                        if ( event.active === false ) {
                            paused++;
                        }
                    });
                    this.setState({
                        eventsOverview: {
                            items: items,
                            active: active,
                            paused: paused
                        }
                    });
                }
                this.limitCheck();
            })
        } catch (error) { 
            console.log("* ERROR: " + error) 
        }
    }
    limitCheck() {
        setTimeout(() => {
            try {
                const newCheck = {
                    discord_id: this.props.userID,
                    guild_id: this.props.server
                };
                console.log(newCheck)
                fetch("http://localhost:5050/app/limit-check", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Credentials": true
                    },
                    body: JSON.stringify({
                        event: newCheck
                    })
                })
                .then(res => {                    
                    if (res.status !== 200) {
                        this.setState({
                            limitReached: true
                        });
                    }
                })
                
            } catch (error) { 
                console.log("* ERROR: " + error) 
            }
        }, 1000);
    }


    handleDeleteClick = (event , e )=> {         
        try {
            const currentServer = this.props.server;
            const eventId = event._id;
            const newDrop = {
                guild_id: currentServer,
                event_id: eventId 
            };
            fetch("http://localhost:5050/app/dropevent", {
                method: "DELETE",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify({
                    event: newDrop
                })
            })
            .then(res => {
                if(res.status === 200) {
                    return res.json()
                } else {
                    throw Error("Failed to delete monitoring event") 
                }
            })
            .then(res => {         
                const newState = this.state;
                const index = newState.events.findIndex(i => i._id === event._id);

                if (index === -1) return;
                newState.events.splice(index, 1);

                this.setState(newState);
            }).then(()=> {
                if (this.state.limitReached) {
                    this.setState({
                        limitReached: false
                    });
                }
            })
        } catch (error) { console.log("* ERROR: " + error) }
    }
    handePauseClick = (event , e )=> {         
        try {            
            const eventId = event._id;
            const currentServer = this.props.server;
            fetch('http://localhost:5050/app/stop-service', {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify({
                    guild_id: currentServer,
                    event_id: eventId,
                    event_name: event.name,
                    status: event.status
                })
            })
            .then(res => {
                if(res.status === 200) {
                    return res.json()
                } else {
                    throw Error("Failed to pause monitoring event") 
                }
            })
            .then( ()=> {         
                this.setState(prevState => ({
                    ...prevState,
                    events: prevState.events.map(stateEvent => ({
                      ...stateEvent,
                      active: stateEvent._id === event._id ? !event.active  : stateEvent.active
                    }))
                }))
                this.fetchEvents()
                this.reloadOverview()
            })  
        } catch (error) { console.log("* ERROR: " + error) }
    }
    handeStartClick = (event , e )=> {         
        try {            
            const eventId = event._id;        
            const currentServer = this.props.server;
            fetch('http://localhost:5050/app/start-service', {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify({
                    guild_id: currentServer,
                    event_id: eventId,
                    event_name: event.name
                })
            })
            .then(res => {
                if(res.status === 200) {
                    return res.json()
                } else {
                    throw Error("Failed to start monitoring event") 
                }
            })
            .then( ()=> {         
                this.setState(prevState => ({
                    ...prevState,
                    events: prevState.events.map(stateEvent => ({
                      ...stateEvent,
                      active: stateEvent._id === event._id ? !event.active : stateEvent.active
                    }))
                }))
                this.fetchEvents()
                this.reloadOverview()
            })  
        } catch (error) { console.log("* ERROR: " + error) }
    }
    reloadOverview = () => {
        if (this.state.events.length >= 1) {
            let items = 0;
            let active = 0;
            let paused = 0;
            this.state.events.forEach( event => {
                items++; 
                if ( event.active === true ) {
                    active++;
                }
                if ( event.active === false ) {
                    paused++;
                }
            });
            this.setState({
                eventsOverview: {
                    items: items,
                    active: active,
                    paused: paused
                }
            });
        }
    }

    toggleItemEditing = currentEventID => {
        console.log(currentEventID)
        this.setState({
            events: this.state.events.map((event) => {
            if (currentEventID === event._id) {
              return {
                ...event,
                isEditing: !event.isEditing
              }
            }
            return event;
          })
        });
    };
    toggleItemAdding = () => {
        this.setState({
            isAdding:  !this.state.isAdding
        });
    };
    handleItemUpdate = eventID => {        
        try {
            const currentEventID = eventID;
            const currentServer = this.props.server;            
            const myEvent = {
                guild_id: currentServer
            };
            console.log(currentServer)
            fetch("http://localhost:5050/app/guildevents", {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify({
                    event: myEvent
                })
            })
            .then(res => res.json())
            .then(res => {                
                this.setState({
                    events: res.events                    
                });
            }); 
        } catch (error) { 
            console.log("* ERROR: " + error) 
        }
    };
    handleItemAdded = eventID => {        
        try {
            const currentEventID = eventID;
            const currentServer = this.props.server;            
            const myEvent = {
                guild_id: currentServer
            };
            console.log(currentServer)
            fetch("http://localhost:5050/app/guildevents", {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify({
                    event: myEvent
                })
            })
            .then(res => res.json())
            .then(res => {                
                this.setState({
                    events: res.events,
                    isAdding: !this.state.isAdding
                });
            }); 
        } catch (error) { 
            console.log("* ERROR: " + error) 
        }
    };

    viewMonitorData = (eventID, eventName, evenetActive, eventStatus) => { // event._id, event.name, event.active, event.status
        const monData = {
            eventID, eventName, evenetActive, eventStatus
        }
        this.setState({
            isViewingMonitorData: !this.state.isViewingMonitorData,
            currentMonitor: monData
        })
    };

    monitorStatusIcon = (eventStatus) => {
        switch (eventStatus) {
            case "OPERATIONAL":
                return (<svg width="1.3em" height="1.3em" viewBox="0 0 16 16" className="float-left text-success mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="8"/>
                </svg>);
                break;
            case "DEGRADED":
                return (<svg width="1.3em" height="1.3em" viewBox="0 0 16 16" className="float-left text-warning mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="8"/>
                </svg>);
                break;
            case "OUTAGE":
                return (<svg width="1.3em" height="1.3em" viewBox="0 0 16 16" className="float-left text-danger mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="8"/>
                </svg>);
                break;
            case "PAUSE":
                return (<svg width="1.3em" height="1.3em" viewBox="0 0 16 16" className="float-left text-secondary mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="8"/>
                </svg>);
                break;
            default:
                return "";
                break;
        }
    };

    render() {        
        const { events, guildName, guildIcon, limitReached, isViewingMonitorData } = this.state;
        return (
            <div>
                <NavServer 
                    guildName={ guildName }
                    guildIcon={ guildIcon }
                    server={ this.props.server }
                />                
                <Container fluid>                
                <Row>
                <Col xs="12" md="4">
                    <Card style={{ backgroundColor: "#0e0e10" }} text="white">
                        <Card.Body>
                            <Card.Title>Add New Monitor</Card.Title>
                            <Card.Text>
                                { limitReached ? <Nav.Link>Monitor limit reached</Nav.Link> : <Button variant="success" size="sm" onClick={this.toggleItemAdding}>
                                    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                                    </svg>
                                    {" "} Add new http(s)
                                </Button> }                                
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    { !events ?  null : events.map(( event ) => (
                        <Accordion key={event._id}>
                            <Card style={{backgroundColor: "#404044"}}>
                                <Card.Header>
                                <Accordion.Toggle className="float-right" as={Button} variant="link" eventKey="0" variant="outline-secondary" size="sm">
                                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-gear-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 0 0-5.86 2.929 2.929 0 0 0 0 5.858z"/>
                                    </svg>
                                </Accordion.Toggle>                                
                                <h5 onClick={()=>{this.viewMonitorData(event._id, event.name, event.active, event.status)}}>
                                    {this.monitorStatusIcon(event.status)}
                                    {event.name}
                                    {/* Data Icon */}
                                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="text-primary ml-3 bi bi-info-square-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.93 4.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                                    </svg>                                    
                                </h5>                                
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                <Card.Body style={{backgroundColor: "#4c4c51"}}>
                                    <Button variant="outline-danger" size="sm" className="float-right" onClick={(e)=>  {if (window.confirm('Are you sure you wish to delete this item?'))  this.handleDeleteClick( event , e  ) }}>
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                                        </svg>
                                    </Button>
                                    
                                    <Button variant="outline-secondary" size="sm" className="float-right mr-2" onClick={()=> this.toggleItemEditing( event._id ) }>
                                        Edit
                                    </Button>
                                    
                                    { event.active ? 
                                    <Button variant="outline-warning" size="sm" className="float-right mr-2" 
                                        onClick={(e)=>  {if (window.confirm('Are you sure you wish to pause?'))  this.handePauseClick( event , e  ) }}>
                                            <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
                                            </svg>
                                            {" "} Pause
                                    </Button> :
                                    <Button variant="outline-success" size="sm" className="float-right mr-2" 
                                        onClick={(e)=> this.handeStartClick( event , e  ) }>
                                            <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                                            </svg>
                                            {" "} Start
                                    </Button> }
                                    <p className="mb-1">Status:  { event.status }</p>
                                    <p className="mb-1">Channel:  { event.channel_name }</p>
                                    <p className="mb-1">Role:  { ( event.role_name === ""? "None set" : event.role_name) }</p>
                                    <p className="mb-1">Timezone:  { event.timezone }</p>
                                    <small>Interval: { event.interval } Minute</small>
                                    {!event.isEditing ? 
                                        null : <EditModal event={event} isEditing={event.isEditing} handleItemUpdate={this.handleItemUpdate} /> }
                                </Card.Body>
                                </Accordion.Collapse>                                
                            </Card>
                        </Accordion>
                    ))}
                </Col>
                <Col xs="12" md="8">
                    { !isViewingMonitorData ?
                    <>
                    <Card style={{ backgroundColor: "#0e0e10" }} text="white">
                        <Card.Body>
                            <Card.Title className="text-center">Overview</Card.Title>
                            <Row>
                                <Col>
                                    Items: {this.state.eventsOverview.items}
                                </Col>
                                <Col>
                                    Active: {this.state.eventsOverview.active}
                                </Col>
                                <Col>
                                    Paused: {this.state.eventsOverview.paused}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <ListGroup>
                        <ListGroup.Item style={{ backgroundColor: "#404044" }}>                            
                            <UserEventLogs />
                        </ListGroup.Item>
                    </ListGroup> </>:
                    <ListGroup>
                        <ListGroup.Item style={{ backgroundColor: "#404044" }}>
                            <MonitorData currentMonitor={this.state.currentMonitor} />                            
                        </ListGroup.Item>
                    </ListGroup>}
                </Col>
                </Row>
                <br />
                <br />
                <br />
                <br />                
                <br />
                <br />
                <br />
                <br />                
                {!this.state.isAdding ? null :
                    <AddModal 
                        isAdding={this.state.isAdding} 
                        handleItemAdded={this.handleItemAdded} 
                        server={this.props.server} 
                        userID={this.props.userID}
                        fetchEvents={this.fetchEvents} 
                    /> }
                </Container>
            </div>
        )
    }
}