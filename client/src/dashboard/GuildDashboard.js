import React, { Component } from 'react';
import { Container, Row, Col, Media, Button, Card } from 'react-bootstrap';

export default class GuildDashboard extends Component {
    
    render() {
        const { user, authenticated, managedGuilds } = this.props;
        return (
            <div>
            <Container fluid="md">
                <br />
                <Row>
                    <Col><h5 className="text-center">Add and remove</h5></Col>
                </Row>
                <br />
                <Row className="justify-content-md-center">
                    <Col xs lg="4">
                        <Card
                            style={{ backgroundColor: "#0e0e10" }}
                            text="white"
                        >
                            <Card.Body>
                                <Card.Title>No Header</Card.Title>
                                <Card.Text>
                                    Some quick example text to build on the card title
                                    and make up the bulk of the card's content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs lg="4">
                        <Card
                            style={{ backgroundColor: "#0e0e10" }}
                            text="white"
                        >
                            <Card.Body>
                                <Card.Title>No Header</Card.Title>
                                <Card.Text>
                                    Some quick example text to build on the card title
                                    and make up the bulk of the card's content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs lg="4">
                        <Card
                            style={{ backgroundColor: "#0e0e10" }}
                            text="white"
                        >
                            <Card.Body>
                                <Card.Title>No Header</Card.Title>
                                <Card.Text>
                                    Some quick example text to build on the card title
                                    and make up the bulk of the card's content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <br />
                <br />                
                <Row className="justify-content-md-center">
                    <Col xs lg="4">
                        <Card
                            style={{ backgroundColor: "#0e0e10" }}
                            text="white"
                        >
                            <Card.Body>
                                <Card.Title>No Header</Card.Title>
                                <Card.Text>
                                    Some quick example text to build on the card title
                                    and make up the bulk of the card's content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs lg="4">
                        <Card
                            style={{ backgroundColor: "#0e0e10" }}
                            text="white"
                        >
                            <Card.Body>
                                <Card.Title>No Header</Card.Title>
                                <Card.Text>
                                    Some quick example text to build on the card title
                                    and make up the bulk of the card's content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs lg="4">
                        <Card
                            style={{ backgroundColor: "#0e0e10" }}
                            text="white"
                        >
                            <Card.Body>
                                <Card.Title>No Header</Card.Title>
                                <Card.Text>
                                    Some quick example text to build on the card title
                                    and make up the bulk of the card's content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
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
            </div>
        )
    }
}
