import React from 'react'
import { connect } from 'react-redux'
import { selectSideElement, switchUser} from '../reducers/actions'
import { REST_SERVER } from '../constants/constants'
import Dashboard from './Dashboard'
import Sensors from './Sensors'
import Actuators from './Actuators'

class MainContent extends React.Component {
	constructor(props) {
		super(props);
		this.props.store.subscribe(() => {
			this.forceUpdate();
		});
	}

	render() {
		// Check which element is selected 
		let currentContent = <h1>dafsdfa</h1>;
		this.props.sideElements.forEach(elem => {
			let selectedElement = '';
			if (elem.selected) {
				selectedElement = elem.name.replace(' ','');
				switch(selectedElement) {
					case 'Dashboard':
						currentContent = <Dashboard />
						break;
					case 'Sensors':
						currentContent = <Sensors />
						break;
					case 'Actuators':
						currentContent = <Actuators />
						break;
					default:
						break;
				}
			}
		});

		return (
			<div className="content">
                <div className="container-fluid">
                        {currentContent}
                </div>
            </div>
		);
	}
}

class AddDevice extends React.Component  {
	constructor(props) {
		super(props);
		this.state = {formValues: null};
	}

	render() {
		return (
            <div className="card">    
                <div className="header">
                    <h4 className="title">New Poll</h4>
                </div>
                <div className="content">
                    <form>
                        <div className="row">
                            <div className="col-md-5">
                                <div className="form-group">
                                    <label>Company</label>
                                    <input type="text" className="form-control border-input" disabled placeholder="Company" value="Creative Code Inc."/>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label>Username</label>
                                    <input type="text" className="form-control border-input" placeholder="Username" value="michael23"/>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label for="exampleInputEmail1">Email address</label>
                                    <input type="email" className="form-control border-input" placeholder="Email"/>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input type="text" className="form-control border-input" placeholder="Company" value="Chet"/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input type="text" className="form-control border-input" placeholder="Last Name" value="Faker"/>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label>Address</label>
                                    <input type="text" className="form-control border-input" placeholder="Home Address" value="Melbourne, Australia"/>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>City</label>
                                    <input type="text" className="form-control border-input" placeholder="City" value="Melbourne"/>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>Country</label>
                                    <input type="text" className="form-control border-input" placeholder="Country" value="Australia"/>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>Postal Code</label>
                                    <input type="number" className="form-control border-input" placeholder="ZIP Code"/>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label>About Me</label>
                                    <textarea rows="5" className="form-control border-input" placeholder="Here can be your description" value="Mike">Oh so, your weak rhyme
You doubt I'll bother, reading into it
I'll probably won't, left to my own devices
But that's the difference in our opinions.</textarea>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn btn-info btn-fill btn-wd">Update Profile</button>
                        </div>
                        <div className="clearfix"></div>
                    </form>
                </div>
            </div>
		);
	}
}


//Arrow function (avoid typing return statement)
const mapStateToProps = (state) => ({
	sideElements: state.sideElements
})

//Same as above, but without arguments: simple object
const mapDispatchToProps = {
	sideElementAction: selectSideElement,
    switchUserAction: switchUser,
}


export default connect(mapStateToProps, mapDispatchToProps)(MainContent);
