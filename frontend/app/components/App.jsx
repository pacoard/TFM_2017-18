import React from 'react'
import { connect } from 'react-redux'


//import { selectSideElement } from '../reducers/actions'
import { SIDE_ELEMENTS } from '../constants/constants'

import Notification from './Notification'
import SideBar from './SideBar'
import MainContent from './MainContent'

class App extends React.Component {
	constructor(props) {
		super(props);
		this.currentElement = SIDE_ELEMENTS[0];
		this.props.store.subscribe(()=> {
			this.props.sideElements.forEach((e) => {
				if (e.selected) {
					this.currentElement = e;
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
			    	<NavBar currentElement={this.currentElement} userEmail={this.props.userEmail}/>
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
                    <a className="navbar-brand" href="#"> <i className={this.props.currentElement.icon}></i>   {this.props.currentElement.name}</a>
                </div>
                <div className="collapse navbar-collapse">

                    <ul className="nav navbar-nav navbar-right">
                        <li className="dropdown">
                              <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                    <p>
                                        {this.props.userEmail}
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
                            <a href="https://github.com/pacoard/TFM_2017-18">
                                <p><i className="fa fa-github"></i> Github</p>
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
	    let date = new Date().getFullYear();
		return (
		<footer className="footer">
            <div className="container-fluid">
                <nav className="pull-left">
                    <ul>

                        <li>
                            <a href="#">
                                d-IoT - Decentralised Internet of Things
                            </a>
                        </li>
                    </ul>
                </nav>
				<div className="copyright pull-right">
                    &copy; {date}, made by <a href="http://www.github.com/pacoard">Paco</a>
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
        userEmail: state.userEmail
	};
}

export default connect(mapStateToProps)(App);