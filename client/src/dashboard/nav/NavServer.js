import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';

export default class NavServer extends Component {
    render() {
        return (
            <div>
                <Navbar style={{ backgroundColor: "#1f1f23", color: "white" }} variant="dark">
                    {console.log(this.props.server)}
                    {console.log(this.props.guildIcon)}
                    <Navbar.Brand>
                    <img
                        src={ this.props.guildIcon == null || this.props.guildIcon == "undefined" ? "/server00.png" : `https://cdn.discordapp.com/icons/${this.props.server}/${this.props.guildIcon}.png` }
                        width="30"
                        height="30"
                        className="rounded-circle align-top"
                        alt=""
                    />{' '}
                    </Navbar.Brand>
                    {this.props.guildName}
                </Navbar>
            </div>
        )
    }
}