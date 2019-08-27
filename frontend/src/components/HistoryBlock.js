import { Card, CardSubtitle, CardTitle, CardGroup, CardBody } from 'reactstrap';
import './HistoryBlock.css'
import React, { Component } from "react";
import ReactDOM from 'react-dom'
import {copy} from '../static/copy.png'

class HistoryBlock extends Component {
    constructor(props) {
        super(props);
        this.copyID = this.copyID.bind(this);
    }

    copyID() {
        var copyhelper = document.createElement("input");
        copyhelper.className = 'copyhelper'
        document.body.appendChild(copyhelper);
        copyhelper.value = this.props.txId;
        console.log(this.props.txId)
        copyhelper.select();
        document.execCommand("copy");
        document.body.removeChild(copyhelper);
    }

    render() {
        console.log("rendering")
        return (
            <CardGroup style={{ padding: '10px' }}>
                <Card body inverse style={{ backgroundColor: '#2C2F33', color: "white" }}>
                    <CardBody id="details">
                        <CardTitle style={{ textAlign: 'center' }}>TX: <b>{this.props.i}</b></CardTitle>
                        <CardSubtitle>Transaction ID: <button className='link' title='Copy ID' onClick={()=>this.copyID()}>
                                                    {this.props.txId.substring(0, 5)}...
                                                    </button>
                                                    </CardSubtitle>
                        <CardSubtitle>Holder: {this.props.holder}</CardSubtitle>
                        <CardSubtitle>Amount: {this.props.amount}</CardSubtitle>
                        <CardSubtitle>Time: {this.props.timestamp}</CardSubtitle>
                    </CardBody>
                </Card>
            </CardGroup>
        );
    }
}

export default HistoryBlock;