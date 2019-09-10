import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import './Record.css'

class Record extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Form className="form">
                <div className="record">
                <h3>Create Asset Record</h3>
                    <FormGroup>
                        <Label>Enter Asset ID</Label>
                        <Input id="id" placeholder="Ex. 3" />
                    </FormGroup>
                    <FormGroup>
                        <Label>Enter Name of Grower</Label>
                        <Input id="grower" placeholder="Ex. 0239L" />
                    </FormGroup>
                    <FormGroup>
                        <Label>Enter Strain</Label>
                        <Input id="strain" placeholder="Ex. 28.012" />
                    </FormGroup>
                    <FormGroup>
                        <Label>Enter THC</Label>
                        <Input id="thc" placeholder="Ex. 150.405" />
                    </FormGroup>
                    <FormGroup>
                        <Label>Enter Timestamp</Label>
                        <Input id="timestamp" placeholder="Ex. 4982342301" />
                    </FormGroup>
                    <FormGroup>
                        <Label>Enter Name of Holder</Label>
                        <Input id="holder" placeholder="Ex. Hansel" />
                    </FormGroup>
                </div>
                <div class="col text-center">
                    <Button color="success" block>Create</Button>
                </div>
            </Form>
        );
    }
}

export default Record;