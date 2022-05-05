import React, { Component } from 'react';
import { Nav, Container, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";
const currentYear = new Date().getFullYear()

export default class NavFooter extends Component {
    render() {
        return (
            <div>
                <Nav style={{backgroundColor: "#404044"}} variant="dark" className="flex-column text-center">
                    <Container>
                        <Row>
                            <Col>
                                <br />                            
                                <Nav.Link as={Link} to="/release">Release Notes</Nav.Link>
                                <br />
                            </Col>
                            <Col>
                                <br />                            
                                <Nav.Link as={Link} to="/faq">F.A.Q</Nav.Link>
                                <br />
                            </Col>                    
                        </Row>                
                        <p className="text-center">Copyright © {currentYear} UpBotBot</p>
                    </Container>
                </Nav>
            </div>
        )
    }
}
