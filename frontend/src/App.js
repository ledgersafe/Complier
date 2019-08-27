import React, { Component } from 'react';
import './App.css';
import Ledger from './components/Ledger'
import BizLedger from './components/BizLedger'
import Product from './components/Product'
import Record from './components/Record'
import Holder from './components/Holder'
import { Button, Card, CardTitle, CardGroup, CardBody } from 'reactstrap'
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
    $(window).keydown(function (e) {
      if (e.which === 27) {
        _.updateCollapsible()
      }
    });
    this.getAllCannabis();
    this.updateCollapsible();
  }

  updateSidebarHistory(history) {
    let list = []
    for (let x in history) {
      var tx = history[x]
      console.log("Transaction: ", tx)
      var theDate = new Date(tx.value.timestamp * 1000);
      var t = theDate.toUTCString();
      list.unshift({ txId: tx.txId, holder: tx.value.holder, amount: tx.value.amount, timestamp: t })
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
    document.getElementById('sidebar').classList.toggle('active');
    if (!this.state.collapsible) {
      document.getElementById('historyButton').style.marginLeft = '0';
    }
    else {
      document.getElementById('historyButton').style.marginLeft = '250px';
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
          <div class="wrapper">
            <nav id="sidebar" >
              <div class="sidebar-header">
                <h3>Transaction History</h3>
              </div>
              <ul class="list-unstyled components" id='assetList'>
                {
                  this.state.history.length === 0 ? null : <p>Asset ID: {this.selectedAssetID}</p>
                }
                {
                  this.state.history.length > 0 ? (
                    this.state.history.map((output, i) => {
                      return <li><HistoryBlock key={i} isOpen={this.state.collapsible} i={this.state.history.length - i} timestamp={output.timestamp} amount={output.amount} holder={output.holder} txId={output.txId} /></li>
                    })) : (
                      <CardGroup style={{ padding: '10px' }}>
                        <Card body inverse style={{ backgroundColor: '#2C2F33', color: "white" }}>
                          <CardBody id="details">
                            <CardTitle style={{ textAlign: 'center' }}>There's nothing here, please select an asset to view its transaction history.</CardTitle>
                          </CardBody>
                        </Card>
                      </CardGroup>
                    )
                }
              </ul>
            </nav>
            <Button color="primary" title="Click or press ESC to view Asset History" id='historyButton'
              onClick={this.updateCollapsible}
              style={{ float: 'right' }}>
              <span role="img"
                aria-label={this.props.label ? this.props.label : ""}
                aria-hidden={this.props.label ? "false" : "true"}>
                🔍
                                      </span>
            </Button>
            <div id="content" style={{ width: '100%' }}>
              <div class="container-fluid" id="main">
                <div>
                  <div class='row'>
                    <div class='col-3' id='column'>
                      <Holder getAllCannabis={this.getAllCannabis} updateSelectedAssetID={this.updateSelectedAssetID} />
                    </div>
                    <div class='col-9'>
                      <Ledger isOpen={this.state.collapsible} updateCollapsible={this.updateCollapsible} ledger={this.state.ledger} style={{ color: '#95c13e' }} updateSelectedAssetID={this.updateSelectedAssetID} />
                    </div>
                  </div>
                  <div class='row'>
                    <div class='col-3' id='column'>
                      <Product getAllCannabis={this.getAllCannabis} bizQuery={this.bizQuery} />
                    </div>
                    <div class='col-9'>
                      <BizLedger bid={this.state.bid} ledger={this.state.ledger} style={{ color: '#69b5e5' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    )
  }
}

export default App;
