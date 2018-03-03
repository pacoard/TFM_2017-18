import React from 'react'
import { connect } from 'react-redux'
import Websocket from 'react-websocket';
import {REST_DNS, DEVICE_OWNER_NAMESPACE} from "../constants/constants";


export function showNotification(message){
	$.notify({
		icon: "pe-7s-bell",
		message: message

	},{
		type: 'info',
		timer: 4000,
		placement: {
			from: 'bottom',
			align: 'right'
		}
	});
}

class Notification extends React.Component {
    constructor(props) {
        super(props);
    }
    handleData(data) {
        let result = JSON.parse(data);

        if (result.ownerEmail === this.props.userEmail) {
            if (result.msg) showNotification(result.msg);
            console.log('WebSocket: ');
            console.log(result);
        }

    }

    render() {
        let wsURL = 'ws://' + REST_DNS;
        return (
                <Websocket url={wsURL} onMessage={this.handleData.bind(this)}/>
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

export default connect(mapStateToProps)(Notification);
