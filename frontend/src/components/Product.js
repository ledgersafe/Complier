import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import $ from 'jquery'
import './Product.css'

class Product extends Component {
    constructor(props) {
        super(props);
        this.bid = '';
        this.holder = '';
        this.queryBusiness = this.queryBusiness.bind(this);
        // this.updateBid = this.updateBid.bind(this);
        this.getAll = this.getAll.bind(this);
    }

    getAll(data) {
        this.props.bizQuery(data);
    }

    queryBusiness({ target }) {
        this.bid = target.value
        this.props.bizQuery(this.bid)
    }

    render() {
        return (
            <Form onSubmit={e => { e.preventDefault(); }}>
                <div className="query">
                    <h3>Query Specific Business</h3>
                    <FormGroup>
                        <Label>Enter Cannabis Business</Label>
                        <Input id="bid" placeholder="Ex. Tegridy" onChange={this.queryBusiness} />
                    </FormGroup>
                </div>
            </Form>
        );
    }
}

export default Product;