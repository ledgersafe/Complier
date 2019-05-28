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
        this.updateBid = this.updateBid.bind(this);
        this.getAll = this.getAll.bind(this);
    }

    getAll(data) {
        this.props.bizQuery(data);
    }

    updateBid({ target }) {
        this.bid = target.value
        console.log(this.bid)
    }



    queryBusiness(e) {
        e.preventDefault();
        this.props.bizQuery(this.bid)
        //ReactDOM.findDOMNode(this.refs.sold).innerHTML = "<p>Querying Business, please wait...</p>";
        //ReactDOM.findDOMNode(this.refs.sold).style.height = "50px";
        //ReactDOM.findDOMNode(this.refs.sold).style.color = "#7a7a7a";
        // console.log("Queries Biz")
        // console.log("ID: ", this.bid)
        // $.ajax({
        //     url: 'http://localhost:4000/querybusiness',
        //     type: 'POST',
        //     contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        //     crossDomain: true,
        //     dataType: 'json',
        //     xhrFields: { withCredentials: true },
        //     data: {
        //         id: this.bid
        //     },
        //     success: (data) => {
        //         if (data.message === 'OK') {
        //             console.log('Query success!')
        //             //ReactDOM.findDOMNode(this.refs.sold).innerHTML = "<p>Business Queried! Transaction ID: "+data.tx_id+"</p>";
        //             //ReactDOM.findDOMNode(this.refs.sold).style.color = "#acd854";
        //             //this.getAll()
        //             console.log(data)
        //             this.getAll(data.tx_id)
        //         }
        //         else {
        //             console.log('ERROR');
        //         }
        //     }
        //});
    }

    render() {
        return (
            <Form>
                <div className="query">
                    <h3>Query Specific Business</h3>
                    <FormGroup>
                        <Label>Enter Cannabis Business</Label>
                        <Input id="bid" placeholder="Enter Business" onChange={this.updateBid} />
                    </FormGroup>
                </div>
                <div class="col text-center">
                    <Button color="primary" block onClick={(e) => this.queryBusiness(e)}>Query</Button>
                </div>
            </Form>
        );
    }
}

export default Product;