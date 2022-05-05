import React from 'react';
import { Nav, Navbar, NavDropdown, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";

export const HomePage = (props) => {
    return (
        <div style={{ backgroundColor: "#1f1f23", color: "white" }}>
            <Container fluid="md">
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <h3 className="text-center">Uptime monitoring service and Discord Bot</h3>
                <p className="text-center">                    
                    Be the first to know when your website is down. Reliable monitoring and status notifications
                    warns you before any significant troubles.
                </p>
                <div className="text-center">
                    <Button variant="info" size="lg" href={props.authenticated ? "/dashboard" : "http://localhost:5050/auth/discord"}>Add to Discord</Button>{' '} 
                    <Button variant="dark" href="#features" size="lg">Features</Button>
                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <Row id="features" className="justify-content-md-center">                    
                    <Col xs={{ span: 12 , order: 'last'}} lg={{ span: 6 , order: 'first'}}>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />                    
                        <h3>Easily add websites to monitor</h3>
                        <p>
                            Easily add websites to monitor and set it to your preference.
                            Choose a channel to receive status notifications. 
                            You can optionality set a role to tag on your notifications.                            
                        </p>                    
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    </Col>
                    <Col xs={{ span: 12 , order: 'first'}} lg="6">
                        <img src="/add-form.png" className="img-fluid" />
                    </Col>
                </Row>
                <br />
                <br />
                <br />                                        
                <Row className="justify-content-md-center">
                    <Col xs="12" lg="6">
                        <img src="/bot-message.png" className="rounded mx-auto d-block" />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                    </Col>
                    <Col xs="12" lg="6">
                        <br />                        
                        <h3>Recive notifications alerts</h3>
                        <p>
                            Get notified when your website is down before any significant troubles.
                            Recive discord notifications in a specific channel when a website or service goes down.
                            Recive notifications when it goes back up and also when there is latency which you can set to your preference.
                        </p>                        
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
            </Container>            
        </div>
    );
}
