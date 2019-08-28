import React, { Component } from 'react';
import { Table, Button } from 'reactstrap'
import './BizLedger.css'

class BizLedger extends Component {
    constructor(props) {
        super(props);
        this.callForHistory = this.callForHistory.bind(this)
    }

    callForHistory(key) {
        this.props.updateSelectedAssetID(key);
        if (this.props.isOpen) {
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
                    queriedLedger.push({ info: this.props.ledger[i], index: i })
                }
            }
        }
        return (

            <div id="ledtable">
                <h3 style={this.props.style}>All Queried Assets</h3>
                <div class="table-wrapper-scroll-y my-custom-scrollbar">
                    <Table responsive bordered style={this.props.style}>
                        <thead style={{ backgroundColor: '#ffffff' }}>
                            <tr>
                                <th>ID</th>
                                <th>History</th>
                                <th>Business</th>
                                <th>Strain</th>
                                <th>Thc %</th>
                                <th>Grower</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.ledger.length > 0 ? (
                                queriedLedger.map((output, i) => {
                                    return <tr key={i} style={{ backgroundColor: '#ffffff' }}>
                                        <th className="b-id" scope="row" row={i}>{output.index + 1}</th>
                                        <td>{<Button color="info" onClick={() => this.callForHistory(output.key)}><span role="img"
                                            aria-label={this.props.label ? this.props.label : ""}
                                            aria-hidden={this.props.label ? "false" : "true"}>
                                            🔍
                                      </span></Button>}</td>                                        <td>{output.info.holder.charAt(0).toUpperCase() + output.info.holder.slice(1).toLowerCase()}</td>
                                        <td>{output.info.strain}</td>
                                        <td>{output.info.thc}</td>
                                        <td>{output.info.grower}</td>
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