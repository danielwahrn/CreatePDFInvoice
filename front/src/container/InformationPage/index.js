import React from 'react'
import { connect } from 'react-redux';
import {Row, Col, Card, CardHeader, CardBody} from 'reactstrap'

class InformationPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <Row className="h-100 no-gutters">
                    <Col md={12}>
                        <Card>
                            <CardHeader>
                                InformationPage
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md={24}>
                                        <ul>
                                            <li>How to get all the contractors and save it to the website</li>
                                            <li>How to get all the tasks and save it to the website</li>
                                            <li>General information on how to use the system</li>
                                        </ul>
                                    </Col>
                                    <Col md={24} style={{textAlign: 'center'}}>
                                        <p>Have you completed all the above steps now it’s time toregister your company.Click the below link to register your company</p>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </React.Fragment>
        )
    }

}

function mapStateToProps(state) {
    const { loggingIn } = state.authentication;
    return {
        loggingIn
    };
}

const connectedInformationPage = connect(mapStateToProps)(InformationPage);
export { connectedInformationPage as InformationPage }; 