import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import {Col, Row, Button,
    Card, CardBody,CardHeader,
    Modal, ModalHeader, ModalFooter, ModalBody,
    } from 'reactstrap';
import ReactTable from "react-table";
import { saveSync } from 'save-file';

import moment from 'moment';

import Api from '../../Api';

class HistoryPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadURL: '',
            selectedHistory:null,
            selectedWork: null,
            historyList: [],
            currentHistory: {
                _id: -1,
                title: '',
                description: '',
                start: moment(new Date).format('HH: mm'),
                end: moment(new Date).format('HH: mm'),
                hour: '0 mins',
            },
            deleteModal: false
        };

        this.toggle = this.toggle.bind(this);        
        this.deleteToggle = this.deleteToggle.bind(this)
    }

    componentDidMount() {
        const option = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }

        Api.apiFetch('/admin/loadhistory', option)
        .then(data => {
            this.setState({historyList: data.result})
        })
        .catch(error => {
            console.log(error);
        });

    }

    toggle(event) {

        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    handleChange(selectedHistory){
        this.setState({selectedHistory})
        const temp = this.state.historyList.filter(history => history._id ===selectedHistory.value)
        this.setState({currentHistory: temp[0]})
    }

    onHandleChange(e){
        const {name, value} = e.target;

        const {currentHistory} = this.state
    
        this.setState({
            currentHistory: {
                ...currentHistory,
                [name]: value
            }
        })
        
    }
    onHandleWorkChange(e){
        const {name, value} = e.target;
        const {selectedHistory} = this.state
        this.setState({
            selectedHistory: {
                ...selectedHistory,
                [name]: value
            }
        })
        
    }

    showDeleteConfirmModal(id) {
        const temp = this.state.historyList.filter(history => history._id === id)
        this.setState({selectedHistory: temp[0]})
        this.setState({deleteModal: true})
    }

    deleteToggle() {
        this.setState({
            deleteModal: !this.state.deleteModal
        });
    }

    deleteHistory(){
        const {selectedHistory} = this.state;

        const option = {
            method: "POST",
            headers: {
                "content-type":"application/json"
            },
            body: JSON.stringify({...selectedHistory})
        }

        Api.apiFetch("/admin/delete/history", option)
        .then(data => {
            if (data.status) {
                this.setState({historyList: data.result})
                this.deleteToggle()
            }
        })
        .catch(error =>{})
    }

    async export2TextHistory() {
        const option = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }

        Api.apiFetch('/admin/export2TextHistory', option)
        .then(result => {
            if(result.status)
                alert('Successful')
        })
        .catch(error => {
            alert(error)
        })

        var data="sdfsdf";

        saveSync(data, 'example2.txt')
    }

    render() {
       const {deleteModal, historyList} = this.state;
       const columns = [
            {
                Header: 'Date',
                accessor: 'date',
                width: 120
            },
            {
                Header: 'ActivityID',
                accessor: 'taskcode',
                width: 150
            }, 
            {
                Header: 'Cust. Co./Last Name',
                accessor: 'lastname',
                width: 150,
                // render: row => (
                //     `${row.Contractor.lastname}`
                // )
            },
            {
                Header: 'Cust. First Name',
                accessor: 'firstname',
                // render: row => (
                //     `${row.Contractor.firstname}`
                // ),
                width: 150
            },
            {
                Header: 'Units',
                accessor: 'hour',
                width: 80
            },
            {
                Header: 'Start Time',
                accessor: 'starttime',
                width: 100
            },
            {
                Header: 'Stop Time',
                accessor: 'endtime',
                width: 100
            },
            
            {
                Header: 'Notes',
                accessor: 'notes',
            },
            {
                Header: 'Emp. Record ID',
                accessor: 'contractor',
                width: 200
            },
            {
                Header: 'Actions',
                id: 'actions',
                width: 80,
                accessor: d =>
                    <Button outline className="btn-shadow btn-dashed" color="secondary" onClick={(e) => this.showDeleteConfirmModal(d._id)}>
                        <i className="lnr-trash"> </i>
                    </Button>
            }
        ]
        return (
            <Fragment>
                <Row className="h-100 no-gutters" style={{"paddingLeft": "20px", paddingRight: 20}}>
                    <Col md="12" style={{paddingLeft: "20px"}}>
                        <Card className="main-card mb-3">
                            <CardHeader className = "text-right">
                                History
                                {/* <div className="btn-actions-pane-right">
                                    <Button outline className="btn-shadow" color="secondary" onClick={(e) => this.export2TextHistory()}>
                                    <i className="pe-7s-diskette"> </i>
                                    </Button>
                                </div> */}
                            </CardHeader>
                            <CardBody>
                                <ReactTable
                                    data={historyList}
                                    columns={columns}
                                    defaultPageSize={10}
                                    className="-striped -highlight"
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
               <Modal isOpen={deleteModal} toggle={this.deleteToggle}>
                    <ModalHeader>Delete Confirm</ModalHeader>
                    <ModalBody>Do you want to delete this history?</ModalBody>
                    <ModalFooter>
                        <Button  outline className="btn-shadow btn-dashed" color="secondary" onClick={this.deleteToggle}>Cancel</Button>
                        <Button color="secondary" onClick={this.deleteHistory}>Confirm</Button>
                    </ModalFooter>
                </Modal>
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

const connectedHistoryPage = connect(mapStateToProps)(HistoryPage);
export { connectedHistoryPage as HistoryPage }; 