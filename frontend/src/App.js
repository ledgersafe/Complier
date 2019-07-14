import React, { Component } from 'react';
import './App.css';
import Ledger from './components/Ledger'
import BizLedger from './components/BizLedger'
import Product from './components/Product'
import Record from './components/Record'
import Holder from './components/Holder'
import { Col, Row } from 'reactstrap'
import $ from 'jquery'
import LS from './static/LS.png'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ledger: [],
      biz: '',
      bid: ''
    }

    this.getAllCannabis = this.getAllCannabis.bind(this);
    this.updateLedger = this.updateLedger.bind(this);
    this.bizQuery = this.bizQuery.bind(this);
  }

  // componentDidMount always executes first before everything else
  componentDidMount() {
    console.log('component did mount')
    this.getAllCannabis();
  }

  getAllCannabis() {
    $.ajax({
      url: 'http://localhost:4000/queryAll',
      type: 'GET',
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      crossDomain: true,
      dataType: 'json',
      xhrFields: { withCredentials: true },
      success: (data) => {
        if (data.message === 'OK') {
          console.log('getAllCannabis success!')
          this.updateLedger(data.result);
        }
        else {
          console.log('ERROR');
        }
      }
    });
  }

  //Changes state of 'ledger', automatically refreshes page
  updateLedger(data) {
    var array = [];
    for (var i = 0; i < data.length; i++) {
      parseInt(data[i].Key);
      data[i].Record.Key = parseInt(data[i].Key);
      array.push(data[i].Record);
    }
    array.sort(function (a, b) {
      return parseFloat(a.Key) - parseFloat(b.Key);
    });
    console.log("ARRAY: ", array)
    this.setState({ ledger: array });
  }

  bizQuery(data) {
    console.log('calling bizQuery')
    this.setState({ bid: data })
  }

  render() {
    console.log("App rendering")
    return (
      <div className="App">
        <header className="App-header">
          <img src={LS} alt='LedgerSafe' height='100' width='100'/>
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
            <Col md={6} id='column'>
              <Holder getAllCannabis={this.getAllCannabis} />
            </Col>
            <Col md={6} id='column'>
              <Product getAllCannabis={this.getAllCannabis} bizQuery={this.bizQuery} />
            </Col>
          </Row>
          <Row>
            <Col md={6} id='column'>
              <Ledger ledger={this.state.ledger} style={{ color: '#95c13e' }} />
            </Col>
            <Col md={6} id='column'>
              <BizLedger bid={this.state.bid} ledger={this.state.ledger} style={{ color: '#69b5e5' }} />
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default App;
