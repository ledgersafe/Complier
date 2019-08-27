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
        this.props.updateSelectedAssetID(key);
        if (this.props.isOpen) {
            this.props.updateCollapsible();
        }
    }

    render() {
        console.log("Ledger rendering")
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
                                <th>Strain</th>
                                <th>Thc %</th>
                                <th>Grower</th>
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
                                        <td>{output.strain}</td>
                                        <td>{output.thc}</td>
                                        <td>{output.grower}</td>
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