import React from 'react'
import { connect } from 'react-redux'
import {REST_SERVER, DEVICE_OWNER_NAMESPACE} from "../constants/constants"
import Modal, {closeStyle} from 'simple-react-modal'

export class AddDeviceForm extends React.Component {

}

// Modal window for approval or denial of delete action
export  class DeleteDeviceModal extends React.Component {
    constructor(props){
        super(props)
        this.state = {show: this.props.show}
    }

    close(){
        this.setState({show: false});
    }

    delete() {
    	console.log('Delete '+this.props.deviceId);
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
                        <h5 className="category">Are you sure you want to delete the device with ID "{this.props.deviceId}"</h5>
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

export  class EditActuatorModalForm extends React.Component {

}
