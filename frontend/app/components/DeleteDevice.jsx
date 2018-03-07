import React from 'react'
import { connect } from 'react-redux'
import {REST_SERVER_API, DEVICE_OWNER_NAMESPACE} from "../constants/constants"
import { DeleteDeviceModal } from './Transactions'


class DeleteDevice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
			tableRows: [],
            selectedDevice: '',
			modalWindow: {
				type: '',
				deviceId: '',
				show: false
			}
		};
		this.deleteClick = this.deleteClick.bind(this);
		this.modalCallback = this.modalCallback.bind(this);
    }

    deleteClick(e, t_id, t_type) {
        this.setState({
			modalWindow: {
				deviceType: t_type,
				deviceId: t_id,
				show: true
			}
		})
    }

    modalCallback() {
    	this.setState({
			modalWindow: {
				deviceType: '',
				deviceId: '',
				show: false
			}
		});
	}

    render() {
        let modal;
		if (this.state.modalWindow.show) {
            modal = <DeleteDeviceModal
                        userEmail={this.props.userEmail}
                        show={true}
                        deviceType={this.state.modalWindow.deviceType}
                        deviceId={this.state.modalWindow.deviceId}
                        callback={this.modalCallback}/>;
		}

        return(
            <div className="row">
                {modal}
                <div className="col-md-6">
                    <DeviceTable type="Sensors" deleteClick={this.deleteClick} userEmail={this.props.userEmail}/>
                </div>
                <div className="col-md-6">
                    <DeviceTable type="Actuators" deleteClick={this.deleteClick} userEmail={this.props.userEmail}/>
                </div>
            </div>
        );
    }
}

class DeviceTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableRows: [],
        }
    }

    componentDidMount() {
        this.updateContent();
    }

    updateContent() {
        // Fetch devices from hyperledger REST API
		// http://192.168.0.8:3000/api/queries/selectSensorsByOwner?deviceOwner=resource:diot.biznet.DeviceOwner#pacoard@gmail.com
		let url = REST_SERVER_API + '/queries/select'+this.props.type+'ByOwner?deviceOwner=' + encodeURIComponent(DEVICE_OWNER_NAMESPACE + this.props.userEmail);
		// http://192.168.0.8:3000/api/queries/selectSensorsByOwner?deviceOwner=resource%3Adiot.biznet.DeviceOwner%23pacoard%40gmail.com
		console.log('Fetching URL: '+url);
		fetch(url)
		.then(result => {
			return result.json();
		}).then(data => {
			let devicesRows = data.map((device,i) => {
				return(
					<tr key={device.deviceId}>
						<td>{device.deviceId}</td>
						<td style={{"textAlign": "center"}}>
							<a className="btn btn-simple btn-danger btn-icon remove"
								onClick={(e) => this.props.deleteClick(e, device.deviceId, this.props.type)}>
								<i className="fa fa-times"></i>
							</a>
						</td>
                    </tr>
				)
			});
			this.setState({
				tableRows: devicesRows,
			});
		});
	}

    render() {
        return(
            <div className="card">
                <div className="header">
                    <h4 className="title">{this.props.type}</h4>
                    <p className="category">List of {this.props.type.toLowerCase()} that are currently stored in the distributed ledger</p>
                </div>
                <div className="content table-responsive table-full-width">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Device ID</th>
                                <th style={{"textAlign": "center"}}>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.tableRows}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
	userEmail: state.userEmail
})

export default connect(mapStateToProps)(DeleteDevice);
