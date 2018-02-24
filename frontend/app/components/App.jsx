import React from 'react'
import { connect } from 'react-redux'

//import { selectSideElement } from '../reducers/actions'
//import { SIDE_ELEMENTS } from '../constants/constants'

import SideBar from './SideBar'
import MainContent from './MainContent'

class App extends React.Component {
	constructor(props) {
		super(props);
		this.currentElement = "Welcome";
		this.props.store.subscribe(()=> {
			this.props.sideElements.forEach((e) => {
				if (e.selected) {
					this.currentElement = e.name;
				}
        	});
			//Update component
			this.forceUpdate();
		});
	}

	render() {

		return ( 
			<div className="wrapper">
			    <SideBar store={this.props.store}/>
			    <div className="main-panel">
			    	<NavBar currentElement={this.currentElement}/>
			        <MainContent store={this.props.store}/>
			        <Footer/>
			    </div>
			</div>
		);
	}

}


class NavBar extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<nav className="navbar navbar-default">
	            <div className="container-fluid">
	                <div className="navbar-header">
	                    <button type="button" className="navbar-toggle">
	                        <span className="sr-only">Toggle navigation</span>
	                        <span className="icon-bar bar1"></span>
	                        <span className="icon-bar bar2"></span>
	                        <span className="icon-bar bar3"></span>
	                    </button>
	                    <a className="navbar-brand" href="#">{this.props.currentElement}</a>
	                </div>
	                <div className="collapse navbar-collapse">
	                    <ul className="nav navbar-nav navbar-right">
	                        <li>
	                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
	                                <i className="ti-panel"></i>
									<p>Stats</p>
	                            </a>
	                        </li>
	                        <li className="dropdown">
	                              <a href="#" className="dropdown-toggle" data-toggle="dropdown">
	                                    <i className="ti-bell"></i>
	                                    <p className="notification">5</p>
										<p>Notifications</p>
										<b className="caret"></b>
	                              </a>
	                              <ul className="dropdown-menu">
	                                <li><a href="#">Notification 1</a></li>
	                                <li><a href="#">Notification 2</a></li>
	                                <li><a href="#">Notification 3</a></li>
	                                <li><a href="#">Notification 4</a></li>
	                                <li><a href="#">Another notification</a></li>
	                              </ul>
	                        </li>
							<li>
	                            <a href="#">
									<i className="ti-settings"></i>
									<p>Settings</p>
	                            </a>
	                        </li>
	                    </ul>

	                </div>
	            </div>
	        </nav>
		);
	}
}

class Footer extends React.Component {
	render() {
		return (
		<footer className="footer">
            <div className="container-fluid">
                <nav className="pull-left">
                    <ul>

                        <li>
                            <a href="#">
                                Home
                            </a>
                        </li>
                    </ul>
                </nav>
				<div className="copyright pull-right">
                    &copy; <script>document.write(new Date().getFullYear())</script>, made with <i className="fa fa-heart heart"></i> by <a href="http://www.creative-tim.com">Creative Tim</a>
                </div>
            </div>
        </footer>
		);
	}
}


// Support React+Redux
function mapStateToProps(state) {
	return {
		sideElements: state.sideElements,
	};
}

export default connect(mapStateToProps)(App);