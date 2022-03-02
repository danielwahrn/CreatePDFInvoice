import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import {Col, Row, Button, Form, FormGroup, Input} from 'reactstrap';
import Api from '../../Api'
import bg3 from '../../assets/utils/images/originals/citynights.jpg';


class InvitePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                email: '',
                password: '',
            },
            submitted: false,
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
         if(user.username !== '' && user.password !== ''){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...user })
            };
        
            Api.apiFetch('/auth/contractor/login', requestOptions).then(result=> {
                if(result.result)
                    alert(result.result)
                if(result.status){
                    Api.saveUser(result.user)
                    this.props.history.push('/contractor/task')
                }
                else if(!result.result && !result.status)
                    alert(result.message)
            })
        }
    }

    render() {
        const { user, submitted} = this.state;
        return (
            <Fragment>
                <div className="h-100">
                    <Row className="h-100 no-gutters">
                        <Col lg="4" md="12" className="h-100 d-flex bg-white justify-content-center align-items-center">
                            <Col lg="12" md="10" sm="12" className="mx-auto app-login-box">
                                <div className="app-logo"/>
                                <h1 className="mb-5 text-center">
                                    <div>Invite</div>
                                </h1>
                                <div>
                                    <Form onSubmit={ (e) => this.handleSubmit(e) }>
                                        <Row form>
                                            <Col md={12} style={{"margin":"auto"}}>
                                                <Col md={12}>
                                                    <FormGroup>
                                                        <Input type="text" name="username" 
                                                            placeholder="UserName here..."
                                                             onChange={this.handleChange}
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
                                                            onChange={this.handleChange}
                                                        />
                                                        {submitted && !user.password &&
                                                        <div className="help-block">Password is required</div>
                                                        }
                                                    </FormGroup>
                                                </Col>
                                                <Col md={12} className="text-center mt-3">
                                                    <Button color="primary" size="lg" block >Login</Button>
                                                </Col>
                                            </Col>
                                        </Row>
                                    </Form>
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

function mapStateToProps(state) {
    const { loggingIn } = state.authentication;
    return {
        loggingIn
    };
}

export default connect(mapStateToProps)(InvitePage)