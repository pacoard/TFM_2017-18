import React from 'react'
import { connect } from 'react-redux'
import {DEVICE_OWNER_NAMESPACE, REST_SERVER, REST_SERVER_API, SIDE_ELEMENTS} from "../constants/constants";
import {selectSideElement} from "../reducers/actions";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sensors: [],
            actuators: [],
        }
    }

    componentDidMount() {
        this.updateContent();
    }

    updateContent() {
        // Fetch devices from hyperledger REST API
		let sensorsURL = REST_SERVER_API + '/queries/selectSensorsByOwner?deviceOwner=' + encodeURIComponent(DEVICE_OWNER_NAMESPACE + this.props.userEmail);
		let actuatorsURL = REST_SERVER_API + '/queries/selectActuatorsByOwner?deviceOwner=' + encodeURIComponent(DEVICE_OWNER_NAMESPACE + this.props.userEmail);
		console.log('Fetching URL: '+sensorsURL);
		console.log('Fetching URL: '+actuatorsURL);

        Promise.all([sensorsURL, actuatorsURL].map(url =>
            fetch(url).then(result => result.json())
        )).then(data => {
            this.setState({
                sensors: data[0],
                actuators: data[1]
            })
        });
	}

	render() {
        // Icons colors: https://www.w3schools.com/bootstrap/bootstrap_typography.asp, Contextual Colors and Backgrounds
        let nSensors = this.state.sensors.length;
        let nReadings = 0;
        this.state.sensors.forEach((sensor, i) => {
            if (sensor.data) nReadings += sensor.data.length;
        });
        let nActuators = this.state.actuators.length;
		return (
		    <div className="row">
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-lg-3 col-sm-6">
                            <div className="card">
                                <div className="content">
                                    <div className="row">
                                        <div className="col-xs-5">
                                            <div className="icon-big icon-warning text-center">
                                                <h3>
                                                    <i className={SIDE_ELEMENTS[1].icon}></i>  {nSensors}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="col-xs-7">
                                            <div className="numbers">
                                                <p>Sensors</p>
                                                Number of sensors
                                            </div>
                                        </div>
                                    </div>
                                    <div className="footer">

                                        <div className="stats">
                                            <i className="ti-reload"></i> Updated now
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6">
                            <div className="card">
                                <div className="content">
                                    <div className="row">
                                        <div className="col-xs-5">
                                                <h3>
                                                    <i className={SIDE_ELEMENTS[2].icon}></i>  {nActuators}
                                                </h3>
                                        </div>
                                        <div className="col-xs-7">
                                            <div className="numbers">
                                                <p>Actuators</p>
                                                Number of actuators
                                            </div>
                                        </div>
                                    </div>
                                    <div className="footer">

                                        <div className="stats">
                                            <i className="ti-reload"></i> Updated now
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6">
                            <div className="card">
                                <div className="content">
                                    <div className="row">
                                        <div className="col-xs-5">
                                            <div className="icon-big icon-danger text-center">
                                                <h3>
                                                    <i className="ti-pulse"></i>  {nReadings}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="col-xs-7">
                                            <div className="numbers">
                                                <p>Readings</p>
                                                Number of readings
                                            </div>
                                        </div>
                                    </div>
                                    <div className="footer">

                                        <div className="stats">
                                            <i className="ti-reload"></i> Updated now
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6">
                            <div className="card">
                                <div className="content">
                                    <div className="row">
                                        <div className="col-xs-5">
                                            <div className="icon-big icon-info text-center">
                                                <h3><i className="ti-bell text-info"></i> {this.props.notification}</h3>
                                            </div>
                                        </div>
                                        <div className="col-xs-7">
                                            <div className="numbers">
                                                <p>Last event</p>
                                                Last event description
                                            </div>
                                        </div>
                                    </div>
                                    <div className="footer">

                                        <div className="stats">
                                            <i className="ti-reload"></i> Updated now
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
		);
	}
}

const mapStateToProps = (state) => ({
	userEmail: state.userEmail,
    notification: state.notification
})
/*
//Same as above, but without arguments: simple object
const mapDispatchToProps = {
	sideElementAction: selectSideElement
}
*/

export default connect(mapStateToProps)(Dashboard);
