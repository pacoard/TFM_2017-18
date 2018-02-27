import React from 'react'
import { connect } from 'react-redux'
import {REST_SERVER, DEVICE_OWNER_NAMESPACE} from "../constants/constants";
import { DeleteDeviceModal, EditActuatorModalForm } from './Transactions'

class Actuators extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tableRows: [],
			modalWindow: {
				type: '',
				deviceId: '',
				show: false
			}
		};
		this.editClick = this.editClick.bind(this);
		this.deleteClick = this.deleteClick.bind(this);
	}

	editClick(e, t_actuator, t_id) {
		console.log('editClick' + t_id);
		this.setState({
			modalWindow: {
				type: 'edit',
				deviceId: t_id,
				actuator: t_actuator,
				show: true
			}
		})
	}

	deleteClick(e, t_id) {
		console.log('deleteClick' + t_id);
		this.setState({
			modalWindow: {
				type: 'delete',
				deviceId: t_id,
				show: true
			}
		})
	}

	componentDidMount() {
		// Fetch actuators from hyperledger REST API

		// http://192.168.0.8:3000/api/queries/selectActuatorsByOwner?deviceOwner=resource:iot.biznet.DeviceOwner#pacoard@gmail.com
		let url = REST_SERVER + '/queries/selectActuatorsByOwner?deviceOwner=' + encodeURIComponent(DEVICE_OWNER_NAMESPACE + this.props.userEmail);
		// http://192.168.0.8:3000/api/queries/selectActuatorsByOwner?deviceOwner=resource%3Aiot.biznet.DeviceOwner%23pacoard%40gmail.com
		console.log('Fetching URL: '+url);
		fetch(url)
		.then(result => {
			return result.json();
		}).then(data => {
			console.log(data);
			let actuatorRows = data.map((actuator,i) => {
				var enabled = (actuator.enabled) ? "Yes" : "No";
				return(
					<tr key={actuator.deviceId}>
						<td>{actuator.deviceId}</td>
						<td style={{"textAlign": "center"}}>{actuator.state}</td>
						<td style={{"textAlign": "center"}}>{enabled}</td>
						<td style={{"textAlign": "center"}}>
							<a className="btn btn-simple btn-info"
								onClick={(e) => this.editClick(e, actuator, actuator.deviceId)}>
								<i className="fa fa-edit"></i>
							</a>
							<a className="btn btn-simple btn-danger btn-icon remove"
								onClick={(e) => this.deleteClick(e, actuator.deviceId)}>
								<i className="fa fa-times"></i>
							</a>
						</td>
					</tr>
				)
			}); // <td style={{"textAlign": "center"}}><i className="ti-close"></i></td>
			this.setState({tableRows: actuatorRows});
		})
	}
	render() {
		let modal;
		if (this.state.modalWindow.show) {
			switch (this.state.modalWindow.type) {
				case 'edit':
					modal = <EditActuatorModalForm
								userEmail={this.props.userEmail}
								show={true}
								deviceId={this.state.modalWindow.deviceId}
								actuator={this.state.modalWindow.actuator}/>;
					break;
				case 'delete':
					modal = <DeleteDeviceModal
								userEmail={this.props.userEmail}
								show={true}
								deviceType='Actuator'
								deviceId={this.state.modalWindow.deviceId} />;
					break;
				default: break;
			}
		}
		return (
			<div className="col-md-12">
				{modal}
				<div className="row">
					<div className="card">
						<div className="header">
							<h4 className="title">Registered actuators in the blockchain</h4>
							<p className="category">List of actuators that are currently stored in the distributed ledger</p>
						</div>
						<div className="content table-responsive table-full-width">
							<table className="table table-striped">
								<thead>
									<tr>
										<th>Device ID</th>
										<th style={{"textAlign": "center"}}>State</th>
										<th style={{"textAlign": "center"}}>Enabled</th>
										<th style={{"textAlign": "center"}}>Actions</th>
									</tr>
								</thead>
								<tbody>
									{this.state.tableRows}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	userEmail: state.userEmail
})
/*
//Same as above, but without arguments: simple object
const mapDispatchToProps = {
	sideElementAction: selectSideElement
}
*/

export default connect(mapStateToProps)(Actuators);
