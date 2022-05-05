import React, { Component } from 'react'
import { Nav, Navbar, NavDropdown, ListGroup, Container, Row, Col, Media, Button, Card } from 'react-bootstrap';

export default class Commands extends Component {
    render() {
        return (
            <div>
                <Row>
                    <Col>
                        <h4>Command Setting
                <label className="switch float-right">
                                <input type="checkbox" />
                                <span className="slider round"></span>
                            </label>
                        </h4>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <Card
                            style={{ backgroundColor: "#0e0e10" }}
                            text="white"
                        >
                            <Card.Body>
                                <Card.Title>No Header
                      <label className="switch float-right">
                                        <input type="checkbox" />
                                        <span className="slider round"></span>
                                    </label>
                                </Card.Title>
                                <Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                    </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card
                            style={{ backgroundColor: "#0e0e10" }}
                            text="white"
                        >
                            <Card.Body>
                                <Card.Title>No Header
                      <label className="switch float-right">
                                        <input type="checkbox" />
                                        <span className="slider round"></span>
                                    </label>
                                </Card.Title>
                                <Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                    </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card
                            style={{ backgroundColor: "#0e0e10" }}
                            text="white"
                        >

                            <Card.Body>
                                <Card.Title>No Header
                      <label className="switch float-right">
                                        <input type="checkbox" />
                                        <span className="slider round"></span>
                                    </label>
                                </Card.Title>
                                <Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                    </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
