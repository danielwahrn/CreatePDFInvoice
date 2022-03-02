import React from 'react'
import { Link } from 'react-router-dom';
import {Row, Button, Col, Card} from 'reactstrap';
import styled from 'styled-components';
import FileInput from '../../../components/FileInput';
import bg1 from '../../../assets/utils/images/company/11.jpg';
const InputBox = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    margin-top: 20px;
    width: 100%;
    padding: 0px 350px;
`;

const Box = styled.div`
    padding: 100px 200px;
`;

export default class LoadDataPage extends React.Component {

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
                            
                                <InputBox>
                                    <Col md={6}>
                                        <i className="lnr lnr-book" /> Add Contractors
                                    </Col>
                                    <Col md={3}>
                                        <FileInput api='/admin/loaduserfromtext'/>
                                    </Col>
                                </InputBox>
                                <InputBox>
                                    <Col md={6}>
                                        <i className="lnr lnr-book" /> Add Tasks
                                    </Col>
                                    <Col md={3}>
                                        <FileInput api='/admin/loadtaskfromtext'/>
                                        
                                    </Col>
                                </InputBox>
                                <InputBox>
                                    <Col md={6}>
                                        <i className="lnr lnr-book" /> Add Material Safety Data Sheet
                                    </Col>
                                    <Col md={3}>
                                        <FileInput api='/admin/uploadmsds'/>
                                    </Col>
                                </InputBox>
                        </Row>
                        <Col md={12} style={{textAlign: 'center', marginTop: 20}}>
                            <p>Have you completed all the above steps. Now it’s time to register your company. Click the below link to register your company.</p>
                        </Col>
                        <Col md={12} style={{textAlign: 'center', marginTop: 50}}>
                            <Link to="/register">
                                <Button type="primary">REGISTER</Button>
                            </Link>
                        </Col>
                    </Box>
                </Card>
            </React.Fragment>
        )
    }

}

// const connectedLoadDataPage = connect()(LoadDataPage);
// export { connectedLoadDataPage as LoadDataPage }; 

