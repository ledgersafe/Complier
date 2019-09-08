import React, { Component } from 'react';
import '../App.css';
import { Redirect } from "react-router-dom";
import { log } from '../App';
import LS from '../static/LS.png'

class Header extends Component {
    constructor(props){
        super(props);
        this.state = {
            logStatus: log.loggedIn
        }
        this.logout = this.logout.bind(this)
    }

    logout() {
        return (
            <Redirect to="/"/>
        )
    }

    render() {
        return (
            <header className="App-header">
                <img src={LS} alt='LedgerSafe' height='100' width='100' />
                <div className="title">
                LedgerSafe Compliance Engine
                </div>
                <button onClick={()=>this.logout()}>Logout</button>
            </header>
        );
    }
}
export default Header;