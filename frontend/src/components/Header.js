import React, { Component } from 'react';
import '../App.css';
import LS from '../static/LS.png'

class Header extends Component {
    render() {
        return (
            <header className="App-header">
                <img src={LS} alt='LedgerSafe' height='100' width='100' />
                <div className="title">
                Hyperledger Fabric Compliance Engine
                </div>
                <div className="subtitle">LedgerSafe Demo Application</div>
            </header>
        );
    }
}
export default Header;