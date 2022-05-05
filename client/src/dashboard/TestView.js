import React, { Component } from 'react'
import { Button, Nav, Navbar, Row, Col, Container } from 'react-bootstrap';

export default class testView extends Component {
    handlePingData() {
        const myEvent = {
            event_id: "5faffdab162dbf2bb8bffe13"
        };
        fetch("http://localhost:5050/app/pingdata", {
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
        .then(res=> {
            if(res.status === 200) {
                return res.json();
            } else {
                throw Error("Failed to retrieve monitoring events") 
            }                
        }).then(res=> {
            console.log(res.ping_data);
        })
    }

    handleDelete() {
        // Delete guilds  - fetch
        const userID = "282664963439329280";
        fetch('http://localhost:5050/app/endaccount', {
            method: "DELETE",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                user_id: userID
            })
        })
        .then( response => {
            if (response.status === 200) return response.json();
            throw new Error("failed to authenticate user");
        })
        .then( res => {
            console.log("* Worked res message: ");
            console.log(res.message);
        })

    }
    handlePause() {
        // Stop Service - fetch
        let servID = "5f156b069a267b28a10aa668";
        fetch(`http://localhost:5050/app/stop-service?id=${servID}`, {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            }
        })
        .then( response => {
            if (response.status === 200) return response.json();
            throw new Error("failed to authenticate user");
        })
        .then( res => {
            console.log("* Worked");
            console.log(res)
            // this.setState({
            //     user: res.user,
            //     // guilds: res.user.guilds,
            //     authenticated: true        
            // });
        })

    }
    handleStart() {
        // Start
        let servID = "5f156b069a267b28a10aa668";
        fetch(`http://localhost:5050/app/start-service?id=${servID}`, {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            }
        })
        .then( response => {
            if (response.status === 200) return response.json();
            throw new Error("failed to authenticate user");
        })
        .then( res => {
            console.log("* Worked");
            console.log(res)
            // this.setState({
            //     user: res.user,
            //     // guilds: res.user.guilds,
            //     authenticated: true        
            // });
        })    

    }
    handleRefresh() {
        fetch(`http://localhost:5050/discord/getguilds`, {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            }
        })
        .then( response => {
            if (response.status === 200) return response.json();
        })
        .then( res => {
            console.log("* Worked");
            console.log(res)
            // this.setState({
            //     user: res.user,
            //     // guilds: res.user.guilds,
            //     authenticated: true        
            // });
        })    
        .catch(err=> console.log(err) )
    }
    handleGuild() {
        fetch(`http://localhost:5050/app/testtest`, {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            }
        })
        .then( response => {
            if (response.status === 200) return response.json();
        })
        .then( res => {
            console.log("* Worked");
            console.log(res)
            // this.setState({
            //     user: res.user,
            //     // guilds: res.user.guilds,
            //     authenticated: true        
            // });
        })    
        .catch(err=> console.log(err) )
    }
    render() {
        return (
            <div>
                <Button variant="outline-success" size="sm" onClick={this.handlePingData}>
                    Ping data
                </Button>
                <br />
                <br />
                <br />
                <Button variant="outline-success" size="sm" onClick={this.handleGuild}>
                    Test Guild Model
                </Button>
                <br />
                <Button variant="outline-success" size="sm" onClick={this.handleRefresh}>
                    Refreash :)
                </Button>
                <hr />
                <p>Over View</p>
                <Button variant="outline-danger" size="sm" onClick={this.handlePause}>
                    Pause
                </Button>{" "}
                <Button variant="outline-danger" size="sm" onClick={this.handleStart}>
                    start
                </Button>
                <hr />
                <Button variant="outline-danger" size="sm" onClick={this.handleDelete}>
                    delete
                </Button>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />                <Nav style={{ backgroundColor: "#404044" }} variant="dark" className="flex-column text-center">
                <Container>
                    <Row>
                        <Col>
                            <br />
                            <Nav.Item as="h5">Nav Item</Nav.Item>
                            <Navbar.Brand href="/">UpBot<img src="/alpha00.png" width="10" height="10" alt="Alpha version" className="align-top float-right" /></Navbar.Brand>                
                            <Nav.Link href="/">Nav Link 2</Nav.Link>
                            <Nav.Link href="/">Nav Link 2</Nav.Link>
                            <Nav.Link href="/">Nav Link 3</Nav.Link>
                        </Col>
                        <Col>
                            <br />
                            <Nav.Item as="h5">Nav Item</Nav.Item>
                            <Nav.Link href="/">Nav Link 2</Nav.Link>
                            <Nav.Link href="/">Nav Link 3</Nav.Link>
                            <Nav.Link href="/">Nav Link 3</Nav.Link>
                        </Col>                    
                    </Row>                
                    <p className="text-center">Copyright 2020 UpBot.xyz</p>
                </Container>
                </Nav>
            </div>
        )
    }
}