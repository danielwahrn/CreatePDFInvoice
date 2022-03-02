import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import {Col, Row, Button,
    Card, CardBody,CardHeader,
    Modal, ModalHeader, ModalFooter, ModalBody,
    FormGroup,Input,  Form, Label,
    } from 'reactstrap';
import DatePicker from 'react-datepicker'
import ReactTable from "react-table";
import Select from 'react-select';

import moment from 'moment'

// import { SignContainer, PdfContainer, SignButton } from './styles';
import Api from '../../Api';
// import makeAnimated from 'react-select/lib/animated';

export default class TaskPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadURL: '',
            signing: false,
            signed: false,
            pdf: null,
            dropdownOpen: false,
            selectedTask:null,
            selectedWork: null,
            selectedStartTime: new Date(),
            selectedEndTime: new Date(),
            selectedLunchTime: new Date(),
            user: null,
            taskList: [],
            workList: [],
            currentTask: {
                _id: -1,
                title: '',
                description: '',
                start: moment(new Date).format('HH: mm'),
                end: moment(new Date).format('HH: mm'),
                hour: '0 mins',
            },
            lunchTime: {
                lunch: moment(new Date).format('HH: mm'),
                lunchhour: ''
            },
            editModal: false,
            deleteModal: false,
            sendModal: false
        };

        
        this.tasktemp = []
        this.sigPad = {};

        this.toggle = this.toggle.bind(this);        
        this.editToggle = this.editToggle.bind(this)
        this.deleteToggle = this.deleteToggle.bind(this)
        this.sendToggle = this.sendToggle.bind(this)
        this.onHandleChange = this.onHandleChange.bind(this);
        this.onHandleLunchChange = this.onHandleLunchChange.bind(this);
        this.onHandleWorkChange = this.onHandleWorkChange.bind(this);

    }

    componentWillMount() {
        this.setState({user: Api.getCurrentUser()})
    }

    componentDidMount() {
        const {user} = this.state
        const option = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }

        Api.apiFetch('/contractor/loadtask', option)
        .then(data => {
            this.setState({taskList: data.result})
            data = data.result
            for(let i = 0 ; i < data.length; i ++) {
                this.tasktemp.push({
                    value: data[i]._id,
                    label: data[i].title
                })
            }
        })
        .catch(error => {
            console.log(error);
        });

        const option1 = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({...user})
        }

        Api.apiFetch('/contractor/loadworkaday', option1)
        .then(data => {
            this.setState({workList: data.result})
            
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

    handleChange(selectedTask){
        this.setState({selectedTask})
        const temp = this.state.taskList.filter(task => task._id ===selectedTask.value)
        this.setState({currentTask: temp[0]})
    }

    onHandleChange(e){
        const {name, value} = e.target;

        const {currentTask} = this.state
    
        this.setState({
            currentTask: {
                ...currentTask,
                [name]: value
            }
        })
        
    }

    onHandleStartTimeChange(time) {
        const {currentTask, selectedEndTime} = this.state

        this.setState({selectedStartTime: time})

        let hour = ''
        var hrs = Math.floor(moment(selectedEndTime).diff(moment(time), 'minutes') / 60);
        if(hrs > 0)
            hour =hrs + 'hr ' + moment(selectedEndTime).diff(moment(time), 'minutes') % 60 + 'mins';
        else hour = moment(selectedEndTime).diff(moment(time), 'minutes') % 60 + 'mins';

        this.setState({
            currentTask: {
                ...currentTask,
                ['start']: moment(time).format('HH:mm'),
                ['hour']: hour
            }
        })
    }

    onHandleEndTimeChange(time) {
        const {currentTask, selectedStartTime} = this.state

        

        this.setState({selectedEndTime: time});
        
        let hour = ''
        var hrs = Math.floor(moment(time).diff(moment(selectedStartTime), 'minutes') / 60);
        if(hrs > 0)
            hour =hrs + 'hr ' + moment(time).diff(moment(selectedStartTime), 'minutes') % 60 + 'mins';
        else hour = moment(time).diff(moment(selectedStartTime), 'minutes') % 60 + 'mins';

        this.setState({
            currentTask: {
                ...currentTask,
                ['end']: moment(time).format('HH:mm'),
                ['hour']: hour
            }
        })
    }
    
    onHandleWorkChange(e){
        const {name, value} = e.target;
        const {selectedWork} = this.state
        this.setState({
            selectedWork: {
                ...selectedWork,
                [name]: value
            }
        })
        
    }

    onHandleLunchTimeChange(time) {
        const {lunchTime} = this.state

        this.setState({
            lunchTime: {
                ...lunchTime,
                ['lunch']: moment(time).format('HH:mm')
            }
        })

        this.setState({selectedLunchTime: time})
    }

    onHandleLunchChange(e){
        const {name, value} = e.target;
        const {lunchTime} = this.state
        this.setState({
            lunchTime: {
                ...lunchTime,
                [name]: value
            }
        })
    }

    
    saveTask() {
        const {currentTask, user} = this.state;
        
        // var userid = user._id
        if(currentTask.hour !== undefined && currentTask.start !== undefined && currentTask.end !== undefined && currentTask._id !== -1){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({task:{...currentTask}, user: {...user} })
            };
            
        Api.apiFetch('/contractor/savetask', requestOptions)
            .then(data => {
                this.setState({workList: data.result})
            })
            .catch(error => {
                console.log(error);
            });
        }
        else {
            alert("Please fill up all inputs")
        }
    }

    saveLunch() {
        const {lunchTime, user} = this.state;
        console.log('lunch', lunchTime.lunch)
        if(lunchTime.lunchhour !== undefined && lunchTime.lunch !== undefined){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({...lunchTime, ...user })
            };
            Api.apiFetch('/contractor/savelunch', requestOptions)
            .then(data => {
                this.setState({workList: data.result})
            })
            .catch(error => {
                console.log(error);
            });
        }
        else alert('Please fill up')
    }

   

    loadPDF() {
        const {workList, user} = this.state

        this.sendToggle();
        if(workList !== []){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({user})
            };
           
            /* Api.apiFetchStream('/contractor/loaddoc', requestOptions)
            .then(response => {
                //Create a Blob from the PDF Stream
                console.log(response);    
                const file = new Blob([response], {
                    type: "application/pdf"
                });
                //Build a URL from the file
                const loadURL = URL.createObjectURL(file);
                //Open the URL on new Window
                console.log(loadURL);
                this.setState({loadURL});
                
                this.blob2arraybuffer(file)
    
            })
            .catch(error => {
                console.log(error);
            }); */
            Api.apiFetch('/contractor/loaddoc', requestOptions)
            .then(response => {
                console.log(response)
                
                if(response.status)
                    alert("Send successful");
                else alert("Sent already. You can't send again");
                
            })
        }
        else {
            alert("No data")
        }
    }

    async blob2arraybuffer(file) {
        var load = await file.arrayBuffer();
        this.setState({pdf: load})
    }

    makeblob = function (dataURL) {
        var BASE64_MARKER = ';base64,';
        var parts;
        var contentType;
        var raw;
        if (dataURL.indexOf(BASE64_MARKER) === -1) {
            parts = dataURL.split(',');
            contentType = parts[0].split(':')[1];
            raw = decodeURIComponent(parts[1]);
            return new Blob([raw], { type: contentType });
        }
        parts = dataURL.split(BASE64_MARKER);
        contentType = parts[0].split(':')[1];
        raw = window.atob(parts[1]);
        var rawLength = raw.length;

        var uInt8Array = new Uint8Array(rawLength);

        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], { type: contentType });
    }

    loadAllWork() {
        const {user} = this.state
        var userid = user._id
        const option = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({userid})
        }

        Api.apiFetch('/contractor/loadworkall', option)
        .then(data => {
            this.setState({workList: data.result})
            
        })
        .catch(error => {
            console.log(error);
        });
    }

    showEditContractorModal(id) {
        const temp = this.state.workList.filter(work => work._id === id)
        this.setState({selectedWork: temp[0]})
        this.setState({editModal: true})
    }
    
    showDeleteConfirmModal(id) {
        const temp = this.state.workList.filter(work => work._id === id)
        this.setState({selectedWork: temp[0]})
        this.setState({deleteModal: true})
    }

    showSendConfirmModal(id) {
        this.setState({sendModal: true})
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

    sendToggle() {
        this.setState({
            sendModal: !this.state.sendModal
        });
    }

    editWork =() => {
        const {selectedWork} = this.state;

        const option = {
            method: "POST",
            headers: {
                "content-type":"application/json"
            },
            body: JSON.stringify({...selectedWork})
        }

        Api.apiFetch("/contractor/editwork", option)
        .then(data => {
            if (data.status) {
                this.setState({workList: data.result})
                this.editToggle()
            }
        })
        .catch(error =>{})
    }
    deleteWork =() => {
        const {selectedWork} = this.state;

        const option = {
            method: "POST",
            headers: {
                "content-type":"application/json"
            },
            body: JSON.stringify({...selectedWork})
        }

        Api.apiFetch("/contractor/deletework", option)
        .then(data => {
            if (data.status) {
                this.setState({workList: data.result})
                this.deleteToggle()
            }
        })
        .catch(error =>{})
    }

    render() {
       const {selectedTask, currentTask, loadURL, workList, editModal, deleteModal, sendModal, selectedWork} = this.state;
       const columns = [
        {
            Header: 'TaskCode',
            accessor: 'taskcode'
        }, 
        {
            Header: 'Title',
            accessor: 'tasktitle'
        }, 
        {
            Header: 'Start',
            accessor: 'starttime'
        },
        {
            Header: 'End',
            accessor: 'endtime'
        },
        {
            Header: 'Lunch',
            accessor: 'lunchtime'
        },
        {
            Header: 'Hour',
            accessor: 'hour'
        },
        {
            Header: 'Notes',
            accessor: 'notes'
        },
        {
            Header: 'Actions',
            id: 'actions',
            accessor: d =>
                <div>
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
                <Row className="h-100 no-gutters" style={{"paddingLeft": "20px", paddingRight: 20}}>
                    <Col md="4">
                        <Card>
                            <CardHeader>Task Management</CardHeader>
                            <CardBody>
                                <FormGroup>
                                    <Label >Title: </Label>
                                    <Select
                                        value={selectedTask}
                                        onChange={this.handleChange.bind(this)}
                                        options={this.tasktemp}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label >Description: </Label>
                                    <Input className="mb-2 mr-sm-2 " value={currentTask?currentTask.description:''} readOnly></Input>
                                </FormGroup>
                                <Form>
                                    <FormGroup className="mb-2 mr-sm-2 ">
                                        <Label className="mr-sm-2">Start Time: </Label>
                                        <DatePicker
                                            selected={this.state.selectedStartTime}
                                            onChange={this.onHandleStartTimeChange.bind(this)}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            className="form-control"
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                        />
                                        {/* <Input name="start" placeholder="12:59 am" value={currentTask && currentTask.start ? currentTask.start : ''} onChange={this.onHandleChange}/> */}
                                    </FormGroup>
                                    <FormGroup className="mb-2 mr-sm-2 ">
                                        <Label className="mr-sm-2">End Time: </Label>
                                        <DatePicker
                                            selected = {this.state.selectedEndTime}
                                            onChange={this.onHandleEndTimeChange.bind(this)}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            className="form-control"
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                        />
                                        {/* <InputMask className="form-control" mask="99:99" defaultValue="24:59" /> */}
                                        {/* <Input name="end" placeholder="12:59 am" value={currentTask && currentTask.end ? currentTask.end : ''} onChange={this.onHandleChange}/> */}
                                    </FormGroup>
                                    
                                    <FormGroup className="mb-2 mr-sm-2 ">
                                        <Label className="mr-sm-2">Hour: </Label>
                                        <Input name="hour" value={currentTask && currentTask.hour ? currentTask.hour : ''} className="form-control" readOnly></Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label >Notes: </Label>
                                        <Input name="notes" className="mb-2 mr-sm-2 " value={currentTask && currentTask.notes ? currentTask.notes : ''} onChange={this.onHandleChange}></Input>
                                    </FormGroup>
                                    <Row style={{float: "right"}}>
                                    <Button type="button" color="secondary" className="mr-5" onClick={this.saveTask.bind(this)}>Save</Button>
                                    </Row>
                                </Form>
                        
                            </CardBody>
                        </Card>
                        <Card className="mt-3">
                            <CardHeader>Lunch Time</CardHeader>
                            <CardBody>
                                <Form>
                                    <FormGroup className="mb-2">
                                        <Label className="mr-sm-2">Lunch Time: </Label>
                                        <DatePicker
                                            selected={this.state.selectedLunchTime}
                                            onChange={this.onHandleLunchTimeChange.bind(this)}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            className="form-control"
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                        />
                                    </FormGroup>
                                    <FormGroup className="mb-2 ">
                                        <Label className="mr-sm-2">Hour: </Label>
                                        {/* <Input name="lunchhour" value={currentTask?currentTask.lunchhour:''} onChange={this.onHandleChange}/> */}
                                        <Input mask="9" name="lunchhour" value={currentTask?currentTask.lunchhour:''} className="form-control" onChange={this.onHandleLunchChange}></Input>
                                    </FormGroup>
                                    <Row style={{float: "right"}}>
                                        <Button type="button" color="secondary" className="mr-5" onClick={this.saveLunch.bind(this)}>Save</Button>
                                    </Row>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="8" style={{paddingLeft: "20px"}}>
                        <Card className="mb-5">
                            <CardHeader>
                                Preview Working Today
                                <div className="btn-actions-pane-right">
                                {/* <Button type="button" color="default" onClick={this.loadAllWork.bind(this)}>load</Button> */}
                                <Button outline className="btn-shadow btn-dashed" color="secondary" onClick={this.showSendConfirmModal.bind(this)} style={{marginRight:"15px"}}><i className="lnr-location"> Send</i></Button> 
                                </div>
                            </CardHeader>
                            <CardBody>
                                <ReactTable
                                    data={workList}
                                    columns={columns}
                                    defaultPageSize={10}
                                    className="-striped -highlight"
                                />
                            </CardBody>
                        </Card>
                        <Card className="main-card mb-3" style={{display: 'none'}}>
                            <CardHeader className = "text-right">
                            <i className="lnr-user"> </i>
                                Sign Document
                            <div className="btn-actions-pane-right">
                                {/* <Button outline className="btn-shadow btn-dashed" color="secondary" onClick={this.uploadDoc.bind(this)} style={{marginRight:"15px"}}><i className="lnr-location"> Send</i></Button> */}
                                {/* <Button type="button" color="secondary" onClick={this.loadPDF.bind(this)}>Create PDF</Button> */}
                            </div>
                            </CardHeader>
                            <CardBody className="text-center">
                                {loadURL !== '' ? 
                                    <iframe src={loadURL} frameBorder="1"></iframe>
                                : ''}
                            {/* <SignContainer> */}
                            {/* <div className="text-center">
                                <SignatureCanvas
                                    penColor="black"
                                    ref={ref => {
                                        this.sigPad = ref;
                                    }}
                                    canvasProps={{width: 400, height: 80, className: 'sigCanvas'}}
                                />
                            </div> */}
                                <div style={{marginTop:"50px", textAlign:"center"}}>
                                    {/* <Button outline className="btn-shadow btn-dashed" color="secondary" onClick={ this.clear}><i className="lnr-trash"></i></Button>
                                    <Button outline className="btn-shadow btn-dashed" color="secondary" onClick={this.trim} style={{marginLeft:"15px"}}><i className="lnr-pencil"></i></Button> */}
                                    {/* {this.state.signed && */}
                                    {/* } */}
                                    </div>
                                {/* </SignContainer> */}
                            </CardBody>
                        </Card>
                    
                        
                    </Col>
                </Row>
               <Modal isOpen={editModal} toggle={this.editToggle}>
                    <ModalHeader> Edit Work</ModalHeader>
                    <ModalBody>
                    {selectedWork &&
                        <Form>
                        {selectedWork.starttime && 
                            <FormGroup className="mb-2 mr-sm-2 ">
                                <Label className="mr-sm-2">Start Time: </Label>
                                <Input name="starttime" placeholder="12:59 am" value={selectedWork && selectedWork.starttime ? selectedWork.starttime : ''} onChange={this.onHandleWorkChange}/>
                            </FormGroup>
                        }
                        {selectedWork.endtime && 
                            <FormGroup className="mb-2 mr-sm-2 ">
                                <Label className="mr-sm-2">End Time: </Label>
                                <Input name="endtime" placeholder="12:59 am" value={selectedWork && selectedWork.endtime ? selectedWork.endtime : ''} onChange={this.onHandleWorkChange}/>
                            </FormGroup>
                        
                        }
                            {selectedWork.lunchtime && 
                            <FormGroup className="mb-2 mr-sm-2 ">
                                <Label className="mr-sm-2">Lunch Time: </Label>
                                <Input name="lunchtime" placeholder="12:59 am" value={selectedWork && selectedWork.lunchtime ? selectedWork.lunchtime : ''} onChange={this.onHandleWorkChange}/>
                            </FormGroup>
                            }
                            {selectedWork.hour && 
                            <FormGroup className="mb-2 mr-sm-2 ">
                                <Label className="mr-sm-2">Hour: </Label>
                                <Input name="hour" value={selectedWork && selectedWork.hour ? selectedWork.hour : ''} className="form-control" onChange={this.onHandleWorkChange}></Input>
                            </FormGroup>
    }
                            {selectedWork.notes && 
                            <FormGroup>
                                <Label >Notes: </Label>
                                <Input name="notes" className="mb-2 mr-sm-2 " value={selectedWork && selectedWork.notes ? selectedWork.notes : ''} onChange={this.onHandleWorkChange}></Input>
                            </FormGroup>
                            }
                            <Row style={{float: "right"}}>
                            <Button type="button" color="secondary" className="mr-5" onClick={this.editWork.bind(this)}>Save</Button>
                            </Row>
                        </Form>
                    
                    }</ModalBody>
               </Modal>
               <Modal isOpen={deleteModal} toggle={this.deleteToggle}>
                    <ModalHeader>Delete Confirm</ModalHeader>
                    <ModalBody>Do you want to delete this work history?</ModalBody>
                    <ModalFooter>
                        <Button  outline className="btn-shadow btn-dashed" color="secondary" onClick={this.deleteToggle}>Cancel</Button>
                        <Button color="secondary" onClick={this.deleteWork}>Confirm</Button>
                    </ModalFooter>
                </Modal>
               <Modal isOpen={sendModal} toggle={this.sendToggle}>
                    <ModalHeader>Send Confirm</ModalHeader>
                    <ModalBody>You can send only once per day. Are you sure you send this work?</ModalBody>
                    <ModalFooter>
                        <Button  outline className="btn-shadow btn-dashed" color="secondary" onClick={this.sendToggle}>Cancel</Button>
                        <Button color="secondary" onClick={this.loadPDF.bind(this)}>Confirm</Button>
                    </ModalFooter>
                </Modal>
            </Fragment>
        );
    }
}