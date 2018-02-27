import React from 'react'
import { connect } from 'react-redux'
import {REST_SERVER_API, DEVICE_OWNER_NAMESPACE} from "../constants/constants"
import { DeleteDeviceModal } from './Transactions'

// Graphs

const ReactHighstock = require('react-highcharts/ReactHighstock.src');

class Sensors extends React.Component {
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
		this.deviceClick = this.deviceClick.bind(this);
		this.editClick = this.editClick.bind(this);
		this.deleteClick = this.deleteClick.bind(this);
	}

	editClick(e, t_actuator) {
		console.log('editClick');
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

	deviceClick(e, t_deviceId) {
        e.preventDefault();
    	this.setState({
            selectedDevice: t_deviceId
        })
	}

	componentDidMount() {
		// Fetch sensors from hyperledger REST API

		// http://192.168.0.8:3000/api/queries/selectSensorsByOwner?deviceOwner=resource:iot.biznet.DeviceOwner#pacoard@gmail.com
		let url = REST_SERVER_API + '/queries/selectSensorsByOwner?deviceOwner=' + encodeURIComponent(DEVICE_OWNER_NAMESPACE + this.props.userEmail);
		// http://192.168.0.8:3000/api/queries/selectSensorsByOwner?deviceOwner=resource%3Aiot.biznet.DeviceOwner%23pacoard%40gmail.com
		console.log('Fetching URL: '+url);
		fetch(url)
		.then(result => {
			return result.json();
		}).then(data => {
			let sensorRows = data.map((sensor,i) => {
				var eventThreshold = "N/A";
				if (sensor.eventThreshold) eventThreshold = sensor.eventThreshold + " " + sensor.unit;
				var nReadings = 0;
				if (sensor.data) nReadings = sensor.data.length;
				return(
					<tr key={sensor.deviceId}>
						<td><a href="#" onClick={(e) => this.deviceClick(e, sensor.deviceId)}>{sensor.deviceId}</a></td>
                    	<td style={{"textAlign": "center"}}>{sensor.unit}</td>
                    	<td style={{"textAlign": "center"}}>{nReadings}</td>
                    	<td style={{"textAlign": "center"}}>{eventThreshold}</td>
						<td style={{"textAlign": "center"}}>
							<a className="btn btn-simple btn-danger btn-icon remove"
								onClick={(e) => this.deleteClick(e, sensor.deviceId)}>
								<i className="fa fa-times"></i>
							</a>
						</td>

                    </tr>
				)
			});
			this.setState({
				tableRows: sensorRows,
				//selectedDevice: this.state.selectedDevice,
			});
		});
	}
	render() {
        let graph = <a></a>;
        if (this.state.selectedDevice) {
            graph = <SensorGraph deviceId={this.state.selectedDevice} />;
        }
        		let modal;
		if (this.state.modalWindow.show) {
			switch (this.state.modalWindow.type) {
				case 'edit':
					modal = <DeleteDeviceModal
								userEmail={this.props.userEmail}
								show={true}

								deviceId={this.state.modalWindow.deviceId} />;
					break;
				case 'delete':
					modal = <DeleteDeviceModal
								userEmail={this.props.userEmail}
								show={true}
								deviceType='Sensor'
								deviceId={this.state.modalWindow.deviceId} />;
					break;
				default: break;
			}
		}
		return (
			<div className="col-md-12">
				{modal}
				{graph}
				<div className="row">
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
										<th style={{"textAlign": "center"}}>Unit</th>
										<th style={{"textAlign": "center"}}>Readings</th>
										<th style={{"textAlign": "center"}}>Alarm Threshold</th>
										<th style={{"textAlign": "center"}}>Delete</th>
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

class SensorGraph extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			unit: "",
			dataPoints: [],
		};
	}

	// Scroll up when renderization
	componentDidUpdate() {
		//ReactDOM.findDOMNode(this).scrollIntoView();
		window.scrollTo(0, 0);
	}

	fetchData(t_deviceId) {
	    // Fetch sensors from hyperledger REST API

		// http://192.168.0.8:3000/api/queries/selectSensorsByOwner?deviceOwner=resource:iot.biznet.DeviceOwner#pacoard@gmail.com
		let url = REST_SERVER_API + '/queries/selectSensorById?deviceId=' + encodeURIComponent(t_deviceId);
		// http://192.168.0.8:3000/api/queries/selectSensorsByOwner?deviceOwner=resource%3Aiot.biznet.DeviceOwner%23pacoard%40gmail.com
		console.log('Sensor Graph Fetching URL: '+url);
		fetch(url)
		.then(result => {
			return result.json();
		}).then(data => {
			// The result will always be an array with one entry
			var sensor = data[0];
			let dataPoints = [];
			sensor.data.forEach((p) => {
				var d = new Date(p.timestamp);
				dataPoints.push([d.getTime(), p.value]);
				/*dataPoints.dates.push(new Date(p.timestamp));
				dataPoints.values.push(p.value);*/
			})
			this.setState({
				unit: sensor.unit,
				dataPoints: dataPoints
			});
		});
    }

	componentDidMount() {
        this.fetchData(this.props.deviceId);
	}

	componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.startTime !== this.state.startTime) {
            this.setState({ startTime: nextProps.startTime });
        }
        this.fetchData(nextProps.deviceId);
    }

	render() {

        let config = {
            chart: { // https://api.highcharts.com/highcharts/chart
                zoomType: 'x'
            },
            rangeSelector: {
                selected: 1
            },

            title: {
                text: '"'+this.props.deviceId+'" readings'
            },
            series: [
                {
                    name: this.props.deviceId,
                    data: this.state.dataPoints,
                    tooltip: {
                      valueDecimals: 2
                    }
                },
            ],

        };

		return (
			<div className="row">
				<div className="card">
					<div className="header">
						<h4 className="title">Device "{this.props.deviceId}" readings</h4>
						<p className="category">All data stored in the distributed ledger</p>
					</div>
					<div className="content">
						<ReactHighstock config={config}  ref="chart" isPureConfig />
						<div className="footer">
							<div className="chart-legend">
								<i className="fa fa-circle text-info"></i> {this.state.unit}
								<i className="fa fa-circle text-warning"></i> BMW 5 Series
							</div>
							<hr/>
							<div className="stats">
								<i className="ti-check"></i> Data information certified
							</div>
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

export default connect(mapStateToProps)(Sensors);
