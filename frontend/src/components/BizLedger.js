import React, { Component } from 'react';
import { Table, Button } from 'reactstrap'
import './BizLedger.css'

class BizLedger extends Component {
    constructor(props) {
        super(props);
        this.callForHistory = this.callForHistory.bind(this)
    }

    //if selectedAssetID == null, 
    callForHistory(key) {
        if (!this.props.isClosed) {
            if (this.props.selectedAssetID !== null && key === this.props.selectedAssetID) {
                this.props.updateCollapsible();
            }
            else {
                this.props.updateSelectedAssetID(key);
            }
        }
        else {
            this.props.updateSelectedAssetID(key);
            this.props.updateCollapsible();

        }
    }

    render() {
        console.log("BizLedger rendering")
        let queriedLedger = []
        let queriedBid = this.props.bid
        if (queriedBid !== '') {
            for (let i = 0; i < this.props.ledger.length; i++) {
                if (this.props.ledger[i].holder.toString().toLowerCase().includes(queriedBid.toString().toLowerCase())) {
                    queriedLedger.push({ info: this.props.ledger[i] })
                }
            }
        }
        return (

            <div id="ledtable">
                <h3 style={this.props.style}>{this.props.title}</h3>
                <div class="table-wrapper-scroll-y my-custom-scrollbar">
                    <Table responsive bordered style={this.props.style}>
                        <thead style={{ backgroundColor: '#ffffff' }}>
                            <tr>
                                <th>ID</th>
                                <th>History</th>
                                <th>Business</th>
                                <th>Type</th>
                                <th>Thc %</th>
                                <th>Manufacturer</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.ledger.length > 0 ? (
                                queriedLedger.map((output, i) => {
                                    return <tr key={i} style={{ backgroundColor: '#ffffff' }}>
                                        <th className="b-id" scope="row" row={i}>{output.info.key}</th>
                                        <td>{<Button color="info" onClick={() => this.callForHistory(output.info.key)}><span role="img"
                                            aria-label={this.props.label ? this.props.label : ""}
                                            aria-hidden={this.props.label ? "false" : "true"}>
                                            🔍
                                      </span></Button>}</td>                                        
                                      <td>{output.info.holder.charAt(0).toUpperCase() + output.info.holder.slice(1).toLowerCase()}</td>
                                        <td>{output.info.assetType}</td>
                                        <td>{output.info.quantity}</td>
                                        <td>{output.info.manufacturer}</td>
                                        <td>{output.info.amount}</td>
                                    </tr>
                                })
                            ) : (
                                    <tr style={{ backgroundColor: '#ffffff' }}>
                                        <th className="b-id" scope="row">N/A</th>
                                        <td>N/A</td>
                                        <td>N/A</td>
                                        <td>N/A</td>
                                        <td>N/A</td>
                                        <td>N/A</td>
                                        <td>N/A</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }
}

export default BizLedger;