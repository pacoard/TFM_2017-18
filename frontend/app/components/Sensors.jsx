import React from 'react'
import { connect } from 'react-redux'
import {REST_SERVER, DEVICE_OWNER_NAMESPACE} from "../constants/constants";

import {DEFAULT_USER} from "../constants/constants";

class Sensors extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			tableRows: [],
		};
	}

	componentDidMount() {
		// Fetch sensors from hyperledger REST API

		// http://192.168.0.8:3000/api/queries/selectSensorsByOwner?deviceOwner=resource:iot.biznet.DeviceOwner#pacoard@gmail.com
		let url = REST_SERVER + '/queries/selectSensorsByOwner?deviceOwner=' + encodeURIComponent(DEVICE_OWNER_NAMESPACE +  DEFAULT_USER);
		// http://192.168.0.8:3000/api/queries/selectSensorsByOwner?deviceOwner=resource%3Aiot.biznet.DeviceOwner%23pacoard%40gmail.com
		console.log('Fetching URL: '+url);
		fetch(url)
		.then(result => {
			return result.json();
		}).then(data => {
			console.log(data);
			let sensorRows = data.map((sensor,i) => {
				var eventThreshold = "N/A";
				if (sensor.eventThreshold) eventThreshold = sensor.eventThreshold + " " + sensor.unit;
				return(
					<tr key={sensor.deviceId}>
                    	<td>{sensor.deviceId}</td>
                    	<td style={{"textAlign": "center"}}>{sensor.unit}</td>
                    	<td style={{"textAlign": "center"}}>{sensor.data.length}</td>
                    	<td style={{"textAlign": "center"}}>{eventThreshold}</td>
						<td style={{"textAlign": "center"}}><i className="ti-close"></i></td>
                    </tr>
				)
			});
			this.setState({tableRows: sensorRows});
		})
	}
	render() {
		return (
            <div className="card">
                <div className="header">
                    <h4 className="title">Registered sensors in the blockchain</h4>
                    <p className="category">List of sensors that are currently stored in the distributed ledger</p>
                </div>
                <div className="content table-responsive table-full-width">
                    <table className="table table-striped">
                        <thead>
                        	<tr>
	                            <th>Device ID</th>
	                        	<th>Unit</th>
	                        	<th>Readings</th>
								<th>Alarm Threshold</th>
	                        	<th>Delete</th>
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
/*
//Same as above, but without arguments: simple object
const mapDispatchToProps = {
	sideElementAction: selectSideElement
}
*/

export default connect(mapStateToProps)(Sensors);
