import React, { Component } from 'react';
import './App.css';
import Header from './components/Header'
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
import ReactDOM from 'react-dom'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ledger: [],
      history: [],
      biz: '',
      bid: '',
      collapsible: false,
      name: this.props.location.state.name,
      modal: false
    }
    // this.child = React.createRef();
    this.selectedAssetID = null;
    this.role = 'business'
    this.getAllAsset = this.getAllAsset.bind(this);
    this.updateLedger = this.updateLedger.bind(this);
    this.bizQuery = this.bizQuery.bind(this);
    this.getHistory = this.getHistory.bind(this);
    this.updateSelectedAssetID = this.updateSelectedAssetID.bind(this);
    this.updateSidebarHistory = this.updateSidebarHistory.bind(this);
    this.updateCollapsible = this.updateCollapsible.bind(this)
    this.toggle = this.toggle.bind(this);
    this.addAsset_creating = this.addAsset_creating.bind(this)
    this.addAsset_fill = this.addAsset_fill.bind(this)
    this.addAsset_created = this.addAsset_created.bind(this)
    this.addAsset_error = this.addAsset_error.bind(this)
  }

  addAsset_creating(){
    ReactDOM.findDOMNode(this.refs.made).style.height = "80px";
    ReactDOM.findDOMNode(this.refs.made).innerHTML = "<p>Creating Asset, please wait...</p>";
    ReactDOM.findDOMNode(this.refs.made).style.color = "#7a7a7a";
  }

  addAsset_fill(){
    ReactDOM.findDOMNode(this.refs.made).innerHTML = "<p>Please fill in all fields.</p>";
    ReactDOM.findDOMNode(this.refs.made).style.color = "#7a7a7a";
  }

  addAsset_created(){
    ReactDOM.findDOMNode(this.refs.made).innerHTML = "<p>Asset created!</p>";
    ReactDOM.findDOMNode(this.refs.made).style.color = "#acd854";
  }

  addAsset_error(){
    ReactDOM.findDOMNode(this.refs.made).innerHTML = "<p>An error has occurred.</p>";
    ReactDOM.findDOMNode(this.refs.made).style.color = "#7a7a7a";
  }

  // componentDidMount always executes first before everything else
  componentDidMount() {
    var _ = this;
    // console.log('component did mount', this.state.collapsible)
    $(window).keydown(function (e) {
      if (e.which === 27) {
        _.updateCollapsible()
      }
    });
    this.getAllAsset();
    this.updateCollapsible();
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  updateSidebarHistory(history) {
    let list = []
    for (let x in history) {
      var tx = history[x]
      // console.log("Transaction: ", tx)
      // var theDate = new Date(tx.Value.timestamp * 1000);
      // var t = theDate.toUTCString();
      list.unshift({ txId: tx.TxId, holder: tx.Value.holder, amount: tx.Value.amount, timestamp: tx.Timestamp.split('.')[0] })
    }
    // console.log("history", list)
    this.setState({ history: list })
    // console.log("sidebar history", this.state.history);
  }

  updateSelectedAssetID(value) {
    this.selectedAssetID = value;
    // this.child.current.updateTransactionHistoryID(value);
    // console.log(value)
    // if(value !== null){
      this.getHistory();
    // }
  }

  getAllAsset() {
    $.ajax({
      url: 'http://localhost:4000/queryAll',
      type: 'GET',
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      crossDomain: true,
      dataType: 'json',
      xhrFields: { withCredentials: true },
      success: (data) => {
        if (data.message === 'OK') {
          console.log('getAllAsset success!')
          this.updateLedger(data.result);
        }
        else {
          console.log('getAllAsset ERROR');
        }
      }
    });
  }

  getHistory() {
    // let assetId = this.selectedAssetID;
    // console.log('calling getHistory ajax', assetId)
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
          // console.log(data.history);
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
    // console.log('calling bizQuery')
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
        <Header role={this.role} />
        {/* <header className="App-header">
          <img src={LS} alt='LedgerSafe' height='100' width='100' />
          <div className="title">
            LedgerSafe Compliance Engine
          </div>
          <div className="subtitle"></div>
        </header> */}
        <div className="ui">
          <div class="wrapper">
            <nav id="sidebar" >
              <div class="sidebar-header">
                <h3>Transaction History</h3>
                {
                  this.state.history.length === 0 ? null : <p>Asset ID: {this.selectedAssetID}</p>
                }
              </div>
              <ul class="list-unstyled components" id='assetList'>
                {
                  this.state.history.length > 0 ? (
                    this.state.history.map((output, i) => {
                      return <li><HistoryBlock key={i} i={this.state.history.length - i} timestamp={output.timestamp} amount={output.amount} holder={output.holder} txId={output.txId} /></li>
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
                    <div class='col-3' id='column' style={{textAlign: 'center'}}>
                      <Holder getAllAsset={this.getAllAsset} updateSelectedAssetID={this.updateSelectedAssetID} name={this.state.name} ledger={this.state.ledger}/>
                      <Button color="warning" block onClick={this.toggle}>Create Asset</Button>
                      <div ref="made" className="expandable" id="nav"></div>
                      <Record modal={this.state.modal} 
                              toggle={this.toggle} 
                              getAllAsset={this.getAllAsset} 
                              selectedAssetID={this.selectedAssetID}
                              addAsset_creating={this.addAsset_creating}
                              addAsset_fill={this.addAsset_fill}
                              addAsset_created={this.addAsset_created}
                              addAsset_error={this.addAsset_error} />
                    </div>
                    {/* <div class='col-3' id='column'>
                    </div> */}
                    <div class='col-9'>
                    <BizLedger title={'My Assets'} selectedAssetID={this.selectedAssetID} isClosed={this.state.collapsible} updateCollapsible={this.updateCollapsible} bid={this.state.name} ledger={this.state.ledger} style={{ color: '#95c13e' }} updateSelectedAssetID={this.updateSelectedAssetID} />
                    </div>
                  </div>
                  {/* <div class='row'>
                </div> */}
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
