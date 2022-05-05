import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from "react-router-dom";

export default function MonHome() {
    return (
        <div  style={{ backgroundColor: "#1f1f23", color: "white" }}>
            <Navbar collapseOnSelect expand="lg" style={{ backgroundColor: "#1f1f23" }} variant="dark">
                <Navbar.Brand as={Link} to="/">UpBot</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>                
                </Nav>
            </Navbar>
            <Container  style={{ backgroundColor: "#1f1f23", color: "white" }}>
            <br />
            <br />
            <br />
            <br />
            <br />
            <h1>Monitoring</h1>
            <h5>Alpha release v0.0.1 (August 23, 2020)</h5>
            <p>intil release of UpBot web application and website monitoring and status notification. 
            Monitor http and https web applications and websites and recives Discord notifications.</p>

            <h5>Functionality</h5>
            <ul>
                <li>Add http and https monitoring events. Monitor Down/Up status and latency.</li>
                <li>Recive discord notification For Down, Up and latency events.</li>
                <li>Recive discord notification in a specific channel and role mention.</li>
            </ul>                 

            <h5>Future Plans</h5>
            <ul>
                <li>Edit monitoring evets</li>
                <li>Down/Up Logs</li>
                <li>Response Time Data and graph</li>
            </ul>
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
        </div>
    )
}
