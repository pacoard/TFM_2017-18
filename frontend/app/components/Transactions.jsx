import React from 'react'
import { connect } from 'react-redux'
import {REST_SERVER, DEVICE_OWNER_NAMESPACE} from "../constants/constants"
import Modal, {closeStyle} from 'simple-react-modal'

class AddDeviceForm extends React.Component {
    render() {
        return (
            <div className="col-md-8">
                <div className="card">
                    <div className="header">
                        <h4 className="title">Edit Profile</h4>
                    </div>
                    <div className="content">
                        <form>
                            <div className="row">
                                <div className="col-md-5">
                                    <div className="form-group">
                                        <label>Company (disabled)</label>
                                        <input type="text" className="form-control" disabled placeholder="Company" value="Creative Code Inc."/>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input type="text" className="form-control" placeholder="Username" value="michael23"/>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label for="exampleInputEmail1">Email address</label>
                                        <input type="email" className="form-control" placeholder="Email"/>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input type="text" className="form-control" placeholder="Company" value="Mike"/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input type="text" className="form-control" placeholder="Last Name" value="Andrew"/>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label>Address</label>
                                        <input type="text" className="form-control" placeholder="Home Address" value="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"/>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>City</label>
                                        <input type="text" className="form-control" placeholder="City" value="Mike"/>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>Country</label>
                                        <input type="text" className="form-control" placeholder="Country" value="Andrew"/>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>Postal Code</label>
                                        <input type="number" className="form-control" placeholder="ZIP Code"/>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label>About Me</label>
                                        <textarea rows="5" className="form-control" placeholder="Here can be your description" value="Mike">Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo.</textarea>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-info btn-fill pull-right">Update Profile</button>
                            <div className="clearfix"></div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

// Modal window for approval or denial of delete action
export class DeleteDeviceModal extends React.Component {
    constructor(props){
        super(props)
        this.state = {show: this.props.show}
    }

    close(){
        this.setState({show: false});
    }

    delete() {
        // Submit transaction
        let url = REST_SERVER + '/Delete' + this.props.deviceType;
        /*+ '?deviceOwner=' + encodeURIComponent(DEVICE_OWNER_NAMESPACE + this.props.userEmail)
        + '?device=' + encodeURIComponent(this.props.deviceId);*/
        console.log('Fetching URL: '+url);

        let txData = {
            deviceOwner: DEVICE_OWNER_NAMESPACE + this.props.userEmail,
            device: this.props.deviceId
        };

        let headers = new Headers({
            "Content-Type": "application/json",
            "Accept": "application/json"
        });

        fetch(url, {method: 'POST', headers: headers, body: JSON.stringify(txData)})
            .then(result => {
                if (!result.ok) {
                    console.log('Notification: there was an error in your request');
                } else {
                    console.log('Notification: device deleted');
                }
            })
        this.setState({show: false});
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.startTime !== this.state.startTime) {
            this.setState({ startTime: nextProps.startTime });
        }
        this.setState({show: nextProps.show})
    }

    render(){
        return (
            <Modal containerClassName="card"
                   closeOnOuterClick={true}
                   show={this.state.show}
                   onClose={this.close.bind(this)}>
                <div className="header">
                    <h3 className="title">WARNING</h3>
                    <h5 className="category">Are you sure you want to delete the device with ID "{this.props.deviceId}" ?</h5>
                </div>
                <div className="content">
                    <button id="closeModalButton" type="button" className="btn btn-default btn-fill pull-right" onClick={this.close.bind(this)}>Cancel</button>
                    <button id="deleteModalButton"type="button" className="btn btn-danger btn-fill pull-right" onClick={this.delete.bind(this)}>Delete</button>
                    <br/><br/>
                </div>
                <a style={closeStyle} onClick={this.close.bind(this)}>X</a>
            </Modal>
        )
    }
}

export class EditActuatorModalForm extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            show: this.props.show,
            stateValue: this.props.actuator.state,
            enabled: this.props.actuator.enabled
        };

        this.handleStateValueChange = this.handleStateValueChange.bind(this);
        this.handleEnableChange = this.handleEnableChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleStateValueChange(event) {
        this.setState({stateValue: event.target.value});
    }
    handleEnableChange(event) {
        this.setState({enabled: !this.state.enabled});
    }

    handleSubmit(event) {
        // Submit transaction
        let url = REST_SERVER + '/ActuatorWrite';
        console.log('Fetching URL: '+url);

        let txData = {
            deviceOwner: DEVICE_OWNER_NAMESPACE + this.props.userEmail,
            actuator: this.props.deviceId,
            newState: this.state.stateValue,
            enabled: this.state.enabled
        };

        let headers = new Headers({
            "Content-Type": "application/json",
            "Accept": "application/json"
        });
        fetch(url, {method: 'POST', headers: headers, body: JSON.stringify(txData)})
            .then(result => {
                if (!result.ok) {
                    console.log('Notification: there was an error in your request');
                } else {
                    console.log('Notification: actuator updated');
                }
            })
        this.setState({show: false});
        console.log('submit:');
        console.log(this.state);
    }

    close() {
        this.setState({show: false});
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.startTime !== this.state.startTime) {
            this.setState({ startTime: nextProps.startTime });
        }
        this.setState({
            show: nextProps.show,
            stateValue: nextProps.actuator.state,
            enabled: nextProps.actuator.enabled
        })
    }

    render(){

        return (
            <Modal containerClassName="card"
                   closeOnOuterClick={true}
                   show={this.state.show}
                   onClose={this.close.bind(this)}>
                <div className="header">
                    <h3 className="title">SET ACTUATOR STATE</h3>
                    <h5 className="category">Set a new state for the device with ID "{this.props.deviceId}"</h5>
                </div>
                <div className="content">
                    <form>
                        <div className="row">
                            <div className="col-md-7">
                                <div className="form-group">
                                    <label htmlFor="state">State</label>
                                    <input type="text" className="form-control" placeholder="Company"
                                           value={this.state.stateValue}
                                           onChange={this.handleStateValueChange}/>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <div className="form-check">
                                    <label className="form-check-label">Enabled</label>
                                    <br/>
                                    <input className="form-check-input" type="checkbox"
                                           defaultChecked={this.state.enabled}
                                           onChange={this.handleEnableChange}/>
                                </div>
                            </div>
                        </div>
                    </form>
                    <button id="closeModalButton" type="button" className="btn btn-default btn-fill pull-right" onClick={this.close.bind(this)}>Cancel</button>
                    <button id="deleteModalButton"type="button" className="btn btn-info btn-fill pull-right" onClick={this.handleSubmit}>Submit</button>
                    <br/><br/>
                </div>
                <a style={closeStyle} onClick={this.close.bind(this)}>X</a>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => ({
    userEmail: state.userEmail
});

export default connect(mapStateToProps)(AddDeviceForm);
