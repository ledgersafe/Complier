import React, { Component } from 'react';
import './Product.css'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'

class Product extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Form>
                <div className="query">
                    <h3>Query Specific Cannabis Product</h3>
                    <FormGroup>
                        <Label>Enter Cannabis ID</Label>
                        <Input id="id" placeholder="Ex. 3" />
                    </FormGroup>
                </div>
                <div class="col text-center">
                    <Button color="primary" block>Query</Button>
                </div>
            </Form>
        );
    }
}

export default Product;