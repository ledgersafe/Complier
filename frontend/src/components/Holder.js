import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import $ from 'jquery'
import './Holder.css'

class Product extends Component {
    constructor(props) {
        super(props);
        this.id = '';
        this.holder = '';
        this.amount = '';
        this.sellAssets = this.sellAssets.bind(this);
        this.updateHolder = this.updateHolder.bind(this);
        this.updateId = this.updateId.bind(this);
        this.updateAmount = this.updateAmount.bind(this);
        this.getAll = this.getAll.bind(this);
    }

    getAll() {
        this.props.getAllCannabis();
    }

    updateHolder({ target }) {
        this.holder = target.value
    }

    updateId({ target }) {
        this.id = target.value
    }

    updateAmount({ target }) {
        this.amount = target.value
    }

    sellAssets(e) {
        e.preventDefault();
        ReactDOM.findDOMNode(this.refs.sold).style.height = "50px";
        if(!this.id || !this.holder){
        ReactDOM.findDOMNode(this.refs.sold).innerHTML = "<p>Please fill in all fields.</p>";
        ReactDOM.findDOMNode(this.refs.sold).style.color = "#7a7a7a";
        }
        else{
            ReactDOM.findDOMNode(this.refs.sold).innerHTML = "<p>Selling Assets, please wait...</p>";
            ReactDOM.findDOMNode(this.refs.sold).style.color = "#7a7a7a";
            $.ajax({
                url: 'http://localhost:4000/change',
                type: 'POST',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                crossDomain: true,
                dataType: 'json',
                xhrFields: { withCredentials: true },
                data: {
                    id: this.id,
                    holder: this.holder,
                    amount: this.amount
                },
                success: (data) => {
                    if (data.message === 'OK') {
                        console.log('change_holder success!')
                        console.log(data)
                        ReactDOM.findDOMNode(this.refs.sold).innerHTML = "<p>Sold! Transaction ID: "+data.tx_id+"</p>";
                        ReactDOM.findDOMNode(this.refs.sold).style.color = "#acd854";
                        this.getAll()
                    }
                    else {
                        ReactDOM.findDOMNode(this.refs.sold).innerHTML = "<p>An error has occurred.</p>";
                        ReactDOM.findDOMNode(this.refs.sold).style.color = "#7a7a7a";
                        console.log('ERROR');
                    }
                }
            });
        }
    }

    render() {
        return (
            <Form>
                <div className="form">
                    <div className="change">
                        <h3>Sell Assets</h3>
                        <FormGroup>
                            <Label>Enter Asset ID</Label>
                            <Input id="id" placeholder="Ex. 3" onChange={this.updateId} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Enter Name of New Holder</Label>
                            <Input id="holder" placeholder="Ex. Barry" onChange={this.updateHolder} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Enter Amount</Label>
                            <Input id="amount" placeholder="Ex. 500" onChange={this.updateAmount} />
                        </FormGroup>
                    </div>
                    <div className="col text-center">
                        <Button color="success" block onClick={(e) => this.sellAssets(e)}>Sell</Button>{' '}
                    </div>
                    <div ref="sold" className="expandable" id="nav">
                    </div>
                </div>
            </Form>
        );
    }
}

export default Product;