import RegulatorApp from './RegulatorApp';
import BusinessApp from './BusinessApp';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Login from './components/Login'

export const log = {
    regLoggedIn : false,
    busLoggedIn : false,
    regAuthenticate(){
      this.regLoggedIn = true;
      localStorage.setItem('regLoggedIn', this.regLoggedIn);
    },
    regSignout(){
      this.regLoggedIn = false;
      localStorage.setItem('regLoggedIn', this.regLoggedIn);
    },
    busAuthenticate(){
      this.busLoggedIn = true;
      localStorage.setItem('busLoggedIn', this.busLoggedIn);
    },
    busSignout(){
      this.busLoggedIn = false;
      localStorage.setItem('busLoggedIn', this.busLoggedIn);
    }
  }

  export default class App extends Component{
    render() {
      // console.log(log.regLoggedIn, log.busLoggedIn);
      console.log(localStorage.getItem('busLoggedIn'), localStorage.getItem('regLoggedIn'));
      return (
        <BrowserRouter>
          <Switch>
            <Route  path="/regulator"  render={(props) => ( log.regLoggedIn ? <RegulatorApp {...props}/> : <Redirect to="/"/>)}/>
            <Route  path="/business"  render={(props) => ( log.busLoggedIn ? <BusinessApp {...props}/> : <Redirect to="/"/>)}/>
            <Route  path="/"  component={Login}/>
          </Switch>
        </BrowserRouter>
      );
    }    
  }
  
  ReactDOM.render(<App />, document.getElementById('root'));
