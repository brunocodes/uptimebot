import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

export default class ReleaseNotes extends Component {
    render() {
        return (
            <div  style={{ backgroundColor: "#1f1f23", color: "white" }}>                
                <Container  style={{ backgroundColor: "#1f1f23", color: "white" }}>                
                <br />
                <br />
                <h2>Release Notes</h2>
                <h5>January  23, 2021 (Alpha release v0.0.6)</h5>
                <p>
                    Welcome to the initial release of UpBot web application and website monitoring and status notification. 
                    Monitor http(s) web applications and websites and recives Discord notifications.
                </p>

                <ul>
                    <li>Monitor http and https web applications and websites.</li>
                    <li>Add and edit http(s) monitoring events. Monitor Down/Up status and latency.</li>
                    <li>Recive discord notification For Down, Up and latency events.</li>
                    <li>Recive discord notification in a specific channel and role mention.</li>
                </ul>                
                <hr />
                <h5>February  20, 2021 (Alpha release v0.0.7)</h5>

                <p>
                    New functionality and general improvments and updates.
                </p>
                
                <ul>
                    <li>Significant UI/UX improvments by adding icons and repositioning and resizing page elements.</li>
                    <li>Save response time for each monitor for 30 days.</li>
                    <li>Display 1-12 hour response time chart and event logs for each individual monitor. (More options in future updates)</li>
                    <li>Save and display event logs for latest events of all monitors (Up, Down, Latency, Pause, start).</li>
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