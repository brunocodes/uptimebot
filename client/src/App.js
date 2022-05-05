import React from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { HomePage }  from './homepage/HomePage';
import ReleaseNotes from './homepage/ReleaseNotes';
import FAQHome from './homepage/FAQHome';
import Settings from './dashboard/Settings';
import NavMain from './dashboard/nav/NavMain';
import ServerList from './dashboard/ServerList';
import Monitoring from './dashboard/Monitoring';
import AddMonitor from './dashboard/AddMonitor';
import NavFooter from './dashboard/nav/NavFooter';


class App extends React.Component {
  state = {
    user: {},
    error: null,
    authenticated: false
  }
  componentDidMount() {
    fetch("http://localhost:5050/auth/discord/success", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    })
    .then(response => {
      if (response.status === 200) return response.json();
      throw new Error("Failed to authenticate user");
    })
    .then(res => {
      console.log(res.user);
      this.setState({
        user: res.user,
        authenticated: true        
      });
    }).catch(err => {
      console.log(err);
      this.setState({
        authenticated: false,
        error: "Failed to authenticate user"
      });
    });
  }
  render() {
    const { user, authenticated } = this.state;
    return (
      <div style={{ backgroundColor: "#1f1f23", color: "white" }}>
        <Router>
          <NavMain  
            user={user}
            authenticated={authenticated}
          /> 
        <Switch>
          <Route exact path="/"              
            render={(props) => <HomePage {...this.state}
            user={user}
            authenticated={authenticated}              
            />}
          />
          <Route path="/dashboard"
            exact
            render={(props) => <ServerList {...this.state}
              user={user}
              authenticated={authenticated}                
            />}
          />
          <Route path={`/dashboard/:serverID`}
            exact
            render={(props) => <Monitoring {...this.state} 
                userID={user.id}
                server={ props.match.params.serverID }
            />}                    
          />
          <Route path={`/dashboard/:serverID/add`}
            render={(props) => <AddMonitor {...this.state} 
                userID={user.id}
                server={ props.match.params.serverID }
                authenticated={authenticated}
            />}                    
          />
          <Route path="/settings"
            render={(props) => <Settings {...this.state}
              user={user}
              authenticated={authenticated}              
            />}
          />           
        </Switch>
          <Route path="/release" >
            <ReleaseNotes />
          </Route>
          <Route path="/faq" >
            <FAQHome />
          </Route>
        <NavFooter />
        </Router>
     </div>
    );
  }
}

export default App;