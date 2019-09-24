import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import $ from 'jquery'
import './Holder.css'

class Product extends Component {
    constructor(props) {
        super(props);
        this.myAssets = [];
        this.id = '';
        this.holder = '';
        this.amount = '';
        this.sellAssets = this.sellAssets.bind(this);
        this.updateHolder = this.updateHolder.bind(this);
        this.updateId = this.updateId.bind(this);
        this.updateAmount = this.updateAmount.bind(this);
        this.getAll = this.getAll.bind(this);
        this.transactionHistoryID = this.props.selectedAssetID
    }

    updateTransactionHistoryID(id){
        this.transactionHistoryID = id;
    }

    getAll() {
        this.props.getAllAsset();
    }

    updateHolder({ target }) {
        this.holder = target.value
    }

    updateId({ target }) {
        this.id = target.value
    }

    updateAmount({ target }) {
        this.amount = target.value;
    }

    checkOwnership(){
        for(let i = 0; i < this.myAssets.length; i++){
            if(this.id === this.myAssets[i]){
                console.log('owned')
                return true;
            }
        }
        console.log('not')
        return false;
    }

    sellAssets(e) {
        e.preventDefault();
        ReactDOM.findDOMNode(this.refs.sold).style.height = "80px";
        if(!this.id || !this.holder || !this.amount){
        ReactDOM.findDOMNode(this.refs.sold).innerHTML = "<p>Please fill in all fields.</p>";
        ReactDOM.findDOMNode(this.refs.sold).style.color = "#7a7a7a";
        }
        else if(!this.checkOwnership()){
            ReactDOM.findDOMNode(this.refs.sold).innerHTML = "<p>You do not own this asset.</p>";
            ReactDOM.findDOMNode(this.refs.sold).style.color = "#7a7a7a";
        }
        else if(isNaN(this.amount)){
            ReactDOM.findDOMNode(this.refs.sold).innerHTML = "<p>Please enter valid amount.</p>";
            ReactDOM.findDOMNode(this.refs.sold).style.color = "#7a7a7a";
        }
        else{
            this.amount = Number.parseFloat(this.amount).toFixed(2);
            ReactDOM.findDOMNode(this.refs.sold).innerHTML = "<p>Selling Assets, please wait...</p>";
            ReactDOM.findDOMNode(this.refs.sold).style.color = "#7a7a7a";
            $.ajax({
                url: 'http://13.82.210.187/change',
                type: 'POST',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                crossDomain: true,
                dataType: 'json',
                xhrFields: { withCredentials: true },
                data: {
                    id: this.id,
                    holder: this.holder,
                    amount: parseFloat(this.amount).toFixed(2)
                },
                success: (data) => {
                    if (data.message === 'OK') {
                        console.log('change_holder success!')
                        // console.log(data)
                        ReactDOM.findDOMNode(this.refs.sold).innerHTML = "<p>Sold!</p>";
                        ReactDOM.findDOMNode(this.refs.sold).style.color = "#acd854";
                        var tempId = this.id;
                        this.id = '';
                        this.holder = '';
                        this.amount = '';
                        $('#id').val('');
                        $('#holder').val('');
                        $('#amount').val('');
                        this.getAll()
                        this.props.clearTransactionHistory(tempId);
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
        // console.log('what is history id', this.transactionHistoryID)
        if (this.props.name !== '') {
            let list = [];
            for (let i = 0; i < this.props.ledger.length; i++) {
                if (this.props.ledger[i].holder.toString().toLowerCase().includes(this.props.name.toString().toLowerCase())) {
                    list.push(this.props.ledger[i].key)
                }
            }
            // console.log('retrieval of list', list)
            this.myAssets = list;
        }
        return (
            <Form>
                <div className="form" style={this.props.style}>
                    <div className="change">
                        <h3>Sell Asset</h3>
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
                    {/* <div className="col text-center"> */}
                        <Button color="success" block onClick={(e) => this.sellAssets(e)}>Sell</Button>{' '}
                    {/* </div> */}
                    <div ref="sold" className="expandable" id="nav">
                    </div>
                </div>
            </Form>
        );
    }
}

export default Product;