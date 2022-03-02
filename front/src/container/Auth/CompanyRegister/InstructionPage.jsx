import React from 'react'
import {Link} from 'react-router-dom'
import {Row, Col, Card, Button} from 'reactstrap'
import styled from 'styled-components'
import bg1 from '../../assets/utils/images/company/11.jpg'
const Box = styled.div`
    padding: 100px 200px;
`;

export default class InstructionPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <Card style={{minHeight: 500}}>
                    <Box>
                        <Row>
                            <Col md={12} >
                                <div className="text-center">
                                    <h4>Register Company</h4>
                                </div>
                            </Col>
                            <Col md={12} style={{marginTop: 50}}>
                                <Col md={4} style={{margin: 'auto'}}>
                                    <ul>
                                        <li>How to get all the contractors and save it to the website</li>
                                        <li>How to get all the tasks and save it to the website</li>
                                        <li>General information on how to use the system</li>
                                    </ul>
                                </Col >
                            </Col>
                            <Col md={12} className="text-center">
                                <img src={bg1} width="200px"/>
                            </Col>
                            
                            <Col md={12} style={{textAlign: 'center', marginTop: 50}}>
                                <Link to="/company/loaddata">
                                    <Button type="primary">LOAD</Button>
                                </Link>
                            </Col>
                        </Row>
                    </Box>
                </Card>
            </React.Fragment>
        )
    }

}

// const connectedInstructionPage = connect()(InstructionPage);
// export { connectedInstructionPage as InstructionPage }; 