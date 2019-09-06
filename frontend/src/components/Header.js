import React, { Component } from 'react';
import '../App.css';
import { Redirect } from "react-router-dom";
import LS from '../static/LS.png'

class Header extends Component {
    render() {
        return (
            <header className="App-header">
                <img src={LS} alt='LedgerSafe' height='100' width='100' />
                <div className="title">
                LedgerSafe Compliance Engine
                </div>
            </header>
        );
    }
}
export default Header;