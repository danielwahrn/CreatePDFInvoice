import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import {Col, Row, Card, CardBody, Button, Input, CardHeader, Modal, ModalHeader, ModalFooter, ModalBody, FormGroup} from 'reactstrap';
import ReactTable from "react-table";
import SignatureCanvas from 'react-signature-canvas';
import { PDFDocument } from 'pdf-lib';
import { saveSync } from 'save-file';
import API from '../../Api'

class DocketsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedDocket: [],
            docketList: [],
            loadURL: '',
            viewModal: false,
            approveModal: false,
            rejectModal: false,
            sendModal: false,
            deleteModal: false,
            pdf: null,
            signed1: false,
            signed2: false,
            manageremail: ''
        };
        this.sigPad = {};
        this.sigPad1 = {};

        this.viewToggle = this.viewToggle.bind(this)
        this.approveToggle = this.approveToggle.bind(this)
        this.rejectToggle = this.rejectToggle.bind(this)
        this.sendToggle = this.sendToggle.bind(this)
        this.deleteToggle = this.deleteToggle.bind(this)
        this.doApprove = this.doApprove.bind(this)
        this.doReject = this.doReject.bind(this)
        this.doSend = this.doSend.bind(this)
        this.doDelete = this.doDelete.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.export2Text = this.export2Text.bind(this)
        this.trim = this.trim.bind(this)
    }

    componentDidMount() {
        const option = {
            method: "GET",
            headers: {
                "Content-Type": "application/txt"
            }
        }

        API.apiFetch('/admin/loaddocket', option)
        .then(data => {
            this.setState({docketList: data.result})
        })
        .catch(error => {
            console.log(error);
        });

        
    }

    showRespondModal(id) {
        const {docketList} = this.state

        const temp = docketList.filter(docket => docket._id === id)
        this.setState({selectedDocket: temp[0]})

        this.setState({sendModal: true})

    }
    
    showApproveConfirmModal(id) {
        const {docketList} = this.state

        const temp = docketList.filter(docket => docket._id === id)
        this.setState({selectedDocket: temp[0]})
        this.setState({approveModal: true})
    }
    
    showRejectConfirmModal(id) {
        const {docketList} = this.state

        const temp = docketList.filter(docket => docket._id === id)
        this.setState({selectedDocket: temp[0]})
        this.setState({rejectModal: true})
    }

    showDeleteConfirmModal(id) {
        const {docketList} = this.state

        const temp = docketList.filter(docket => docket._id === id)
        this.setState({selectedDocket: temp[0]})
        this.setState({deleteModal: true})
    }

    showDocketViewModal(id, path) {
        const {docketList} = this.state

        const temp = docketList.filter(docket => docket._id === id)
        this.setState({selectedDocket: temp[0]})

        const option = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({url: path})
        }

        API.apiFetchStream('/admin/viewdocket', option)
        .then(result => {
            console.log(result)
            if(result.status !== undefined) {
                alert(result.message)
            }
            else {

                const file = new Blob([result], {
                    type: "application/pdf"
                });
    
                const loadURL = URL.createObjectURL(file);
                this.setState({loadURL});
    
                this.blob2arraybuffer(file)
            }
            
        })
        .catch(error => {
            alert(error)
        })

        this.setState({viewModal: true})
    
    }

    viewToggle() {
        this.setState({
            viewModal: !this.state.viewModal
        });
    }
    approveToggle() {
        this.setState({
            approveModal: !this.state.approveModal
        });
    }

    rejectToggle() {
        this.setState({
            rejectModal: !this.state.rejectModal
        });
    }

    sendToggle() {
        this.setState({
            sendModal: !this.state.sendModal
        });
    }

    deleteToggle() {
        this.setState({
            deleteModal: !this.state.deleteModal
        });
    }

    doApprove() {
        const {selectedDocket} = this.state
        const _id = selectedDocket._id
        const status = "approve"
        const option = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({_id, status})
        }

        API.apiFetch('/admin/respondresult', option)
        .then(data => {
            this.setState({docketList: data.result})
            this.approveToggle()
        })
        .catch(error => {
            console.log(error);
        });
    }

    doReject() {
        const {selectedDocket} = this.state
        const _id = selectedDocket._id
        const status = "reject"
        const option = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({_id, status})
        }

        API.apiFetch('/admin/respondresult', option)
        .then(data => {
            this.setState({docketList: data.result})
            this.rejectToggle()
        })
        .catch(error => {
            console.log(error);
        });
    }

    doSend() {
        const { selectedDocket} = this.state
        const {status, email} = selectedDocket
        var id = selectedDocket._id
        const option = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id, email, status})
        }

        API.apiFetch('/admin/sendresult', option)
        .then(data => {
            console.log(data)
            this.sendToggle()
            alert("sent successful")
        })
        .catch(error => {
            console.log(error);
        });
    }

    doDelete() {

        const {selectedDocket} = this.state

        const _id = selectedDocket._id
        const option = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({_id})
        }

        API.apiFetch('/admin/deletedocket', option)
        .then(data => {
            this.setState({docketList: data.result})
            this.deleteToggle()
        })
        .catch(error => {
            console.log(error);
        });
    }

    async blob2arraybuffer(file) {
        var load = await file.arrayBuffer();
        this.setState({pdf: load})
    }

    clear = () => {
        this.sigPad.clear();
    };

    clear1 = () => {
        this.sigPad1.clear();
    };

    trim = async (index) => {
        const { pdf } = this.state;

        this.setState({ signing: true });
    // try{
        const trimmedDataURL = this.sigPad
          .getTrimmedCanvas()
          .toDataURL('image/png');

        const trimmedDataURL1 = this.sigPad1
          .getTrimmedCanvas()
          .toDataURL('image/png');

        if (pdf) {
            const pdfDoc = await PDFDocument.load(pdf);
            const pngImage = await pdfDoc.embedPng(trimmedDataURL);
            const pngDims = pngImage.scale(0.8);
            if(index === 1) this.setState({signed1: true})
        
            const pages = pdfDoc.getPages();
        
            pages.forEach(page => {
                page.drawImage(pngImage, {
                    x: 170,
                    y: 230,
                    width: pngDims.width,
                    height: pngDims.height,
                });
            });

            const pngImage1 = await pdfDoc.embedPng(trimmedDataURL1);
            const pngDims1 = pngImage1.scale(0.8);
            if(index === 2) this.setState({signed2: true})
            pages.forEach(page => {
                page.drawImage(pngImage1, {
                    x: 470,
                    y: 230,
                    width: pngDims1.width,
                    height: pngDims1.height,
                });
            });
    
            const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true });
            // const pdfBytes = await pdfDoc.save();
           // console.log('pdfbytes', pdfBytes)

            this.setState({ loadURL: pdfBytes, signing: false});
        } else {
            this.setState({ signing: false });
        }
    // }
    // catch(error){
    //     alert('No find data')
    // }
    };

    removeBase64Mark(data) {
        var BASE64_MARKER = ';base64,';
        var parts;
        if (data.indexOf(BASE64_MARKER) === -1) {
            parts = data.split(',');
            return parts[1]
        }

        parts = data.split(BASE64_MARKER);
        return parts[1]
    }

    async uploadDoc() {
        const { selectedDocket, loadURL, manageremail} = this.state;
        const {_id, status} = selectedDocket;

        // if (!pdf){
        //     alert("No PDF")
        //     return;
        // }

        // const pdfDoc = await PDFDocument.load(pdf);
        // const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true });
        
        // var data = this.removeBase64Mark(pdfBytes)
        const email = manageremail

        var data = this.removeBase64Mark(loadURL)
        var requestOptions;
        if(status === 'Waiting') {

            requestOptions = {
                method: 'POST',
                headers: {
                     'Content-Type': 'application/json',
                    },
                body: JSON.stringify({data, docketid: _id, email})
            };
        }
        else {
                requestOptions = {
                    method: 'POST',
                    headers: {
                            'Content-Type': 'application/json',
                        },
                    body: JSON.stringify({email, docketid: _id})
                };
        }

        API.apiFetch('/admin/uploaddoc', requestOptions)
        .then(data => {
            this.setState({docketList: data.result})
            this.viewToggle();
        })
        .catch(error => {
            console.log(error);
        });
    }

    handleChange(e) {
        const {name, value} = e.target;
        const {selectedDocket} = this.state

        this.setState({
            selectedDocket: {
                ...selectedDocket,
                [name]: value 
            }
        })
    }

    handleManagerEmailChange(e){
        const {value} = e.target;

        this.setState({manageremail: value})
    }

    export2Text() {
        const option = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }

        API.apiFetch('/admin/export2text', option)
        .then(result => {
            if(result.status)
                alert('Successful')
        })
        .catch(error => {
            alert(error)
        })

    }

    saveAsFile(id) {
        const option = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id})
        }

        API.apiFetch('/admin/export2TextHistory?id='+id, option)
        .then(result => {
            if(result.status)
                saveSync(result['data'], result['docket_name'] +'.txt');
        })
        .catch(error => {
            alert(error)
        })
       
    }

    render() {
       const {docketList, loadURL, selectedDocket} = this.state
       console.log('sigpad', this.sigPad)
       const columns = [
                                                
        {
            Header: 'Contractor',
            accessor: 'contractorname'
        }, 
        {
            Header: 'Date',
            accessor: 'date',
        },
        {
            Header: 'Notes',
            accessor: 'notes'
        },
        {
            Header: 'Status',
            accessor: 'status'
        },
        {
            Header: 'Actions',
            id: 'path',
            accessor: row => (
                <div style={{display: "flex", justifyContent:"center"}}>
                <Button outline className="btn-shadow btn-dashed" color="secondary" onClick={(e) => this.showDocketViewModal(row._id, row.path)} style={{marginRight: 10}}>
                {row.status === 'Signed'? <i className="lnr-eye" /> : <i className="lnr-pencil" />}
                </Button>
                <Button outline className="btn-shadow btn-dashed" color="secondary" onClick={(e) => this.saveAsFile(row._id)}>
                    <i className="pe-7s-diskette"  />
                </Button>
                <Button outline className="btn-shadow btn-dashed" color="secondary" onClick={(e) => this.showDeleteConfirmModal(row._id)}>
                    <i className="lnr-trash"  />
                </Button>
                </div>
            )
        },
        // {
        //     Header: 'Submit',
        //     id: '_id',
        //     accessor: d =>
        //         <div>
        //         <Button outline className="btn-shadow btn-dashed" color="secondary" onClick={(e) => this.showApproveConfirmModal(d._id)}>
        //             <i className="lnr-thumbs-up"> </i>
        //         </Button>
        //         <Button outline className="btn-shadow btn-dashed" color="secondary" onClick={(e) => this.showRejectConfirmModal(d._id)}>
        //             <i className="lnr-thumbs-down"> </i>
        //         </Button>
        // },
        
        // {
        //     Header: 'Status',
        //     accessor: 'status'
        // }   
        // },
        // {
        //     Header: 'Email',
        //     id: 'email',
        //     accessor: row => (
        //         <div>
        //         <Button outline className="btn-shadow btn-dashed" color="secondary" onClick={(e) => this.showRespondModal(row._id)}>
        //             Respond <i className="lnr-location"> </i>
        //         </Button>
        //         <i className="lnr-trash" onClick={(e) => this.showDeleteConfirmModal(row._id)} />
        //         </div>
        //     )
        // },
    ]
        return (
            <Fragment>
                <Row className="h-100 no-gutters">
                    <Col md="12">
                        <Card className="main-card mb-3">
                            <CardHeader className = "text-right">
                            <i className="lnr-book"> </i>  Dockets Management
                                {/* <div className="btn-actions-pane-right">
                                    <Button outline className="btn-shadow" color="secondary" onClick={(e) => this.export2Text()}>
                                    <i className="pe-7s-diskette"> </i>
                                    </Button>
                                </div>                       */}
                            </CardHeader>
                            <CardBody>
                                <ReactTable
                                    data={docketList}
                                    columns={columns}
                                    defaultPageSize={10}
                                    className="-striped -highlight"
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Modal isOpen={this.state.viewModal} toggle={this.viewToggle} style={{maxWidth:"800px", height:"auto"}} >
                    <ModalHeader toggle={this.viewToggle}>{selectedDocket?selectedDocket.contractor:''}</ModalHeader>
                    <ModalBody>
                        {loadURL !== '' ? 
                                    <iframe src={loadURL} style={{width:"750px", height:"600px" , margin:"auto"}} frameBorder="1" title="iframe"></iframe>
                                : ''}
                        { selectedDocket.status === 'Waiting'?
                        <div>
                        <div className="text-center">
                            <SignatureCanvas
                                penColor="black"
                                ref={ref => {
                                    this.sigPad = ref;
                                }}
                                onEnd={() => this.trim(1)}
                                canvasProps={{width: 200, height: 80, className: 'sigCanvas'}}
                            />
                            <SignatureCanvas
                                penColor="black"
                                ref={ref => {
                                    this.sigPad1 = ref;
                                }}
                                onEnd={() => this.trim(2)}
                                canvasProps={{width: 200, height: 80, className: 'sigCanvas'}}
                            />
                        </div>
                        {/* <div style={{marginTop:"50px", textAlign:"center"}}>
                            <Button outline className="btn-shadow btn-dashed" color="secondary" onClick={ this.clear}><i className="lnr-trash"></i></Button>
                            <Button outline className="btn-shadow btn-dashed" color="secondary" onClick={this.trim} style={{margin:"0px 15px"}}><i className="lnr-pencil"></i></Button>
                            <Button outline className="btn-shadow btn-dashed" color="secondary" onClick={ this.clear1}><i className="lnr-trash"></i></Button>
                        </div> */}
                        </div>:''
                        }
                    { selectedDocket.status === 'Waiting' &&
                        <FormGroup>
                            <Input type="input" name="email"
                                placeholder="Email here..."
                                value={this.state.manageremail} onChange={this.handleManagerEmailChange.bind(this)}
                                style={{marginTop: 10}}
                            />
                        </FormGroup>
                    }
                    </ModalBody>
                    <ModalFooter>
                        {selectedDocket.status === 'Waiting' && 
                            <Button color="secondary"  onClick={this.uploadDoc.bind(this)}
                                disabled={this.state.manageremail === '' || !this.state.signed1 || !this.state.signed2}
                            >Save</Button>
                        }
                        {/* <Button color="secondary"  onClick={this.doReject}>Reject</Button>
                        <Button color="secondary" dashed onClick={this.doApprove}>Approve</Button> */}
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.approveModal} toggle={this.approveToggle}  >
                    <ModalHeader toggle={this.approveToggle}>Confirm Approve</ModalHeader>
                    <ModalBody>
                        Would you like to approve current docket?
                    </ModalBody>
                    <ModalFooter>
                        <Button outline className="btn-shadow btn-dashed" color="secondary" onClick={this.approveToggle}>Cancel</Button>
                        <Button color="secondary" onClick={this.doApprove}>Approve</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.rejectModal} toggle={this.rejectToggle}  >
                    <ModalHeader toggle={this.rejectToggle}>Confirm Reject</ModalHeader>
                    <ModalBody>
                        Would you like to reject current docket?
                    </ModalBody>
                    <ModalFooter>
                        <Button  outline className="btn-shadow btn-dashed" color="secondary" onClick={this.rejectToggle}>Cancel</Button>
                        <Button color="secondary" onClick={this.doReject}>Reject</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.sendModal} toggle={this.sendToggle}  >
                    <ModalHeader toggle={this.sendToggle}>Confirm Send Result</ModalHeader>
                    <ModalBody>
                        Would you like to send current docket result?
                    </ModalBody>
                    <ModalFooter>
                        <Button  outline className="btn-shadow btn-dashed" color="secondary" onClick={this.sendToggle}>Cancel</Button>
                        <Button color="secondary" onClick={this.doSend}>Send</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.deleteModal} toggle={this.deleteToggle}  >
                    <ModalHeader toggle={this.rejectToggle}>Delete Docket</ModalHeader>
                    <ModalBody>
                        Would you like to delete current docket?
                    </ModalBody>
                    <ModalFooter>
                        <Button  outline className="btn-shadow btn-dashed" color="secondary" onClick={this.deleteToggle}>Cancel</Button>
                        <Button color="secondary" onClick={this.doDelete}>Delete</Button>
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

const connectedDocketsPage = connect(mapStateToProps)(DocketsPage);
export { connectedDocketsPage as DocketsPage }; 