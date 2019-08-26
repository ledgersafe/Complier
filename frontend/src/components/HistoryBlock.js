import { Card, Button, CardSubtitle, CardTitle, CardText, CardGroup, CardBody, Col, Row, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './HistoryBlock.css'
import React, { Component } from "react";
import ReactDOM from 'react-dom'

class HistoryBlock extends Component {
    constructor(props){
        super(props);
        this.timestamp = this.props.timestamp.slice(0, -9);
    }

    componentDidUpdate() {
        console.log(this.props.isOpen)
        if(this.props.isOpen === true) {
            document.getElementById("details").style.visibility = "visible";
        }
        else {
            document.getElementById("details").style.visibility = "collapse";
        }
    }

    render() {
        console.log("rendering")
        return (
                <CardGroup style={{ padding: '10px'}}>
                <Card body inverse style={{backgroundColor: '#2C2F33', color: "white" }}>
                    <CardBody id="details">
                        <CardTitle style={{textAlign: 'center'}}><b>TX: {this.props.i}</b></CardTitle>
                        <CardSubtitle>Transaction ID: {this.props.txId.slice(0,5)}...</CardSubtitle>
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