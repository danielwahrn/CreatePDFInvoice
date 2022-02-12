import React, {Fragment} from "react";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Api from '../../Api'
import bg3 from '../../assets/utils/images/originals/citynights.jpg';

import {Col, Row, Button, Form, FormGroup, Label, Input} from 'reactstrap';

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                username: '',
                email: '',
                // phone: '',
                password: '',
                repeatpassword: '',
            },
            validation: {
                username: '',
                email: '',
                // phone: '',
                password: '',
                repeatpassword: '',
            },
            submitted: false,
            checkpassword: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        const { user } = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({ submitted: true });
        const { user } = this.state;
        this.setState({ submitted: true });
        
        console.log('first')
        if (user.username !== '' && user.eamil !== '' && user.repeatpassword !== '' && user.password !== '') {     
            console.log('all')
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...user })
            };
            if(user.repeatpassword === user.password)   
                Api.apiFetch('/auth/admin/register', requestOptions)
                .then(result=> {
                    if(result.status){
                        this.setState({user: result.user})
                        this.props.history.push('/login')
                    }
                    else
                        this.setState({validation: result})
                    if(result.result)
                    alert(result.result)
                })
                .catch(error => {
                    alert(error)
                })
            else this.setState({checkpassword: true})
        }
    }

    render() {
        const { user, submitted, validation } = this.state;
        return (
            <Fragment>
            <div className="h-100">
                <Row className="h-100 no-gutters">
                    <Col lg="4" md="12" className="h-100 d-md-flex d-sm-block bg-white justify-content-center align-items-center">
                        <Col lg="12" md="10" sm="12" className="mx-auto app-login-box">
                            <div className="app-logo"/>
                            <h1 className="text-center">
                                <div>WELCOME</div>
                            </h1>
                            <div>
                                <Form>
                                    <Row form>
                                        <Col md={12}>
                                            <FormGroup className={submitted && !user.username ? ' has-error' : ''}>
                                                <Label for="exampleName"><span className="text-danger">*</span>
                                                    {' '}User Name</Label>
                                                <Input type="text" name="username" id="exampleName"
                                                       placeholder="Name here..."
                                                       value={user.username} onChange={this.handleChange}/>
                                                {submitted && !user.username &&
                                                <div className="help-block">UserName is required</div>
                                                }
                                               {submitted && validation.username &&
                                                <div className="help-block">{validation.username}</div>
                                                }
                                            </FormGroup>
                                        </Col>
                                        <Col md={12}>
                                            <FormGroup className={submitted && !user.email ? ' has-error' : ''}>
                                                <Label for="exampleEmail">
                                                    <span className="text-danger">*</span>
                                                    {' '}Email
                                                </Label>
                                                <Input type="email" name="email" id="exampleEmail"
                                                       placeholder="Email here..."
                                                       value={user.email} onChange={this.handleChange}/>
                                                {submitted && !user.email &&
                                                <div className="help-block">Email is required</div>
                                                }
                                                 {submitted && validation.email &&
                                                <div className="help-block">{validation.email}</div>
                                                }
                                            </FormGroup>
                                        </Col>
                                        <Col md={12}>
                                            <FormGroup className={submitted && !user.password ? ' has-error' : ''}>
                                                <Label for="examplePassword">
                                                    <span className="text-danger">*</span>
                                                    {' '}Password
                                                </Label>
                                                <Input type="password" name="password" id="examplePassword"
                                                       placeholder="Password here..."
                                                       value={user.password} onChange={this.handleChange}/>
                                                {submitted && !user.password &&
                                                <div className="help-block">Password is required</div>
                                                }
                                                 {submitted && validation.password &&
                                                <div className="help-block">{validation.password}</div>
                                                }
                                            </FormGroup>
                                        </Col>
                                        <Col md={12} className={submitted && !user.repeatpassword ? ' has-error' : ''}>
                                            <FormGroup>
                                                <Label for="examplePasswordRep">
                                                    <span className="text-danger">*</span>
                                                    {' '}Repeat Password
                                                </Label>
                                                <Input type="password" name="repeatpassword" id="examplePasswordRep"
                                                       placeholder="Repeat Password here..."
                                                       value={user.repeatpassword} onChange={this.handleChange}/>
                                                {submitted && !user.repeatpassword &&
                                                <div className="help-block">Password is not correct</div>
                                                }
                                                {this.state.checkpassword && 
                                                <div className="help-block">Reapeat Password is not correct</div>
                                                }
                                                {submitted && validation.repeatpassword &&
                                                <div className="help-block">{validation.repeatpassword}</div>
                                                }
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    {/* <FormGroup className="mt-3" check>
                                        <Input type="checkbox" name="check" id="exampleCheck"/>
                                        <Label for="exampleCheck" check>Accept our <a href="javascript:void(0);">Terms and Conditions</a>.</Label>
                                    </FormGroup> */}
                                    <div className="mt-4 d-flex text-center align-items-center" style={{float: 'right'}}>
                                            <Button color="primary" className="btn-wide btn-pill btn-shadow btn-hover-shine" size="lg" onClick={this.handleSubmit}>Create Account</Button>
                                        
                                    </div>
                                    <div className="mt-4 d-flex text-center align-items-center">
                                        <h5 className="mb-0">
                                                Already have an account?{' '}
                                                <Link to="/login" className="btn btn-link">Sign In</Link>
                                            </h5>
                                    </div>
                                </Form>
                            </div>
                        </Col>
                    </Col>
                    <Col lg="8" className="d-lg-flex d-xs-none">
                        <div className="slider-light">
                            <img src={bg3} className="full_image"></img>
                        </div>
                    </Col>
                </Row>
            </div>
        </Fragment>
        );
    }
}


// const connectedRegisterPage = connect()(RegisterPage);
// export { connectedRegisterPage as RegisterPage };

export default connect()(RegisterPage)