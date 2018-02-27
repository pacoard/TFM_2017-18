import React from 'react'
import { connect } from 'react-redux'
import { selectSideElement } from '../reducers/actions'

class SideBar extends React.Component {
	constructor(props) {
		super(props);
		this.sideBarClick = this.sideBarClick.bind(this);
	}
	sideBarClick(sideElement) {
		//this.props.appSideClick(sideElement);
		this.props.sideElementAction(sideElement);
		this.forceUpdate();
	}
	render() {
		return ( //<!-- className="active" -->
			<div className="sidebar" data-color="black" data-image="assets/img/sidebar-5.jpg">
		    	<div className="sidebar-wrapper">
		            <div className="logo">
		                <a href="#" className="simple-text">
							<img src="assets/img/reactlogo.png" alt="React Logo" width="42" height="30"/>
							SMART
							<img src="assets/img/hyperledger-logo.png" alt="Hyperledger Logo" width="42" height="42"/>
							HOME
		                </a>
		            </div>
		            <ul className="nav">
					{this.props.sideElements.map((e, i) => 
						<SideElement 
							key={i}
							name={e.name} 
							link={e.link}
							icon={e.icon}
							selected={e.selected}
							elementClick={this.sideBarClick}/>)
						}
		            </ul>

		    	</div>
		    </div>
		);
	}
}

class SideElement extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick() {
		this.props.elementClick(this);
	}
	render() {
		let className = '';
		if (this.props.selected) {
			className = 'active';
		}
		
		return(
			<li className={className}>  
		        <a onClick={this.handleClick}>
		            <i className={this.props.icon}></i>
		            <p>{this.props.name}</p>
		        </a>
		    </li>
		);
	}
}

//Arrow function (avoid typing return statement)
const mapStateToProps = (state) => ({
	sideElements: state.sideElements
})

//Same as above, but without arguments: simple object
const mapDispatchToProps = {
	sideElementAction: selectSideElement
}


export default connect(mapStateToProps, mapDispatchToProps)(SideBar);

//export default SideBar;