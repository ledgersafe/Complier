import React, { Component } from 'react';
import { Table, Button } from 'reactstrap'
import './Ledger.css'

class Ledger extends Component {
    constructor(props) {
        super(props);
        this.ledger = this.props.ledger;
        this.callForHistory = this.callForHistory.bind(this)
    }

    callForHistory(key) {
        if (!this.props.isClosed) {
            if(this.props.selectedAssetID !== null && key === this.props.selectedAssetID){
                this.props.updateCollapsible();
            }
            else{
                this.props.updateSelectedAssetID(key);
            }
        }
        else {
            this.props.updateSelectedAssetID(key);
            this.props.updateCollapsible();
        }
    }

    render() {
        console.log("Ledger rendering")
        // console.log('isClosed status:', this.props.isClosed)
        return (
            <div id="ledtable">
                <h3 style={this.props.style}>All Assets</h3>
                <div class="table-wrapper-scroll-y my-custom-scrollbar">
                    <Table responsive bordered style={this.props.style}>
                        <thead style={{ backgroundColor: '#ffffff' }}>
                            <tr>
                                <th>ID</th>
                                <th>History</th>
                                <th>Business</th>
                                <th>Type</th>
                                <th>Quantity</th>
                                <th>Manufacturer</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.ledger.length > 0 ? (
                                this.props.ledger.map((output, i) => {
                                    return <tr key={i} style={{ backgroundColor: '#ffffff' }}>
                                        <th className="t-id" scope="row" row={i}>{output.key}</th>
                                        <td>{<Button color="success" onClick={() => this.callForHistory(output.key)}><span role="img"
                                            aria-label={this.props.label ? this.props.label : ""}
                                            aria-hidden={this.props.label ? "false" : "true"}>
                                            🔍
                                      </span></Button>}</td>
                                        <td>{output.holder.charAt(0).toUpperCase() + output.holder.slice(1).toLowerCase()}</td>
                                        <td>{output.assetType}</td>
                                        <td>{output.quantity}</td>
                                        <td>{output.manufacturer}</td>
                                        <td>{output.amount}</td>
                                    </tr>
                                })
                            ) : (
                                    <tr style={{ backgroundColor: '#ffffff' }}>
                                        <th className="t-id" scope="row">N/A</th>
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

export default Ledger;