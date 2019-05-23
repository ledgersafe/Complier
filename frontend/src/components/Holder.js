import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import './Holder.css'

class Product extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Form>
                <div className="form">
                    <div className="change">
                        <h3>Sell Assets</h3>
                        <FormGroup>
                            <Label>Enter Asset ID</Label>
                            <Input id="id" placeholder="Ex. 3" />
                        </FormGroup>
                        <FormGroup>
                            <Label>Enter Name of New Holder</Label>
                            <Input id="id" placeholder="Ex. Barry" />
                        </FormGroup>
                        <FormGroup>
                            <Label>Enter Amount</Label>
                            <Input id="id" placeholder="Ex. Barry" />
                        </FormGroup>
                    </div>
                    <div className="col text-center">
                        <Button color="success" block>Sell</Button>{' '}
                    </div>
                </div>
            </Form>
        );
    }
}

export default Product;