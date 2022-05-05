import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

export default class RoadMap extends Component {
    render() {
        return (
            <div  style={{ backgroundColor: "#1f1f23", color: "white" }}>                
                <Container  style={{ backgroundColor: "#1f1f23", color: "white" }}>                
                <br />
                <br />
                <h2>Road Map</h2>

                <h5>Alpha release v0.0.8 - April 20, 2021</h5>
                    <p>
                        For the v0.0.8 update the plan is to add the commmand funcinalty where you will be abil 
                        to control and display information of your monitors
                    </p>

                    <ul>
                        <li>Discord commands - Use commands from discord to display information or control your monitors - 
                            !status !start !pause</li>
                    </ul>
                <hr />
                <h5>Alpha release v0.0.9 - May 25, 2021</h5>
                    <ul>
                        <li>Display up time for each monitor 24h/7days/30day.</li>
                    </ul>
                <hr />
                
                <h5>Alpha release v0.1.0 - June 30, 2021</h5>
                <ul>
                    <li></li>
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
                <br />
                <br />                
                </Container>
            </div>
        )
    }
}