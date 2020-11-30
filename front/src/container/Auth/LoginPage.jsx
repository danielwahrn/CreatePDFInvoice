import React, {Fragment, Component} from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {Col, Row, Button, Form, FormGroup, FormText, FormFeedback, Label, Input} from 'reactstrap';
import actions from './actions';
import bg3 from '../../assets/utils/images/originals/citynights.jpg';


class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                username: '',
                password: '',
            },
            submitted: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        const { user } = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { user } = this.state;
     
        this.props.login(user)
        
    }

    render() {
        const { loggedIn } = this.props;
        const { user, submitted } = this.state;
        return (
            <Fragment>
                <div className="h-100">
                    <Row className="h-100 no-gutters">
                    <Col lg="4" md="12" className="h-100 d-flex bg-white justify-content-center align-items-center">
                            <Col lg="12" md="10" sm="12" className="mx-auto app-login-box">
                                <div className="app-logo"/>
                                <h1 className="mb-5 text-center"> ADMIN </h1>
                                <div>
                                    { loggedIn ? '' :
                                    <Form className="form" onSubmit={ (e) => this.handleSubmit(e) }>
                                        <Row form>
                                            <Col md={6} style={{"margin":"auto"}}>
                                                <Col md={12}>
                                                    <FormGroup>
                                                        <Input type="input" name="username"
                                                            placeholder="Username here..."
                                                            value={user.username} onChange={this.handleChange}
                                                        />
                                                        {submitted && !user.username &&
                                                        <div className="help-block">Username is required</div>
                                                        }
                                                    </FormGroup>
                                                </Col>
                                                <Col md={12}>
                                                    <FormGroup>
                                                        <Input type="password" name="password"
                                                            placeholder="Password here..."
                                                            value={user.password} onChange={this.handleChange}
                                                        />
                                                        {submitted && !user.password &&
                                                        <div className="help-block">Password is required</div>
                                                        }
                                                    </FormGroup>
                                                </Col>
                                                <Col md={12} className="text-center mt-3">
                                                    <Button color="primary" size="lg" block >Login</Button>
                                                </Col>
                                                <Col md={12} className="text-center mt-3">
                                                    <h6 className="mt-3">
                                                        No account?{' '}
                                                        <Link to="/company/instruction" className="btn btn-link">SignUp Now</Link>
                                                    </h6>
                                                </Col>
                                            </Col>
                                        </Row>
                                        <div className="d-flex align-items-center">
                                            <div className="ml-auto">
                                            </div>
                                        </div>
                                    </Form>
                                    }
                                </div>
                                
                            </Col>
                        </Col>
                        <Col lg="8" className="d-none d-lg-block">
                            <div className="slider-light">
                            <img src={bg3} className="full_image" />
                            </div>
                        </Col>
                        
                    </Row>
                </div>
            </Fragment>
        );
    }
}

export default connect(null, actions)(LoginPage)