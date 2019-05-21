import React, { Component } from 'react';
import './Product.css'

class Product extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="product">
                <input className="query" type="text" placeholder="Enter a Cannibis ID Number" />
            </div>
        );
    }
}

export default Product;