import React, { Component } from 'react';
import { Nav, Navbar, NavDropdown, Button, Container, Row, Col, Card } from 'react-bootstrap';

export default class HomeMain extends Component {
    render() {
        return (
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
                <h3 className="text-center">Stay up to date with with your project</h3>
                <p className="text-center">Website monitoring and status notifications</p>
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
                    <Col xs="12" lg="6">
                    <br />
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
                            Website monitoring and status notifications. 
                            Be the first who knows that your website is down. Reliable monitoring 
                            warns you before some significant troubles and save you money.
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
                    <br />
                    </Col>
                    <Col xs="12" lg="6">
                        <img src="/add-form.png" />
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
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <Row className="justify-content-md-center">
                    <Col xs="12" lg="6">
                        <img src="/bot-message.png" />
                    </Col>
                    <Col xs="12" lg="6">
                        <h3>Recive notifications alerts</h3>
                        <p>
                            Website monitoring and status notifications. 
                            Be the first who knows that your website is down. Reliable monitoring 
                            warns you before some significant troubles and save you money.
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
                <br />
                <br />
                <br />
                <br />
            </Container>
        )
    }
}
