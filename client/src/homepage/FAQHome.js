import React, { Component } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from "react-router-dom";

export default class FAQHome extends Component {
    render() {
        return (
            <div  style={{ backgroundColor: "#1f1f23", color: "white" }}>                
                <Container  style={{ backgroundColor: "#1f1f23", color: "white" }}>                
                <br />
                <br />
                <h2>FAQ</h2>

                <h5>Q: How to remove Upbot bot from my server?</h5>
                <p>
                    A: To remove UpBot from your server by kicking it out of your server.
                </p>
                <hr />
                <h4>Monitoring</h4>
                <h5>Q: What if my channel name has emotes?</h5>
                <p>
                    A: You can copy the name of your channel from the edit/channel input and then paste the name in the form.
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
                </Container>
            </div>
        )
    }
}
