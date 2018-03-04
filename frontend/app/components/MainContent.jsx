import React from 'react'
import { connect } from 'react-redux'
import { selectSideElement, switchUser} from '../reducers/actions'
import { REST_SERVER } from '../constants/constants'
import Dashboard from './Dashboard'
import Sensors from './Sensors'
import Actuators from './Actuators'
import AddDeviceForm from './Transactions'
import DeleteDevice from './DeleteDevice'

class MainContent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {currentContent: <Dashboard />}
		this.props.store.subscribe(() => {
            this.updateContent();
		});
	}

	updateContent() {
	    // Check which element is selected
		let content = <h1>TO DO</h1>;
		this.props.sideElements.forEach(elem => {
			let selectedElement = '';
			if (elem.selected) {
				selectedElement = elem.name.replace(' ','');
				switch(selectedElement) {
					case 'Dashboard':
						content = <Dashboard />
						break;
					case 'Sensors':
						content = <Sensors />
						break;
					case 'Actuators':
						content = <Actuators />
						break;
                    case 'AddDevice':
                        content = <AddDeviceForm />
						break;
					case 'DeleteDevice':
                        content = <DeleteDevice />
						break;
					default:
						break;
				}
			}
		});
		this.setState({currentContent: content});
    }

	render() {
		return (
			<div className="content">
                <div className="container-fluid">
                        {this.state.currentContent}
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
