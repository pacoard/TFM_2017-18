import React from 'react'
import { connect } from 'react-redux'
import {REST_SERVER} from "../constants/constants";

class Sensors extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			tableRows: [],
		};
	}

	componentDidMount() {
		// Fetch polls from hyperledger REST API

		fetch(REST_SERVER + '/iot.biznet.Sensor')
		.then(result => {
			return result.json();
		}).then(data => {
			let polls = data.map((poll,i) => {
				return(
					<tr key={i}>
                    	<td>{poll.pollId}</td>
                    	<td>{poll.pollOwner.split("#")[1]}</td>
                    	<td>{poll.pollObject.title}</td>
                    	<td>{poll.pollObject.questions.length}</td>
                    </tr>
				)
			});
			this.setState({tableRows: polls});
		})
	}
	render() {
		return (
            <div className="card">
                <div className="header">
                    <h4 className="title">Polls in the blockchain</h4>
                    <p className="category">List of polls that are currently stored in the distributed ledger</p>
                </div>
                <div className="content table-responsive table-full-width">
                    <table className="table table-striped">
                        <thead>
                        	<tr>
	                            <th>ID</th>
	                        	<th>Owner</th>
	                        	<th>Title</th>
	                        	<th>Questions</th>
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
