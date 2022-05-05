import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

class Settings extends React.Component {
    handleDelete = (e)=> {
        e.preventDefault();
        try {
            const userID = this.props.user.id;
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
                throw new Error("Failed to delete user");
            })
            .then( res => {
                console.log("* Worked res message: ");
                console.log(res.message);
                window.location.assign('http://localhost:5050/auth/discord/logout');
            })            
        } catch (error) {
            console.log(error);
        }
    }
    
    render() {
        const { user, authenticated } = this.props;
        return (
            <Container fluid="md">
                { !authenticated ? <h5>Not logged in.</h5> :
                <div>
                <Row><Col><br /><h5 className="text-center">{ user.username } Account Settings</h5></Col></Row>
                <br />
                <Row className="justify-content-md-center">
                    <Col xs lg="12" className="text-center">
                        <p>User ID: {user._id}</p>
                        <hr />
                        <h5>Delete Account</h5>
                        <Button variant="outline-danger" size="sm" onClick={(e)=>  {if (window.confirm('Are you sure you want to DELETE your account?'))  this.handleDelete(e) }}>
                            Delete
                        </Button>
                    </Col>
                </Row></div> }
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
                <br />
                <br />
                <br />
                <br />
                <br />
            </Container>
        )
    }
}
export default Settings;