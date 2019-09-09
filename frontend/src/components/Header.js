import React, { Component } from 'react';
import '../App.css';
import './Header.css';
import { Redirect } from "react-router-dom";
import {withRouter} from "react-router";
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

    componentDidMount() {
        const loginStatus = log.regLoggedIn || log.busLoggedIn;
        this.setState({logStatus : loginStatus})
    }

    logout() {
        console.log('logout')
        log.busSignout()
        log.regSignout()
        this.props.history.push('/');
    }

    render() {
        console.log(log.regLoggedIn, log.busLoggedIn)
        return (
            <header className="App-header">
                <img src={LS} alt='LedgerSafe' height='100' width='100' />
                <div className="title">
                LedgerSafe Compliance Engine
                </div>
                <button className='logout' onClick={()=>this.logout()}>Logout</button>
            </header>
        );
    }
}
export default withRouter(Header);