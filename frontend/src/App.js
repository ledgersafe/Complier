import React, { Component } from 'react';
import './App.css';
import Ledger from './components/Ledger'
import Product from './components/Product'
import Record from './components/Record'
import Holder from './components/Holder'
import { Col, Row } from 'reactstrap'
import $ from 'jquery'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      ledger: []
    }

    this.getAllCannabis = this.getAllCannabis.bind(this);
    this.updateLedger = this.updateLedger.bind(this);
  }

  // componentDidMount always executes first before everything else
  componentDidMount(){
    this.getAllCannabis();
  }

  getAllCannabis(){
    $.ajax({
      url: 'http://localhost:4000/getall',
      type: 'POST',
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      crossDomain: true,
      dataType: 'json',
      xhrFields: { withCredentials: true },
      data: {
        username: this.username,
        password: this.password
      },
      success: (data) => {
        this.updateLedger(data.result);
      }
    });
  }

  //Changes state of 'ledger', automatically refreshes page
  updateLedger(result){
    this.setState({ledger: result});
  }

  render() {
    console.log("App rendering")
    return (
      <div className="App">
        <header className="App-header">
          <div className="title">
            Hyperledger Fabric Cannabis Application
        </div>
          <div className="subtitle">LedgerSafe Demo Application</div>
        </header>
        <div className="ui">
          <Row>
            {/* <Col md={4}>
              <Ledger style={{ color: '#acd854' }} />
            </Col>
            <Col md={4}>
              <Ledger style={{ color: '#69b5e5' }} />
            </Col>
            <Col md={2}>
              <Record />
            </Col>
            <Col md={2}>
              <Product />
              <Holder />
            </Col> */}
            <Holder />
          </Row>
          <Row>
            <Col md={12}>
              <Ledger ledger={this.state.ledger} style={{ color: '#95c13e' }} />
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default App;
