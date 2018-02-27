import React from 'react'
import { connect } from 'react-redux'


//import { selectSideElement } from '../reducers/actions'
//import { SIDE_ELEMENTS } from '../constants/constants'

import Notification from './Notification'
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
                <Notification />
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
			<nav className="navbar navbar-default navbar-fixed">
            <div className="container-fluid">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navigation-example-2">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a className="navbar-brand" href="#">{this.props.currentElement}</a>
                </div>
                <div className="collapse navbar-collapse">
                    <ul className="nav navbar-nav navbar-left">
                        <li>
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                <i className="fa fa-dashboard"></i>
								<p className="hidden-lg hidden-md">Dashboard</p>
                            </a>
                        </li>
                        <li className="dropdown">
                              <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                    <i className="fa fa-globe"></i>
                                    <b className="caret hidden-lg hidden-md"></b>
									<p className="hidden-lg hidden-md">
										5 Notifications
										<b className="caret"></b>
									</p>
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
                           <a href="">
                                <i className="fa fa-search"></i>
								<p className="hidden-lg hidden-md">Search</p>
                            </a>
                        </li>
                    </ul>

                    <ul className="nav navbar-nav navbar-right">
                        <li>
                           <a href="">
                               <p>Account</p>
                            </a>
                        </li>
                        <li className="dropdown">
                              <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                    <p>
										Dropdown
										<b className="caret"></b>
									</p>

                              </a>
                              <ul className="dropdown-menu">
                                <li><a href="#">Action</a></li>
                                <li><a href="#">Another action</a></li>
                                <li><a href="#">Something</a></li>
                                <li><a href="#">Another action</a></li>
                                <li><a href="#">Something</a></li>
                                <li className="divider"></li>
                                <li><a href="#">Separated link</a></li>
                              </ul>
                        </li>
                        <li>
                            <a href="#">
                                <p>Log out</p>
                            </a>
                        </li>
						<li className="separator hidden-lg"></li>
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