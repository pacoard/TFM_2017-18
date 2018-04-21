import React from 'react'
import { connect } from 'react-redux'
import {REST_SERVER_API, DEVICE_OWNER_NAMESPACE} from "../constants/constants"
import Modal, {closeStyle} from 'simple-react-modal'

class AddDeviceForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deviceId: '',
            deviceType: 'SENSOR',
            unit: '',
            eventThreshold: '',
            deviceState: '',
            enabled: true,
        }
        this.handleDeviceIdChange = this.handleDeviceIdChange.bind(this);
        this.handleDeviceTypeChange = this.handleDeviceTypeChange.bind(this);
        this.handleUnitChange = this.handleUnitChange.bind(this);
        this.handleEventThresholdChange = this.handleEventThresholdChange.bind(this);
        this.handleDeviceStateChange = this.handleDeviceStateChange.bind(this);
        this.handleEnableChange = this.handleEnableChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleDeviceIdChange(event) {
        this.setState({deviceId: event.target.value});
    }
    handleDeviceTypeChange(event) {
        this.setState({deviceType: event.target.value});
    }
    handleUnitChange(event) {
        this.setState({unit: event.target.value});
    }
    handleEventThresholdChange(event) {
        this.setState({eventThreshold: event.target.value});
    }
    handleDeviceStateChange(event) {
        this.setState({deviceState: event.target.value});
    }
    handleEnableChange(event) {
        let en = (event.target.value == 'yes');
        this.setState({enabled: en});
    }

    handleSubmit(event) {
        event.preventDefault();
        // Submit transaction
        let url = REST_SERVER_API + '/CreateDevice';
        console.log('Fetching URL: '+url);

        let txData = {
            deviceOwner: DEVICE_OWNER_NAMESPACE + this.props.userEmail,
            deviceId: this.state.deviceId,
            deviceType: this.state.deviceType,
            unit: this.state.unit,
            eventThreshold: this.state.eventThreshold,
            state: this.state.deviceState,
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
                console.log('Notification: created device');
            }
        })
        console.log('Submit: ');
        console.log(this.state);
    }

    render() {
        let actuatorDisabled = !(this.state.deviceType == 'ACTUATOR');
        let sensorDisabled = !(this.state.deviceType == 'SENSOR');
        return (
            <div className="col-md-10">
                <div className="card">
                    <div className="header">
                        <h4 className="title">Enter device parameters</h4>
                        <p className="category">Make sure the device ID is right, otherwise it will not work properly.</p>
                    </div>
                    <br/>
                    <div className="content">
                        <form>
                            <div className="row">
                                <div className="col-md-7">
                                    <div className="form-group">
                                        <label>Device ID</label>
                                        <input type="text" className="form-control" placeholder="Device ID"
                                                onChange={this.handleDeviceIdChange}/>
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className="form-group">
                                        <label>Device Type</label>
                                        <select type="text" className="form-control" placeholder="Device Type"
                                                onChange={this.handleDeviceTypeChange}>
                                            <option value="SENSOR">Sensor</option>
                                            <option value="ACTUATOR">Actuator</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Unit</label>
                                        <input type="text" className="form-control" placeholder="Unit"
                                               disabled={sensorDisabled}
                                               onChange={this.handleUnitChange}/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>State</label>
                                        <input type="text" className="form-control" placeholder="State"
                                               disabled={actuatorDisabled}
                                               onChange={this.handleDeviceStateChange}/>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Event Threshold</label>
                                        <input type="number" className="form-control" placeholder="Event Threshold"
                                               disabled={sensorDisabled}
                                               onChange={this.handleEventThresholdChange}/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Enabled</label>
                                        <select type="text" className="form-control" placeholder="Enabled"
                                                disabled={actuatorDisabled}
                                                onChange={this.handleEnableChange}>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-info btn-fill pull-right"
                                    onClick={this.handleSubmit}>Add Device</button>
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
        this.props.callback();
    }

    delete() {
        // Submit transaction
        let t = this.props.deviceType;
        let type = (t.endsWith('s')) ? t.slice(0, -1) : t;
        let url = REST_SERVER_API + '/Delete' + type;

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
        event.preventDefault();
        let url = REST_SERVER_API + '/ActuatorWrite';
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
                                    <input type="text" className="form-control" placeholder="State"
                                           value={this.state.stateValue}
                                           onKeyPress={e => { if (e.key === 'Enter') this.handleSubmit(e);}}
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
