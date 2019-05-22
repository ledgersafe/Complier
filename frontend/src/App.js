import React from 'react';
import './App.css';
import Ledger from './components/Ledger'
import Product from './components/Product'
import Record from './components/Record'
import Holder from './components/Holder'
import { Col, Row } from 'reactstrap'

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
        <Row>
            <Col md={4}>
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
            </Col>
        </Row>
      </div>
    </div>
  );
}

export default App;
