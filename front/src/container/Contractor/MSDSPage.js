import React, {Fragment} from 'react';
import {Col, Row, Button, Form} from 'reactstrap';
import Api from '../../Api'


export default class MSDSPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pdf: null,
            loadURL: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        Api.apiFetchStream('/contractor/loadmsds').then(result=> {
            
                if (result.status !== undefined) {
                    alert(result.message);
                }
                else {

                    const file = new Blob([result], {
                        type: "application/pdf"
                    });

                    const loadURL = URL.createObjectURL(file);
                    this.setState({ loadURL });

                }
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        Api.updateMSDS();
        this.props.history.push('/contractor/task')
    }

    render() {
        const {loadURL } = this.state;
        return (
            <Fragment>
                <div className="h-100">
                    <Row className="h-100 no-gutters">
                        <Col lg="12" md="12" className="h-100 d-flex bg-white justify-content-center align-items-center">
                            <Col lg="12" md="10" sm="12" className="mx-auto app-login-box">
                                <Col md={10} style={{"margin":"auto", "textAlign": "center"}}>
                                    {loadURL !== '' && 
                                    <iframe src={loadURL} frameBorder="1" style={ { width: "100%", height: "800px", margin: "auto" } }></iframe>
                                    }
                                </Col>
                                <div>
                                    <Form onSubmit={ (e) => this.handleSubmit(e) }>
                                        <Row form>
                                            <Col md={4} style={{"margin":"auto"}}>
                                                <Col md={12} className="text-center mt-3">
                                                    <Button color="primary" size="lg" block >Accept</Button>
                                                </Col>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                                
                            </Col>
                        </Col>
                    </Row>
                </div>
            </Fragment>
        );
    }
}