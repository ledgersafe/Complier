import React from 'react';
import './App.css';
import Ledger from './components/Ledger'
import Product from './components/Product'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="title">
          Hyperledger Fabric Cannabis Application
        </div>
        <div className="subtitle">LedgerSafe Demo Application</div>
      </header>
      <div className="ui">
        <Product />
      </div>
      <div className="query-sec">
        <Ledger style={{color: '#c1b957'}} />
        <Ledger style={{color: '#69b5e5'}} />
      </div>
    </div>
  );
}

export default App;
