import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import ReactDOM from 'react-dom'
import './Record.css'
import $ from 'jquery'

class Record extends Component {
    constructor(props) {
        super(props);
        this.id = null;
        this.manu = null;
        this.type = null;
        this.quantity = null;
        this.timestamp = null;
        this.holder = null;
        this.amount = null;
        this.getAll = this.getAll.bind(this);
        this.updateHolder = this.updateHolder.bind(this);
        this.updateId = this.updateId.bind(this);
        this.updateQuanity = this.updateQuanity.bind(this);
        this.updateManuf = this.updateManuf.bind(this);
        this.updateTimestamp = this.updateTimestamp.bind(this);
        this.updateType = this.updateType.bind(this);
        this.updateAmount = this.updateAmount.bind(this);
    }

    updateHolder({ target }) {
        this.holder = target.value
    }

    updateAmount({ target }) {
        this.amount = target.value
    }

    updateId({ target }) {
        this.id = target.value
    }

    updateQuanity({ target }) {
        this.quantity = target.value;
    }

    updateManuf({ target }) {
        this.manuf = target.value
    }

    updateTimestamp({ target }) {
        this.timestamp = target.value
    }

    updateType({ target }) {
        this.type = target.value;
    }

    getAll() {
        this.props.getAllAsset();
    }

    addAsset(){
        ReactDOM.findDOMNode(this.refs.made).style.height = "80px";
            ReactDOM.findDOMNode(this.refs.made).innerHTML = "<p>Creating Asset, please wait...</p>";
            ReactDOM.findDOMNode(this.refs.made).style.color = "#7a7a7a";
            console.log(this.id, this.type, this.quantity, this.holder, this.manuf, this.amount)
            if(!this.id ||
                !this.type ||
                !this.quantity ||
                !this.timestamp ||
                !this.holder ||
                !this.manuf ||
                !this.amount){
                    ReactDOM.findDOMNode(this.refs.made).innerHTML = "<p>Please fill all fields.</p>";
                    ReactDOM.findDOMNode(this.refs.made).style.color = "#7a7a7a";
                }
            else {
                $.ajax({
                    url: 'http://localhost:4000/add',
                    type: 'POST',
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    crossDomain: true,
                    dataType: 'json',
                    xhrFields: { withCredentials: true },
                    data: {
                        key: this.id,
                        assetType: this.type,
                        quantity: this.quantity,
                        timestamp: this.timestamp,
                        holder: this.holder,
                        manufacturer: this.manuf,
                        amount: this.amount
                    },
                    success: (data) => {
                        if (data.message === 'OK') {
                            console.log('add_asset success!')
                            console.log(data)
                            ReactDOM.findDOMNode(this.refs.made).innerHTML = "<p>Asset created!</p>";
                            ReactDOM.findDOMNode(this.refs.made).style.color = "#acd854";
                            this.id = null;
                            this.manu = null;
                            this.type = null;
                            this.quantity = null;
                            this.timestamp = null;
                            this.holder = null;
                            this.amount = null;
                            $('#id').val('');
                            $('#amount').val('');
                            $('#holder').val('');
                            $('#quantity').val('');
                            $('#manufacturer').val('');
                            $('#type').val('');
                            $('#timestamp').val('');
                            this.getAll()
                        }
                        else {
                            ReactDOM.findDOMNode(this.refs.made).innerHTML = "<p>An error has occurred.</p>";
                            ReactDOM.findDOMNode(this.refs.made).style.color = "#7a7a7a";
                            console.log('ERROR');
                        }
                    }
                });
            }
    }

    render() {
        return (
            <Form className="form">
                <div className="record">
                <h3>Create Asset</h3>
                    <FormGroup>
                        <Label>Enter Asset ID</Label>
                        <Input id="id" placeholder="Ex. 3" onChange={this.updateId}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>Enter Name of Manufacturer</Label>
                        <Input id="manufacturer" placeholder="Ex. 0239L" onChange={this.updateManuf}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>Enter Type</Label>
                        <Input id="type" placeholder="Ex. 28.012" onChange={this.updateType}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>Enter Quantity</Label>
                        <Input id="quantity" placeholder="Ex. 150.405" onChange={this.updateQuanity}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>Enter Timestamp</Label>
                        <Input id="timestamp" placeholder="Ex. 4982342301" onChange={this.updateTimestamp}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>Enter Amount</Label>
                        <Input id="amount" placeholder="Ex. 4" onChange={this.updateAmount}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>Enter Name of Holder</Label>
                        <Input id="holder" placeholder="Ex. Hansel" onChange={this.updateHolder}/>
                    </FormGroup>
                </div>
                <div class="col text-center">
                    <Button color="success" block onClick={(e) => this.addAsset(e)}>Create</Button>
                    </div>
                    <div ref="made" className="expandable" id="nav">
                </div>
            </Form>
        );
    }
}

export default Record;