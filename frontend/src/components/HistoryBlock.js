import { Card, Button, CardTitle, CardText, CardGroup, CardBody, Col, Row, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './HistoryBlock.css'
import React, { Component } from "react";

class HistoryBlock extends Component {
    render() {
        console.log("rendering")
        return (
            <CardGroup style={{ padding: '10px' }}>
                <Card body inverse color="primary">
                    <CardBody>
                        <CardTitle>Transaction</CardTitle>
                        <CardText>asvsf</CardText>
                    </CardBody>
                </Card>
            </CardGroup>
        );
    }
}

export default HistoryBlock;