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
                <div className="change">
                    <h3>Change Cannabis Holder</h3>
                    <FormGroup>
                        <Label>Enter Cannabis ID</Label>
                        <Input id="id" placeholder="Ex. 3" />
                    </FormGroup>
                    <FormGroup>
                        <Label>Enter Name of New Holder</Label>
                        <Input id="id" placeholder="Ex. Barry" />
                    </FormGroup>
                </div>
                <div class="col text-center">
                    <Button color="warning" block>Change</Button>{' '}
                </div>
            </Form>
        );
    }
}

export default Product;