import RegulatorApp from './RegulatorApp';
import BusinessApp from './BusinessApp';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Login from './components/Login'

export const log = {
    loggedIn : false,
    authenticate(){
      this.loggedIn = true;
      localStorage.setItem('loggedIn', this.loggedIn);
    },
    signout(){
      this.loggedIn = false;
      localStorage.setItem('loggedIn', this.loggedIn);
    }
  }

  export default class App extends Component{
    render() {
      console.log(localStorage.getItem('loggedIn'));
      return (
        <BrowserRouter>
          <Switch>
            <Route  path="/regulator"  render={(props) => ( localStorage.getItem('loggedIn') ? <RegulatorApp {...props}/> : <Redirect to="/"/>)}/>
            <Route  path="/business"  render={(props) => ( localStorage.getItem('loggedIn') ? <BusinessApp {...props}/> : <Redirect to="/"/>)}/>
            <Route  path="/"  component={Login}/>
          </Switch>
        </BrowserRouter>
      );
    }    
  }
  
  ReactDOM.render(<App />, document.getElementById('root'));
