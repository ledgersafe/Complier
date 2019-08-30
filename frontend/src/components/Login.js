import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { Input, Form, Button, FormGroup, Card, Row, Col } from 'reactstrap';
import { log } from '../App';
import './Login.css'
import '../App.css'
import $ from 'jquery'
import LS from '../static/LS.png'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            businessLoginSuccess: false,
            regulatorLoginSuccess: false
        };
        this.name = null;
        this.username = null;
        this.password = null;
        this.updateUsername = this.updateUsername.bind(this)
        this.updatePassword = this.updatePassword.bind(this)
        this.redirectAfterLogin = this.redirectAfterLogin.bind(this);
    }

    componentDidMount = async () => {

    };

    updateUsername({ target }) {
        this.username = target.value;
    }

    updatePassword({ target }) {
        this.password = target.value;
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.onFormSubmit(event);
        }
    }

    redirectAfterLogin() {
        console.log('hello', log.loggedIn, this.name)
        if (this.state.businessLoginSuccess) {
            return (
                <Redirect to={{
                    pathname: '/business',
                    state: { name: this.name }
                }}
                />);
        }
        else if (this.state.regulatorLoginSuccess) {
            return (
                <Redirect to={{
                    pathname: '/regulator',
                    state: { name: this.name }
                }}
                />);
        }
    }

    onFormSubmit = async (e) => {
        e.preventDefault()
        $.ajax({
            url: 'http://localhost:4000/login',
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            crossDomain: true,
            dataType: 'json',
            xhrFields: { withCredentials: true },
            data: { username: this.username },
            success: (data) => {
                if (data.message === 'OK') {
                    console.log('Success', data.response)
                    this.name = data.response.user;
                    console.log(this.name)
                    if (data.response.role === 'regulator') {
                        this.setState({ regulatorLoginSuccess: true })
                    } else if (data.response.role === 'business') {
                        this.setState({ businessLoginSuccess: true })
                    }
                }
                else {
                    console.log('ERROR', data.response);
                }
            }
        });
    }

    render() {
        return (
            <div>
                {this.redirectAfterLogin()}
                <Card id="loginCard">
                    <header className="App-header" style={{fontSize: 'larger'}}>
                        <div className="title">
                            Hyperledger Fabric Compliance Engine
                </div>
                        <div className="subtitle">LedgerSafe Demo Application</div>
                    </header>
                    <Row style={{padding: '30px'}}>
                        <Col md={6}>
                            <img src={LS} alt='LedgerSafe' height='150' width='150' style={{ display: 'block', margin: 'auto' }} />
                        </Col>
                        <Col md={6}>
                            <Form id="form" onSubmit={this.onFormSubmit} style={{ textAlign: 'center' }}>
                                <FormGroup>
                                    <Input placeholder="Username" onChange={this.updateUsername} />
                                    <br></br>
                                    <Input type="password" placeholder="Password" onChange={this.updatePassword} />
                                </FormGroup>
                                <Button type="submit" color='success'>Enter</Button>
                            </Form>
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }
}

export default Login;