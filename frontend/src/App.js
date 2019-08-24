import React, { Component } from 'react';
import './App.css';
import Ledger from './components/Ledger'
import BizLedger from './components/BizLedger'
import Product from './components/Product'
import Record from './components/Record'
import Holder from './components/Holder'
import { Col, Row, Button } from 'reactstrap'
import $ from 'jquery'
import LS from './static/LS.png'
import HistoryBlock from './components/HistoryBlock'
import './components/Sidebar.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ledger: [],
      history: [],
      biz: '',
      bid: '',
      collapsible: false
    }
    this.selectedAssetID = null;
    this.getAllCannabis = this.getAllCannabis.bind(this);
    this.updateLedger = this.updateLedger.bind(this);
    this.bizQuery = this.bizQuery.bind(this);
    this.getHistory = this.getHistory.bind(this);
    this.updateSelectedAssetID = this.updateSelectedAssetID.bind(this);
    this.updateSidebarHistory = this.updateSidebarHistory.bind(this);
    this.updateCollapsible = this.updateCollapsible.bind(this)
  }

  // componentDidMount always executes first before everything else
  componentDidMount() {
    var _ = this;
    console.log('component did mount', this.state.collapsible)
    $(window).keypress(function (e) {
      if (e.which === 32) {
        _.updateCollapsible()
      }
    });
    this.getAllCannabis();
  }

  updateSidebarHistory(history) {
    let list = []
    for (let x in history) {
      var tx = history[x]
      console.log("Transaction: ", tx)
      list.unshift({ txId: tx.TxId, holder: tx.value.holder, amount: tx.value.amount, timestamp: tx.Timestamp })
    }
    console.log("history", list)
    this.setState({ history: list })
    console.log("sidebar history", this.state.history);
  }

  updateSelectedAssetID(value) {
    this.selectedAssetID = value;
    console.log(value)
    this.getHistory();
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
          console.log('getAllCannabis ERROR');
        }
      }
    });
  }

  getHistory() {
    let assetId = this.selectedAssetID;
    console.log('calling getHistory ajax', assetId)
    $.ajax({
      url: 'http://localhost:4000/getHistory',
      type: 'POST',
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      crossDomain: true,
      dataType: 'json',
      xhrFields: { withCredentials: true },
      data: { assetID: this.selectedAssetID },
      success: (data) => {
        if (data.message === 'OK') {
          console.log('getHistory success!')
          console.log(data.history);
          this.updateSidebarHistory(data.history);
        }
        else {
          console.log('getHistory ERROR');
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

  updateCollapsible() {
    if (!this.state.collapsible) {
      document.getElementById("mySidebar").style.width = "170px";
      document.getElementById("main").style.marginLeft = "60px";
      document.getElementById("txList").style.right = "-40px";
    }
    else {
      document.getElementById("mySidebar").style.width = "50px";
      document.getElementById("main").style.marginLeft = "-60px";
      document.getElementById("txList").style.right = "40px";
    }
    this.setState({ collapsible: !this.state.collapsible })
  }

  render() {
    console.log("App rendering")
    return (
      <div className="App">
        <header className="App-header">
          <img src={LS} alt='LedgerSafe' height='100' width='100' />
          <div className="title">
            Hyperledger Fabric Cannabis Application
        </div>
          <div className="subtitle">LedgerSafe Demo Application</div>
        </header>
        <div className="ui">
          <Row>
            <Col md={1}>
              <Row>
                <div id="mySidebar" className="sidebar">
                  <Button onClick={this.updateCollapsible} style={{ float: 'right' }}>Click</Button>
                    <h3 id='transactionTitle'>Transaction History</h3>
                  <ul id='txList'>
                    {
                      this.state.history.map((output, i) => {
                        return <HistoryBlock isOpen={this.state.collapsible} key={i} timestamp={output.timestamp} amount={output.amount} holder={output.holder} txId={output.txId} />
                      })
                    }
                  </ul>
                </div>
              </Row>
            </Col>
            <Col md={11} style={{ padding: '15px' }}>
              <div id="main" style={{marginLeft: '-60px'}}>
              <Row>
                <Col md={3} id='column'>
                  <Holder getAllCannabis={this.getAllCannabis} updateSelectedAssetID={this.updateSelectedAssetID} />
                </Col>
                <Col md={9} id='column'>
                  <Ledger ledger={this.state.ledger} style={{ color: '#95c13e' }} updateSelectedAssetID={this.updateSelectedAssetID} />
                </Col>
              </Row>
              <Row>
                <Col md={3} id='column'>
                  <Product getAllCannabis={this.getAllCannabis} bizQuery={this.bizQuery} />
                </Col>
                <Col md={9} id='column'>
                  <BizLedger bid={this.state.bid} ledger={this.state.ledger} style={{ color: '#69b5e5' }} />
                </Col>
              </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default App;
