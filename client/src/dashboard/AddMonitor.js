import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Alert, Container, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
const guildURL = '/dashboard/';

class AddMonitor extends Component {
    state = {
        fetchingChannel: false,
        fetchingRole: false,
        errors: {},
        channelNotFoundAlert: false,
        roleNotFoundAlert: false,
        checkboxChecked: false,
        show_alert: false,
        hasRole: false,
        hasChannel: false,

        name: "",
        url: "",
        event_type: "https://",
        channel: "",
        channel_name: "",
        message: "",
        role: "",
        role_name: "",
        event_interval: 5,
        event_message: "The monitor <name> is currently <response type>. <time>",        
        event_timeout: 2000,
        server_timezone: "UTC"
               
    } 
    timer = 0;
    timer2 = 0;
    onChange = e => {        
        // if e.target.name === channel 
        if (e.target.name === "channel") {
            const thisValue = e.target.value;
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout( ()=> {
                try {
                    console.log("* inside try worked: " + thisValue);
                    this.setState({fetchingChannel: true});
                    const newChannel = {
                        guild_id: this.props.server,
                        channel_name: thisValue
                    };
                    fetch("http://localhost:5050/discord/channelid", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Credentials": true
                        },
                        body: JSON.stringify({
                            get_channel: newChannel
                        })
                    })
                    .then(res => {
                        if (res.status === 200) return res.json();
                        throw new Error("Failed to retrieve channel id");
                    })
                    .then(res => {         
                        console.log( res)
                        console.log(res.channel[0])
                        if (typeof res.channel[0] !== "undefined") {
                            this.setState({ 
                                ...this.state,
                                channel: res.channel[0],
                                channel_name: thisValue,
                                hasChannel: true,
                                channelNotFoundAlert: false,
                                fetchingChannel: false
                            });
                        } else {
                            this.setState({
                                hasChannel: false,
                                channelNotFoundAlert: true,
                                fetchingChannel: false
                            })
                        }
                    })  
                } catch (error) { 
                    console.log("* ERROR: " + error) 
                }
            }, 5000);            
        } else if (e.target.name === "role") {
            const thisValue2 = e.target.value;
            if (this.timer2) {
                clearTimeout(this.timer2);
            }            
            if(e.target.value === "everyone") {
                // this.setState({fetchingRole: true});
                setTimeout(() => {
                    this.setState({
                        role: "@everyone",
                        role_name: "everyone",
                        hasRole: true,
                        roleNotFoundAlert: false,
                        fetchingRole: false
                    });
                }, 1000);
            } else {
                this.timer2 = setTimeout( ()=> {
                    try {
                        // this.setState({fetchingRole: true});
                        const newRole = {
                            guild_id: this.props.server,
                            role_name: thisValue2 
                        };
                        fetch("http://localhost:5050/discord/roleid", {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Credentials": true
                            },
                            body: JSON.stringify({
                                get_role: newRole
                            })
                        })
                        .then(res => {
                            if(res.status === 200) {
                                return res.json()
                            } else {
                                throw Error("Failed to retrieve role id") 
                            }
                        })
                        .then(res => {         
                            console.log(res)
                            console.log(res.role[0])                    
                            if (typeof res.role[0] !== "undefined") {
                                this.setState({ 
                                    ...this.state,
                                    role: res.role[0],
                                    role_name: thisValue2,
                                    hasRole: true,
                                    roleNotFoundAlert: false,
                                    fetchingRole: false
                                });
                            } else {
                                this.setState({
                                    hasRole: false,
                                    roleNotFoundAlert: true,
                                    fetchingRole: false
                                })
                            }
                        })  
                    } catch (error) { console.log("* ERROR: " + error) 
                    }
                }, 5000);
            }           
        } else {
            this.setState({ 
                ...this.state,
                [e.target.name]: e.target.value 
            });
        }
	};

	onSubmit = e => {
        e.preventDefault();
        if (this.handleValidation()) {
            try {        
                const currentServer = this.props.server;
                const newEvent = {
                    discord_id: this.props.userID,
                    guild_id: currentServer,
                    name: this.state.name,
                    url: `${this.state.event_type}${this.state.url}`,
                    interval: this.state.event_interval,
                    channel: this.state.channel,
                    channel_name: this.state.channel_name,
                    role: this.state.role,
                    role_name: this.state.role_name,
                    message: this.state.event_message,                    
                    timeout: this.state.event_timeout,
                    active: true,
                    timezone: this.state.server_timezone
                };
                console.log( newEvent );
                fetch("http://localhost:5050/app/addevent", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Credentials": true
                    },
                    body: JSON.stringify({
                        event: newEvent
                    })
                })
                .then(res => {
                    if(res.status === 200) {
                        return res.json()
                    } else {
                        throw Error("Failed to adding event") 
                    }
                })
                .then(res => {
                    console.log( res ); 
                    this.setState({                
                        message: res.message,
                        show_alert: true,
                        hasRole: false,
                        hasChannel: false
                    });
        
                })
                .then(()=> {
                    const newCheck = {
                        discord_id: this.props.userID
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
                        console.log(res.status)
                        if (res.status !== 200) {
                            this.handleBack()
                        }
                    })
                });
                
            } catch (error) { console.log("* ERROR: " + error) }
           
        } else {
            console.log(`${this.state.errors}`);
        }
    };
    
    handleClose = () => {
        this.setState({
            show_alert: false
        })
    }

    handleBack = () => { 
        this.props.history.push(`${guildURL}${this.props.server}`);
    }

    handleValidation() {
        let vRole = this.state.role;
        let vChannel = this.state.channel;
        let errors = {};
        let formIsValid = true;

        //Role
        if(typeof vRole == "undefined"){
           formIsValid = false;
           errors["role"] = "Cannot find role";
        }
        
        //Channel
        if(typeof vChannel == "undefined"){
           formIsValid = false;
           errors["channel"] = "Cannot find";
        }

       this.setState({errors: errors});
       return formIsValid;
    }

    handleCheckChange = (evt) => {
        console.log(evt.target.checked);
        this.setState({ checkboxChecked: evt.target.checked });
    }
    
    render() {
        const { show_alert, channelNotFoundAlert, roleNotFoundAlert, fetchingChannel, fetchingRole } = this.state;
        const showSupmit = this.state.hasChannel; // this.state.hasRole &&
        const showRoleFeild = this.state.checkboxChecked;
        return (
            <Container fluid="md">
                <br />
                <h5 className="text-center">Add New Monitor</h5>                
                <Form>
                    <Row>
                        <Col xs="5" lg="5">
                            <Form.Group controlId="formName">
                            <Form.Label>Name *</Form.Label>
                            <Form.Control name="name" type="text" placeholder="Name of new Monitor" onChange={this.onChange} required />
                            </Form.Group>
                        </Col>
                        <Col xs="2" lg="2">
                        <Form.Group controlId="event-type">
                            <Form.Label>Type</Form.Label>
                            <Form.Control as="select" name="event_type" value={this.state.event_type} onChange={this.onChange}>
                                <option value="https://">https</option>
                                <option value="http://">http</option>                                
                            </Form.Control>
                        </Form.Group>
                        </Col>
                        <Col xs="5" lg="5">
                            <Form.Group controlId="formURL">
                            <Form.Label>URL *</Form.Label>
                            <Form.Control name="url" type="text" placeholder="yourappslink.com" onChange={this.onChange} required />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="5" lg="5">
                        <Form.Group controlId="event-interval">
                            <Form.Label>Interval</Form.Label>
                            <Form.Control as="select" name="event_interval" value={this.state.event_interval} onChange={this.onChange}>
                                <option value="5">5 Mins</option>
                                <option value="6">6 Mins</option>
                                <option value="7">7 Mins</option>
                                <option value="8">8 Mins</option>
                                <option value="9">9 Mins</option>
                                <option value="10">10 Mins</option>
                                <option value="15">15 Mins</option>
                                <option value="20">20 Mins</option>
                                <option value="25">25 Mins</option>
                                <option value="30">30 Mins</option>
                            </Form.Control>
                        </Form.Group>
                        </Col>
                        <Col xs="2" lg="2">
                        <Form.Group controlId="server-timezone" className="float-right align-top mr-1">
                            <Form.Label>Timezone</Form.Label>
                            <Form.Control as="select" name="server_timezone" value={this.state.server_timezone} onChange={this.onChange}>
                                <option value="UTC">UTC</option>
                                <option value="America/Los_Angeles">America/Los_Angeles</option>
                                <option value="America/Vancouver">America/Vancouver</option>
                                <option value="America/Denver">America/Denver</option>
                                <option value="America/Mexico_City">America/Mexico_City</option>
                                <option value="America/Chicago">America/Chicago</option>
                                <option value="America/Denver">America/Denver</option>
                                <option value="America/Kentucky/Louisville">America/Kentucky/Louisville</option>
                                <option value="America/Indiana/Indianapolis">America/Indiana/Indianapolis</option>
                                <option value="America/New_York">America/New_York</option>
                                <option value="America/Toronto">America/Toronto</option>
                                <option value="America/Detroit">America/Detroit</option>
                                <option value="America/Sao_Paulo">America/Sao_Paulo</option>
                                <option value="America/Fortaleza">America/Fortaleza</option>
                                <option value="America/Argentina/Buenos_Aires">America/Argentina/Buenos_Aires</option>
                                <option value="America/Puerto_Rico">America/Puerto_Rico</option>
                                <option value="America/Belize">America/Belize</option>
                                <option value="Europe/Dublin">Europe/Dublin</option>
                                <option value="Europe/Paris">Europe/Paris</option>
                                <option value="Europe/London">Europe/London</option>
                                <option value="Europe/Vienna">Europe/Vienna</option>
                                <option value="Africa/Johannesburg">Africa/Johannesburg</option>
                                <option value="Asia/Dubai">Asia/Dubai</option>
                                <option value="Australia/Melbourne">Australia/Melbourne</option>
                                <option value="Australia/Sydney">Australia/Sydney</option>
                                <option value="Australia/Lindeman">Australia/Lindeman</option>
                            </Form.Control>
                        </Form.Group>
                        </Col>
                        
                        <Col xs="5" lg="5">
                        
                        <Form.Group controlId="event-timeout">
                            <Form.Label>Latency threshold (milliseconds)</Form.Label>
                            <Form.Control as="select" name="event_timeout" value={this.state.event_timeout} onChange={this.onChange}>
                                <option value="200">200</option>
                                <option value="300">300</option>
                                <option value="400">400</option>
                                <option value="500">500</option>
                                <option value="600">600</option>
                                <option value="700">700</option>
                                <option value="800">800</option>
                                <option value="900">900</option>
                                <option value="1000">1000</option>
                                <option value="1500">1500</option>
                                <option value="2000">2000</option>
                                <option value="2500">2500</option>
                                <option value="3000">3000</option>                            
                            </Form.Control>
                            {/* <Form.Text className="text-muted">
                                Choose Threshold in milliseconds which you considered degraded performance to receive degraded performance warnings.
                            </Form.Text> */}
                        </Form.Group>
                        </Col>
                    </Row>
                    
                    <Form.Group controlId="event-channel">
                        <Form.Label>Channel *</Form.Label> { fetchingChannel ? <Spinner animation="border" variant="primary" size="sm" /> :"" }
                        <Form.Control name="channel" type="text" placeholder="dev-alerts" onChange={this.onChange} required />
                        <Form.Text className="text-muted">
                            Enter the name of the discord channel that will receive alert messages.
                        </Form.Text>
                        {/* <Spinner animation="border" variant="primary" size="sm" className="float-right" /> */}
                        { channelNotFoundAlert ? <Alert variant="danger">
                            Discord channel not found!
                        </Alert> : null }
                    </Form.Group>

                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Use role mention in alert message" onChange={this.handleCheckChange} />
                    </Form.Group>
                    
                    { showRoleFeild ? 
                    <Form.Group controlId="event-role">
                        <Form.Label>Role</Form.Label> { fetchingRole ? <Spinner animation="border" variant="primary" size="sm" /> :"" }
                        <Form.Control name="role" type="text" placeholder="devs" onChange={this.onChange} />
                        <Form.Text className="text-muted">
                            Enter the name of the discord role that will be mention on the alert messages.
                        </Form.Text>
                        { roleNotFoundAlert ? <Alert variant="danger">
                            Discord role not found!
                        </Alert> : null }
                    </Form.Group>
                    :"" }
                    
                    <Form.Group controlId="event-message">
                        <Form.Label>Message</Form.Label>
                        <Form.Control as="select" name="event_message" value={this.state.event_message} onChange={this.onChange}>
                            <option value="The monitor <name> is currently <response type>. <time>">Default</option>
                        </Form.Control>
                    </Form.Group>                    
                    
                    { showSupmit ? <Button variant="outline-success" onClick={this.onSubmit} >+ Add Monitor</Button> : null }                    
                    
                    { !show_alert ? null : <Alert variant="success" dismissible onClose={ this.handleClose }>
                        Monitor added successfully!
                    </Alert> }
                    <Button variant="outline-light" onClick={this.handleBack} className="float-right mt-3">Go Back</Button>
                </Form>
            </Container>
        )
    }
}
export default withRouter(AddMonitor);