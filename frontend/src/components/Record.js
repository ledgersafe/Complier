import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactDOM from 'react-dom'
import './Record.css'
import $ from 'jquery'

class Record extends Component {
    constructor(props) {
        super(props);
        this.id = null;
        this.name = this.props.name;
        this.type = null;
        this.quantity = null;
        this.timestamp = null;
        this.holder = null;
        this.amount = null;
        this.getAll = this.getAll.bind(this);
        this.updateQuanity = this.updateQuanity.bind(this);
        this.updateTimestamp = this.updateTimestamp.bind(this);
        this.updateType = this.updateType.bind(this);
        this.updateAmount = this.updateAmount.bind(this);
        this.randomStr = this.randomStr.bind(this)
    }

    cancellation(){
        this.props.toggle();
    }

    confirmation(){
        this.addAsset();
        this.props.toggle();
    }

    updateAmount({ target }) {
        this.amount = target.value
    }

    updateQuanity({ target }) {
        this.quantity = target.value;
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
    
    randomStr(len, arr) { 
        var ans = ''; 
        for (var i = len; i > 0; i--) { 
            ans +=  
              arr[Math.floor(Math.random() * arr.length)]; 
        } 
        return ans;
    } 

    addAsset() {
        this.props.addAsset_creating();
        console.log(this.type, this.quantity, this.amount, this.timestamp)
        if (!this.type ||
            !this.quantity ||
            !this.timestamp ||
            !this.amount) {
                this.props.addAsset_fill();
        }
        else {
            this.id = (parseInt(this.props.parentkey)+1).toString()
            console.log('what is the id', this.id)
            $.ajax({
                url: 'http://13.82.210.187/add',
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
                    holder: this.name,
                    manufacturer: this.name,
                    amount: this.amount
                },
                success: (data) => {
                    if (data.message === 'OK') {
                        console.log('add_asset success!')
                        this.props.addAsset_created();
                        this.type = null;
                        this.quantity = null;
                        this.timestamp = null;
                        this.amount = null;
                        $('#amount').val('');
                        $('#quantity').val('');
                        $('#type').val('');
                        $('#timestamp').val('');
                        this.getAll()
                    }
                    else {
                        this.props.addAsset_error();
                        console.log('ERROR');
                    }
                }
            });
        }
    }

    render() {
        return (
            <Modal isOpen={this.props.modal} toggle={this.props.toggle} className={this.props.className}>
                <ModalHeader className="record" toggle={this.props.toggle}>Create Asset</ModalHeader>
                <ModalBody>
                    <Form className="form">
                        {/* <FormGroup>
                            <Label>Enter Asset ID</Label>
                            <Input id="id" placeholder="Ex. 3" onChange={this.updateId} />
                        </FormGroup> */}
                        {/* <FormGroup>
                            <Label>Enter Name of Manufacturer</Label>
                            <Input id="manufacturer" placeholder="Ex. 0239L" onChange={this.updateManuf} />
                        </FormGroup> */}
                        <FormGroup>
                            <Label>Enter Type</Label>
                            <Input id="type" placeholder="Ex. 28.012" onChange={this.updateType} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Enter Quantity</Label>
                            <Input id="quantity" placeholder="Ex. 150.405" onChange={this.updateQuanity} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Enter Timestamp</Label>
                            <Input id="timestamp" placeholder="Ex. 4982342301" onChange={this.updateTimestamp} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Enter Amount</Label>
                            <Input id="amount" placeholder="Ex. 4" onChange={this.updateAmount} />
                        </FormGroup>
                        {/* <FormGroup>
                            <Label>Enter Name of Holder</Label>
                            <Input id="holder" placeholder="Ex. Hansel" onChange={this.updateHolder} />
                        </FormGroup> */}
                    </Form>
                </ModalBody>
                <ModalFooter>
                    {/* <div class="col text-center"> */}
                        <Button color="success" onClick={(e) => this.confirmation(e)}>Create</Button>
                        <Button color="danger" onClick={(e) => this.cancellation(e)}>Cancel</Button>
                    {/* </div> */}
                </ModalFooter>
            </Modal>
        );
    }
}

export default Record;