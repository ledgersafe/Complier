import React, { Component } from 'react';
import HistoryBlock from './HistoryBlock'
import './Sidebar.css'

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.openNav = this.openNav.bind(this)
        this.closeNav = this.closeNav.bind(this)
    }

    openNav() {
        document.getElementById("mySidebar").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
      }

      closeNav() {
        document.getElementById("mySidebar").style.width = "0";
        document.getElementById("main").style.marginLeft= "0";
      }

    render() {
        return (
            <div id="mySidebar" class="sidebar">
            <h3>Transaction History</h3>
            <ul>
              {
                this.props.history.length > 0 ? (
                  this.props.history.map((output, i) => {
                    return <HistoryBlock key={i} timestamp={output.timestamp} amount={output.amount} holder={output.holder} txId={output.txId}/>
                  })
                ) : null
              }
            </ul>
            </div>
        );
    }
}

export default Sidebar;