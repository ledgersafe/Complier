import { Card, Button, CardSubtitle, CardTitle, CardText, CardGroup, CardBody, Col, Row, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './HistoryBlock.css'
import React, { Component } from "react";
import ReactDOM from 'react-dom'

class HistoryBlock extends Component {

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
                <Card body inverse color="primary">
                    <CardBody id="details">
                        <CardTitle>Transaction ID: {this.props.txId}</CardTitle>
                        <CardText>Holder: {this.props.holder}</CardText>
                        <CardSubtitle>Amount: {this.props.amount}</CardSubtitle>
                        <CardSubtitle>Time: {this.props.timestamp}</CardSubtitle>
                    </CardBody>
                </Card>
            </CardGroup>
        );
    }
}

export default HistoryBlock;