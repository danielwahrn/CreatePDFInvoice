import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import {Col, Row, Card, CardBody, Button, CustomInput, CardHeader,
        FormGroup, Label, Input,
        Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap';
import ReactTable from "react-table";
import { saveSync } from 'save-file';
// import makeAnimated from 'react-select/lib/animated';
import FileInput from '../../components/FileInput'

import Api from '../../Api';

const data = [
    {
        id: 1,
        title: 'KKK',
        contractor: 'LLL'
        
    },
    {
        id: 2,
        title: 'KKK',
        contractor: 'LLL'
    }
]

class TasksPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            taskModal: false,
            taskList: [],
            selectedTask: [],
            task: {
                code: '',
                title: '',
                description: ''
            },
            deleteModal: false,
            editModal: false,
            newModal: false
        };

        this.taskToggle = this.taskToggle.bind(this)
        this.editToggle = this.editToggle.bind(this)
        this.newToggle = this.newToggle.bind(this)
        this.deleteToggle = this.deleteToggle.bind(this)
        this.onUpdateHandleChange = this.onUpdateHandleChange.bind(this)
    }

    componentDidMount() {
        const option = {
            method: "GET",
            headers: {
                "Content-Type": "application/txt"
            }
        }

        Api.apiFetch('/admin/loadtask', option)
        .then(data => {
            this.setState({taskList: data.result})
        })
        .catch(error => {
            console.log(error);
        });
    }

    showTaskModal(id) {
        console.log(id)
        this.setState({selectedUser: data[id]})
        this.setState({taskModal: true})
    }

    showAddTaskModal(id) {
        this.setState({newModal: true})
    }

    showEditTaskModal(id) {
        const temp = this.state.taskList.filter(task => task._id === id)
        this.setState({selectedTask: temp[0]})
        this.setState({editModal: true})
    }
    
    showDeleteConfirmModal(id) {
        const temp = this.state.taskList.filter(task => task._id === id)
        this.setState({selectedTask: temp[0]})
        this.setState({deleteModal: true})
    }

    loadText = (data) => {
        this.setState({taskList: data})
        // window.location.reload()
        console.log('data', data)
    }

    

    taskToggle() {
        this.setState({
            taskModal: !this.state.taskModal
        });
    }

    deleteToggle() {
        this.setState({
            deleteModal: !this.state.deleteModal
        });
    }

    editToggle() {
        this.setState({
            editModal: !this.state.editModal
        });
    }

    newToggle() {
        this.setState({
            newModal: !this.state.newModal
        });
    }

    deleteTask =() => {
        const {selectedTask} = this.state;

        const option = {
            method: "POST",
            headers: {
                "content-type":"application/json"
            },
            body: JSON.stringify({...selectedTask})
        }

        Api.apiFetch("/admin/deletetask", option)
        .then(data => {
            if (data.status) {
                this.setState({taskList: data.result})
                this.deleteToggle()
            }
            else alert("delete failed")
        })
        .catch(error =>{
            
            alert("delete error", error)
        })
    }

    editTask =() => {
        const {selectedTask} = this.state;

        const option = {
            method: "POST",
            headers: {
                "content-type":"application/json"
            },
            body: JSON.stringify({...selectedTask})
        }

        Api.apiFetch("/admin/edittask", option)
        .then(data => {
            if (data.status) {
                this.setState({taskList: data.result})
                this.editToggle()
            }
            else alert("edit failed")
        })
        .catch(error =>{
            alert("edit error")
        })
    }

    newTask =() => {
        const {selectedTask} = this.state;

        const option = {
            method: "POST",
            headers: {
                "content-type":"application/json"
            },
            body: JSON.stringify({...selectedTask})
        }

        Api.apiFetch("/admin/newtask", option)
        .then(data => {
            if (data.status) {
                this.setState({taskList: data.result})
                this.newToggle()
            }
            else alert("new failed")
        })
        .catch(error =>{
            alert("new error")
        })
    }

    storeTask() {
        this.setState({
            taskModal: !this.state.taskModal
        });
    }

    onUpdateHandleChange(e) {
        const {name, value} = e.target
        const {selectedTask} = this.state
        this.setState({
            selectedTask: {
                ...selectedTask,
                [name]: value
            }
        })
    }

    export2Text() {
        const option = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }

        Api.apiFetch('/admin/export2TextTask', option)
        .then(result => {
            if(result.status)
                saveSync(result.data, 'tasks.txt');
        })
        .catch(error => {
            alert(error)
        })

    }

    render() {
       const {taskList, selectedTask, editModal, deleteModal, newModal} = this.state
       const columns = [
        {
            Header: 'Currect Tasks',
            id: '_id',
            accessor: row => (
                <CustomInput type="checkbox" id="eCheckbox1" value={row._id}
                         label="&nbsp;"/>
            )
        },
        {
            Header: 'ActivityCode',
            accessor: 'code'
        }, 
        {
            Header: 'AcitivityName',
            accessor: 'title'
        }, 
        {
            Header: 'Description',
            accessor: 'description'
        }, 
        
        {
            Header: 'Actions',
            id: 'actions',
            accessor: d =>
                <div>
                <Button outline className="btn-shadow btn-dashed" color="secondary" onClick={(e) => this.showEditTaskModal(d._id)}>
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
                            <i className="lnr-database"> </i> Tasks Management
                                <div className="btn-actions-pane-right">
                                <Button outline className="btn-shadow" color="secondary" onClick={(e) => this.showAddTaskModal()} style={{marginRight: 10}}>
                                    <i className="lnr-file-add"> </i>
                                </Button>
                                <Button outline className="btn-shadow" color="secondary" onClick={(e) => this.export2Text()} style={{marginRight: 10}}>
                                    <i className="pe-7s-diskette"> </i>
                                </Button>
                                {/* <CustomInput 
                                    type="file"
                                    inputProps={{
                                        onChange : this.loadTask,
                                        type: "text",
                                        
                                    }} 
                                /> */}
                                {/* <input type="file" onChange={this.loadText} /> */}
                                <FileInput api='/admin/loadtaskfromtext' setData={this.loadText}/>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <ReactTable
                                    data={taskList}
                                    columns={columns}
                                    defaultPageSize={10}
                                    className="-striped -highlight"
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Modal isOpen={newModal} toggle={this.newToggle}>
                    <ModalHeader>New Task</ModalHeader>
                    <ModalBody>
                        <FormGroup className="mb-2 mr-sm-2 ">
                            <Label className="mr-sm-2">Task Code: </Label>
                            <Input name="code" placeholder="Input..." onChange={this.onUpdateHandleChange}/>
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 ">
                            <Label className="mr-sm-2">Task Name: </Label>
                            <Input name="title" placeholder="Input..."  onChange={this.onUpdateHandleChange}/>
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 ">
                            <Label className="mr-sm-2">Description: </Label>
                            <Input name="description" placeholder="Input..."  onChange={this.onUpdateHandleChange}/>
                        </FormGroup>
                        
                    </ModalBody>
                    <ModalFooter>
                        <Button  outline className="btn-shadow btn-dashed" color="secondary" onClick={this.newToggle}>Cancel</Button>
                        <Button color="secondary" onClick={this.newTask}>Create</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={editModal} toggle={this.editToggle}>
                    <ModalHeader>Update Task</ModalHeader>
                    <ModalBody>
                        <FormGroup className="mb-2 mr-sm-2 ">
                            <Label className="mr-sm-2">Task Name: </Label>
                            <Input name="title" placeholder="Input..." value={selectedTask?selectedTask.title:''} onChange={this.onUpdateHandleChange}/>
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 ">
                            <Label className="mr-sm-2">Description: </Label>
                            <Input name="description" placeholder="Input..." value={selectedTask?selectedTask.description:''} onChange={this.onUpdateHandleChange}/>
                        </FormGroup>
                        
                    </ModalBody>
                    <ModalFooter>
                        <Button  outline className="btn-shadow btn-dashed" color="secondary" onClick={this.editToggle}>Cancel</Button>
                        <Button color="secondary" onClick={this.editTask}>Update</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={deleteModal} toggle={this.deleteToggle}>
                    <ModalHeader>Delete Confirm</ModalHeader>
                    <ModalBody>Do you want to delete current task?</ModalBody>
                    <ModalFooter>
                        <Button  outline className="btn-shadow btn-dashed" color="secondary" onClick={this.deleteToggle}>Cancel</Button>
                        <Button color="secondary" onClick={this.deleteTask}>Confirm</Button>
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

const connectedTasksPage = connect(mapStateToProps)(TasksPage);
export { connectedTasksPage as TasksPage }; 