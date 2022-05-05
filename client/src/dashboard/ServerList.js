import React, { Component } from 'react';
import { ListGroup, Row, Col, Button, Container, Form } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { bot_link } from '../env.json'

class ServerList extends Component {
    state = {
        managedGuilds: []
    }
    componentDidMount() {
        this.handleServerList()
        setTimeout(() => {
            if (!this.props.authenticated) {
                this.props.history.push('/')
            }      
        }, 15000);
    }    
    handleClick = (server, e)=> {
        e.preventDefault();
        try {
            const iconImage = server.icon == null ? "undefined" : server.icon ;
            const myEvent = {
                guild_id: server.id,
                name: server.name,
                admin: this.props.user.id,
                icon: iconImage
            };
            fetch("http://localhost:5050/app/createguild", {
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
            .then((res)=> {
                if(res.status === 200) {
                    this.props.history.push(`/dashboard/${server.id}`);
                }
            })
            } catch (error) {console.log(error)}
    }

    handleServerList = ()=> {
        fetch(`http://localhost:5050/discord/getguilds`, {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            }
        })
        .then( res => {
            if(res.status === 200) {
                return res.json()
            } else if(res.status === 401) {
                throw Error("User token 401 Unauthorized");
            } else {
                throw Error("Failed to retrieve server list");
            }            
        })
        .then( res => {
            console.log("* Worked");
            console.log(res.managedGuilds);
            this.setState({
               managedGuilds: res.managedGuilds
            });            
        })    
        .catch((err)=> {
            if(err.message == "User token 401 Unauthorized") {
                console.log(err);
                window.location.assign('http://localhost:5050/auth/discord/logout');
            } else {
                console.log(err);
            }
            
        })
    }

    render() {        
        const { user } = this.props;
        const { managedGuilds } = this.state;
        return (
            <Container fluid="md">
                <Row><Col>
                    <br /><h5 className="text-center">Select a Server { user.username }</h5>
                    <Button variant="outline-success" className="float-right" size="sm" onClick={this.handleServerList}>
                        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                        </svg>
                        {" "} Refresh
                    </Button>
                </Col></Row>
                <br />
                <Row className="justify-content-md-center">
                    <Col lg="12">
                        <ListGroup>                            
                            { !managedGuilds ?  null : managedGuilds.map(( server ) => (
                                ( server.permissions === 2147483647 ? <ListGroup.Item style={{ backgroundColor: "#404044" }} key={server.id}>
                                <img
                                    alt={`${server.name} discord server profile imagem`}
                                    src={ server.icon == null ? "/server00.png" : `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png` }
                                    width="30"
                                    height="30"
                                    className="rounded-circle align-top"
                                />{" "} {server.name}
                                    { server.managed ? 
                                    <Button variant="success" className="float-right" style={{display: "table-cell"}} onClick={ (e)=>{ this.handleClick(server, e)}}>
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-sliders" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3h9.05zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8h2.05zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1h9.05z"/>
                                        </svg>
                                        {" "} Dashboard
                                    </Button> 
                                    : <Button variant="secondary" className="float-right" style={{display: "table-cell"}} href={`${bot_link}${server.id}`}>
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                                        </svg>
                                        {" "} Add Server
                                    </Button> }
                                </ListGroup.Item> : null ) 
                            )) }
                        </ListGroup>
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
            </Container>
        )
    }
}

export default withRouter(ServerList);