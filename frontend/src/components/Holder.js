import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import $ from 'jquery'
import './Holder.css'

class Product extends Component {
    constructor(props) {
        super(props);
        this.id = '';
        this.holder = '';
        this.buttonDoSomething = this.buttonDoSomething.bind(this);
        this.updateHolder = this.updateHolder.bind(this);
        this.updateId = this.updateId.bind(this);
    }

    updateHolder({target}){
        this.holder = target.value
    }

    updateId({target}){
        this.id = target.value
    }

    buttonDoSomething(e, id, holder){
        e.preventDefault();
        console.log('hello')
        $.ajax({
            url: 'http://localhost:4000/change',
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            crossDomain: true,
            dataType: 'json',
            xhrFields: { withCredentials: true },
            data: {
                id: this.id,
                holder: this.holder
            },
            success: (data) => {
              if (data.message === 'OK') {
                console.log('change_holder success!')
                this.props.updateLedger(data.result);
              }
              else {
                console.log('ERROR');
              }
            }
          });
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
                            <Input id="amount" placeholder="Ex. 500" />
                        </FormGroup>
                    </div>
                    <div className="col text-center">
                        <Button color="success" block onClick={(e) => this.buttonDoSomething(e, )}>Sell</Button>{' '}
                    </div>
                </div>
            </Form>
        );
    }
}

export default Product;