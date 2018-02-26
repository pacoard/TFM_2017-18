import React from 'react'
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import {REST_SERVER, DEVICE_OWNER_NAMESPACE} from "../constants/constants"
import {DEFAULT_USER} from "../constants/constants"

// Graphs
//import { ChartistGraph } from 'react-chartist'
/*import {
    Charts,
    ChartContainer,
    ChartRow,
    YAxis,
    LineChart,
	Resizable
} from "react-timeseries-charts";
import { TimeSeries } from "pondjs";*/
const ReactHighstock = require('react-highcharts/ReactHighstock.src');

class Sensors extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			tableRows: [],
			selectedDeviceId: undefined,
		};
		this.deviceClick = this.deviceClick.bind(this);
	}
	deviceClick(e, t_deviceId) {
    	console.log("Device click");
    	e.preventDefault();
		this.setState({selectedDeviceId: t_deviceId});
		console.log(t_deviceId);
		this.forceUpdate();
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
						<td><a href="#" onClick={(e) => this.deviceClick(e, sensor.deviceId)}>{sensor.deviceId}</a></td>
                    	<td style={{"textAlign": "center"}}>{sensor.unit}</td>
                    	<td style={{"textAlign": "center"}}>{sensor.data.length}</td>
                    	<td style={{"textAlign": "center"}}>{eventThreshold}</td>
						<td style={{"textAlign": "center"}}>
							<a class="btn btn-simple btn-danger btn-icon remove"><i class="fa fa-times"></i></a>
						</td>

                    </tr>
				)
			}); // <td style={{"textAlign": "center"}}><i className="ti-close"></i></td>
			this.setState({
				tableRows: sensorRows,
				sensorGraph: this.state.sensorGraph,
			});
		})
	}
	render() {
    	let graph = <a></a>;
		if (this.state.selectedDeviceId) {
			console.log(this.state.selectedDeviceId);
			graph = <SensorGraph deviceId={this.state.selectedDeviceId}/>;
			console.log(graph);
		}
		return (
			<div className="col-md-12">
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

	componentDidMount() {
		// Fetch sensors from hyperledger REST API

		// http://192.168.0.8:3000/api/queries/selectSensorsByOwner?deviceOwner=resource:iot.biznet.DeviceOwner#pacoard@gmail.com
		let url = REST_SERVER + '/queries/selectSensorById?deviceId=' + encodeURIComponent(this.props.deviceId);
		// http://192.168.0.8:3000/api/queries/selectSensorsByOwner?deviceOwner=resource%3Aiot.biznet.DeviceOwner%23pacoard%40gmail.com
		console.log('Sensor Graph Fetching URL: '+url);
		fetch(url)
		.then(result => {
			return result.json();
		}).then(data => {
			// The result will always be an array with one entry
			var sensor = data[0];
			console.log(sensor);
			let dataPoints = this.state.dataPoints;
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

	render() {

        let config = {
            rangeSelector: {
                selected: 1
            },
            title: {
                text: '"'+this.props.deviceId+'" readings'
            },
            series: [{
                name: 'this.props.deviceId',
                data: this.state.dataPoints,
                tooltip: {
                  valueDecimals: 2
                }
            }]
        };

		return (
			<div className="row">
				<div className="card">
					<div className="header">
						<h4 className="title">Device "{this.props.deviceId}" readings</h4>
						<p className="category">All data stored in the distributed ledger</p>
					</div>
					<div className="content">
						<ReactHighstock config={config}/>
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
