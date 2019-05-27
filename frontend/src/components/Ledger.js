import React, { Component } from 'react';
import { Table } from 'reactstrap'
import './Ledger.css'

class Ledger extends Component {
    constructor(props) {
        super(props);
        this.ledger = this.props.ledger;
    }

    render() {
        console.log("Ledger rendering")
        return (
            <Table responsive bordered style={this.props.style}>
                <thead style={{ backgroundColor: '#ffffff' }}>
                    <tr>
                        <th>ID</th>
                        <th>Timestamp</th>
                        <th>Holder</th>
                        <th>Strain</th>
                        <th>Thc %</th>
                        <th>Grower</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.ledger.length > 0 ? (
                        this.props.ledger.map((output, i) => {
                            return <tr style={{ backgroundColor: '#ffffff' }}>
                                <th className="t-id" scope="row" row={i}>{i+1}</th>
                                <td>{output.timestamp}</td>
                                <td>{output.holder}</td>
                                <td>{output.strain}</td>
                                <td>{output.thc}</td>
                                <td>{output.grower}</td>
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
                            </tr>
                        )
                    }
                </tbody>
            </Table>
        );
    }
}

export default Ledger;