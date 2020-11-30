import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import {generate} from 'generate-password'

import {Col, Row, Card, CardBody, Button, CustomInput, CardHeader, Modal, ModalHeader, ModalFooter, ModalBody, FormGroup, Input,  Form, Label} from 'reactstrap';
import ReactTable from "react-table";
import Select from 'react-select';
import { save, saveSync } from 'save-file';

import { PDFDocument } from 'pdf-lib'

import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import FileInput from '../../components/FileInput'

import Api from '../../Api';

class ContractorPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadURL: '',
            selectedContractor: [],
            taskModal: false,
            inviteModal: false,
            addModal: false,
            editModal: false,
            deleteModal: false,
            numPages: null, 
            pageNumber: 1,
            searchText:'document',
            contractorlist: [],
            contractor: {
                id:-1,
                firstname: '',
                lastname: '',
                username: '',
                jobsite: '',
                password: '',
                confirm: '',
                email: '',
                phone: ''
            },
            submitted: false,
            misPhone: false,
            generatePassword: '',
        };

        this.taskToggle = this.taskToggle.bind(this)
        this.storeTask = this.storeTask.bind(this)
        this.inviteToggle = this.inviteToggle.bind(this)
        this.addToggle = this.addToggle.bind(this)
        this.editToggle = this.editToggle.bind(this)
        this.deleteToggle = this.deleteToggle.bind(this)
        this.onHandleChange = this.onHandleChange.bind(this)
        this.onUpdateHandleChange = this.onUpdateHandleChange.bind(this)
    }

    componentDidMount() {
        const {contractorlist} = this.state;

        const option = {
            method: "GET",
            header: {
                "content-type":"application/json"
            }
        }

        Api.apiFetch("/admin/getcontractors", option)
        .then(data => {
            if(data.status) {
                //
                this.setState({contractorlist: data.result})
            }
            else {
                alert('load faild')
            }
        })
        .catch(error =>{
            //alert('load call faild')
            console.log('getcontractorlisterror', error)
        })
    }

    showInviteModal(id) {
        const temp = this.state.contractorlist.filter(contractor => contractor._id === id)
        this.setState({selectedContractor: temp[0]})
        this.setState({inviteModal: true})

       // this.loadPDF();
    }

    showAddContractorModal() {
        var password = generate({
            length: 10,
            numbers: true
        });
        
        const {contractor} = this.state
        
        // this.setState({contractor:{
        //     ...contractor,
        //     [password]: password
        // }})
        // this.forceUpdate()

        this.setState({generatePassword: password})
        
        this.setState({addModal: true})
    }

    showEditContractorModal(id) {
        const temp = this.state.contractorlist.filter(contractor => contractor._id === id)
        this.setState({selectedContractor: temp[0]})
        this.setState({editModal: true})
    }
    
    showDeleteConfirmModal(id) {
        const temp = this.state.contractorlist.filter(contractor => contractor._id === id)
        this.setState({selectedContractor: temp[0]})
        this.setState({deleteModal: true})
    }

    taskToggle() {
        this.setState({
            taskModal: !this.state.taskModal
        });
    }

    inviteToggle() {
        this.setState({
            inviteModal: !this.state.inviteModal
        });
    }

    addToggle() {
        this.setState({
            addModal: !this.state.addModal
        });
    }

    editToggle() {
        this.setState({
            editModal: !this.state.editModal
        });
    }

    deleteToggle() {
        this.setState({
            deleteModal: !this.state.deleteModal
        });
    }

    addContractor = () => {
        const {contractor, generatePassword} = this.state;
        this.setState({submitted: true})

        this.setState({contractor:{
            ...contractor,
            ['password']: generatePassword
        }})

        if(contractor.firstname !== '' &&  contractor.lastname !== '' && contractor.username !== '' && contractor.email !== '' && contractor.phone !== '' && contractor.password !== '') {
            if(contractor.phone.indexOf('+') < 0){
                this.setState({misPhone: true})
                return;
            }
            const option = {
                method: "POST",
                headers: {
                    "content-type":"application/json"
                },
                body: JSON.stringify({...contractor})
            }

            Api.apiFetch("/admin/addcontractor", option)
            .then(data => {
                if (data.status) {
                    this.addToggle()
                    this.setState({contractorlist: data.result})
                }
                else {
                    alert(data.result)
                }
            })
            .catch(error =>{})
        }
    }

    editContractor =() => {
        const {selectedContractor} = this.state;
        this.setState({submitted: true})
        if(selectedContractor.firstname !== '' &&  selectedContractor.lastname !== '' && selectedContractor.username !== '' && selectedContractor.email !== '' && selectedContractor.phone !== '' && selectedContractor.password !== '') {

            if(selectedContractor.phone.indexOf('+') < 0)
            {
                this.setState({misPhone: true})
                return;
            }

            const option = {
                method: "POST",
                headers: {
                    "content-type":"application/json"
                },
                body: JSON.stringify({...selectedContractor})
            }

            Api.apiFetch("/admin/editcontractor", option)
            .then(data => {
                if (data.status) {
                    this.setState({contractorlist: data.result})
                    this.editToggle()
                }
            })
            .catch(error =>{})
        }
    }
    deleteContractor =() => {
        const {selectedContractor} = this.state;

        const option = {
            method: "POST",
            headers: {
                "content-type":"application/json"
            },
            body: JSON.stringify({...selectedContractor})
        }

        Api.apiFetch("/admin/deletecontractor", option)
        .then(data => {
            if (data.status) {
                this.setState({contractorlist: data.result})
                this.deleteToggle()
            }
        })
        .catch(error =>{})
    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
      };

    loadPDF() {
        
        const option = {
            method: "GET",
            headers: {
                "Content-Type": "application/pdf"
            }
        }
        /* fetch(`http://localhost:8001/api/viewtask`, {
            method: "GET",
            headers: {
                "Content-Type": "application/pdf"
            }
        }) */
        Api.apiFetchStream("/admin/viewtask", option)
        // .then(res => res.blob())
        .then(response => {
            //Create a Blob from the PDF Stream
            console.log(response);
            const file = new Blob([response], {
                type: "application/pdf"
            });
            //Build a URL from the file
            const loadURL = URL.createObjectURL(file);
            //Open the URL on new Window
            this.setState({loadURL})

            this.setState({selectedContractor: {
                doc: loadURL
            }})

           /*  WebViewer({
                initialDoc: loadURL,
                ui:'lefacy'
            }, document.getElementById('webviewer'))
            .then(instance => {})
             */
        })
        .catch(error => {
            console.log(error);
        });
    }

    sendInvite() {
        const option = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({...this.state.selectedContractor})
        }
        
        Api.apiFetch("/admin/sendInvite", option)
        .then(data => {
            if(data.status){
                this.inviteToggle()
                alert("sent successful")
            }
        })
        .catch(error => {
            alert("sent error")
        });

    }

    storeTask() {
        this.setState({
            taskModal: !this.state.taskModal
        });

        fetch(`http://localhost:8001/api/storeTask`, {
            method: "POST",
            headers: {
                "Content-Type": "application/pdf"
            }
        })
        .then(res => res.blob())
        .then(response => {
            //Create a Blob from the PDF Stream
            console.log(response);
            const file = new Blob([response], {
            type: "application/pdf"
            });
            //Build a URL from the file
            const loadURL = URL.createObjectURL(file);
            //Open the URL on new Window
            this.setState({loadURL})

            this.setState({selectedContractor: {
                doc: loadURL
            }})
        })
        .catch(error => {
            console.log(error);
        });
    }

    export2Text() {
        const option = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }

        Api.apiFetch('/admin/exportuser2text', option)
        .then(result => {
            if(result.status)
                saveSync(result.result, 'contractors.txt');
        })
        .catch(error => {
            alert(error)
        })

    }

    loadText = (data) => {
        console.log('data', data)
        this.setState({contractorList: data})
        window.location.reload()
    }

    onHandleChange(e) {
        const {contractor} = this.state
        const {name, value} = e.target;
        this.setState({contractor:{
            ...contractor,
            [name]: value
        }})
    }
    onUpdateHandleChange(e) {
        const {selectedContractor} = this.state
        const {name, value} = e.target;
        this.setState({selectedContractor:{
            ...selectedContractor,
            [name]: value
        }})
    }

    render() {
       const {taskModal, inviteModal, addModal, editModal, deleteModal, contractor, contractorlist, selectedContractor, submitted} = this.state
       const columns = [
        {
            Header: '',
            id: 'id',
            width: 40,
            accessor: row => (
                <CustomInput type="checkbox" id="eCheckbox1" value={row._id}
                         label="&nbsp;"/>
            )
        },
        {
            Header: 'First Name',
            accessor: 'firstname'
        }, 
        {
            Header: 'Last Name',
            accessor: 'lastname',
        },
        {
            Header: 'Job Site',
            accessor: 'jobsite',
        },
        {
            Header: 'User Name',
            accessor: 'username'
        },
        {
            Header: 'Password',
            accessor: 'password'
        },
        {
            Header: 'Phone Number',
            accessor: 'phone'
        },
        {
            Header: 'Email',
            accessor: 'email'
        },
        {
            Header: 'Invite',
            id: 'invite',
            width: 120,
            accessor: row => (
                <Button outline className="btn-shadow btn-dashed" color="secondary" onClick={(e) => this.showInviteModal(row._id)}>
                    Send <i className="lnr-location"> </i>
                </Button>
            )
        },
        {
            Header: 'Actions',
            id: 'actions',
            width: 120,
            accessor: d =>
                <div>
                
                {/* <Button outline className="btn-shadow btn-dashed" color="info" onClick={(e) => this.showTaskModal(d._id)}>
                    <i className="lnr-paperclip"> </i>
                </Button> */}
                <Button outline className="btn-shadow btn-dashed" color="secondary" onClick={(e) => this.showEditContractorModal(d._id)}>
                    <i className="lnr-pencil"> </i>
                </Button>
                <Button outline className="btn-shadow btn-dashed" color="secondary" onClick={(e) => this.showDeleteConfirmModal(d._id)}>
                    <i className="lnr-trash"> </i>
                </Button>
                </div>
            
        }
    ]
        return (
            <Fragment>
                <Row className="h-100 no-gutters">
                    <Col md="12">
                        <Card className="main-card mb-3">
                            <CardHeader className = "text-right">
                                <i className="lnr-user"> </i>
                                Contractors Management
                                <div className="btn-actions-pane-right">
                                    <Row>
                                        <Button outline className="btn-shadow" color="secondary" onClick={(e) => this.showAddContractorModal()} style={{marginRight: 10}}>
                                            <i className="pe-7s-add-user"> </i>
                                        </Button>
                                        <Button outline className="btn-shadow" color="secondary" onClick={(e) => this.export2Text()} style={{marginRight: 10}}>
                                            <i className="pe-7s-diskette"> </i>
                                        </Button>
                                        {/* <input type="file" onChange={this.loadText} /> */}
                                        <FileInput setData={this.loadText} api='/admin/loaduserfromtext'/>
                                    </Row>

                                </div>
                            </CardHeader>
                            <CardBody>
                                <ReactTable
                                    data={contractorlist}
                                    columns={columns}
                                    defaultPageSize={10}
                                    className="-striped -highlight"
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                
                <Modal isOpen={inviteModal} toggle={this.inviteToggle} className="modal-lg">
                    <ModalHeader toggle={this.inviteToggle}>{selectedContractor.username}</ModalHeader>
                    <ModalBody>
                        <Form>
                        {/* <iframe src={this.state.loadURL} style={{"width":"750px", "height":"600px"}} frameBorder="1"></iframe> */}
                        {/* <Document
                            //file="/pattern_doc/task_pattern.pdf"
                            file={this.state.loadURL}
                            onLoadSuccess={this.onDocumentLoadSuccess}
                        >
                            <Page pageNumber={this.state.pageNumber} width={600} 
                            customTextRenderer={this.makeTextRenderer(this.state.searchText)}/>
                        </Document> */}
                        
                        <FormGroup>
                            <Input type="text" name="email" id="email" style={{"display":"none"}} value={this.state.selectedContractor.email}/>
                        </FormGroup>
                        <FormGroup>
                            <Input type="text" name="phone" id="phone" style={{"display":"none"}} value={this.state.selectedContractor.phone}/>
                        </FormGroup>
                        <FormGroup>
                            <Label >UserName</Label>
                            <Input type="text" name="username" id="username" value={this.state.selectedContractor.username} readOnly/>
                            
                        </FormGroup>
                        <FormGroup>
                            <Label >Password</Label>
                            <Input type="text" name="password" id="password" value={this.state.selectedContractor.password} readOnly/>
                        </FormGroup>
                        <div id="webviewer"></div>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button  outline className="btn-shadow btn-dashed" color="secondary" onClick={this.inviteToggle}>Cancel</Button>
                        <Button type="submit" color="secondary" onClick={this.sendInvite.bind(this)}>Send</Button>{' '}
                    </ModalFooter>
                </Modal>
                <Modal isOpen={addModal} toggle={this.addToggle}>
                    <ModalHeader>Add Contractor</ModalHeader>
                    <ModalBody>
                        <FormGroup className="mb-2 mr-sm-2 ">
                            <Label className="mr-sm-2">First Name: </Label>
                            <Input name="firstname" placeholder="Input..."  onChange={this.onHandleChange}/>
                            {submitted && !contractor.firstname &&
                                <div className="help-block">firstname is required</div>
                                }
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 ">
                            <Label className="mr-sm-2">Last Name: </Label>
                            <Input name="lastname" placeholder="Input..."  onChange={this.onHandleChange}/>
                            {submitted && !contractor.lastname &&
                                <div className="help-block">lastname is required</div>
                                }
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 ">
                            <Label className="mr-sm-2">User Name: </Label>
                            <Input name="username" placeholder="Input..."  onChange={this.onHandleChange}/>
                            {submitted && !contractor.username &&
                                <div className="help-block">username is required</div>
                                }
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 ">
                            <Label className="mr-sm-2">Email: </Label>
                            <Input name="email" placeholder="Input..."  onChange={this.onHandleChange}/>
                            {submitted && !contractor.email &&
                                <div className="help-block">email is required</div>
                                }
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 ">
                            <Label className="mr-sm-2">Phone: </Label>
                            <Input name="phone" placeholder="Input..."  onChange={this.onHandleChange}/>
                            {submitted && !contractor.phone &&
                                <div className="help-block">PhoneNumber is required</div>
                            }
                            {
                                this.state.misPhone && <div className="help-block">please input (+) countrycode</div>
                            }
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 ">
                            <Label className="mr-sm-2">Password: </Label>
                            <Input name="password" value={this.state.generatePassword} onChange={this.onHandleChange}/>
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 ">
                            <Label className="mr-sm-2">JobSite: </Label>
                            <Input name="jobsite" placeholder="Input..."  onChange={this.onHandleChange}/>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button  outline className="btn-shadow btn-dashed" color="secondary" onClick={this.addToggle}>Cancel</Button>
                        <Button color="secondary" onClick={this.addContractor}>Save</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={editModal} toggle={this.editToggle}>
                    <ModalHeader>Update Contractor</ModalHeader>
                    <ModalBody>
                        <FormGroup className="mb-2 mr-sm-2 ">
                            <Label className="mr-sm-2">First Name: </Label>
                            <Input name="firstname" placeholder="Input..." value={selectedContractor?selectedContractor.firstname:''} onChange={this.onUpdateHandleChange}/>
                            {submitted && !selectedContractor.firstname &&
                                <div className="help-block">First Name is required</div>
                            }
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 ">
                            <Label className="mr-sm-2">Last Name: </Label>
                            <Input name="lastname" placeholder="Input..." value={selectedContractor?selectedContractor.lastname:''} onChange={this.onUpdateHandleChange}/>
                            {submitted && !selectedContractor.lastname &&
                                <div className="help-block">Last Name is required</div>
                            }
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 ">
                            <Label className="mr-sm-2">User Name: </Label>
                            <Input name="username" placeholder="Input..." value={selectedContractor?selectedContractor.username:''} onChange={this.onUpdateHandleChange}/>
                            {submitted && !selectedContractor.username &&
                                <div className="help-block">>User Name is required</div>
                            }
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 ">
                            <Label className="mr-sm-2">Email: </Label>
                            <Input name="email" placeholder="Input..." value={selectedContractor?selectedContractor.email:''} onChange={this.onUpdateHandleChange}/>
                            {submitted && !selectedContractor.email &&
                                <div className="help-block">Email is required</div>
                            }
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 ">
                            <Label className="mr-sm-2">Phone: </Label>
                            <Input name="phone" placeholder="Input..." value={selectedContractor?selectedContractor.phone:''} onChange={this.onUpdateHandleChange}/>
                            {submitted && !selectedContractor.phone &&
                                <div className="help-block">PhoneNumber is required</div>
                            }
                            {
                                this.state.misPhone && <div className="help-block">please input +</div>
                            }
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 ">
                            <Label className="mr-sm-2">Password: </Label>
                            <Input name="password" placeholder="Input..." value={selectedContractor?selectedContractor.password:''} onChange={this.onUpdateHandleChange}/>
                        </FormGroup>
                       
                        <FormGroup className="mb-2 mr-sm-2 ">
                            <Label className="mr-sm-2">JobSite: </Label>
                            <Input name="jobsite" placeholder="Input..." value={selectedContractor?selectedContractor.jobsite:''} onChange={this.onUpdateHandleChange}/>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button  outline className="btn-shadow btn-dashed" color="secondary" onClick={this.editToggle}>Cancel</Button>
                        <Button color="secondary" onClick={this.editContractor}>Update</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={deleteModal} toggle={this.deleteToggle}>
                    <ModalHeader>Delete Confirm</ModalHeader>
                    <ModalBody>Do you want to delete this contractor?</ModalBody>
                    <ModalFooter>
                        <Button  outline className="btn-shadow btn-dashed" color="secondary" onClick={this.deleteToggle}>Cancel</Button>
                        <Button color="secondary" onClick={this.deleteContractor}>Confirm</Button>
                    </ModalFooter>
                </Modal>
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { loggedIn } = state.authentication;
    return {
        loggedIn
    };
}

const connectedContractorPage = connect(mapStateToProps)(ContractorPage);
export { connectedContractorPage as ContractorPage }; 