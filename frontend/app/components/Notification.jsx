import React from 'react'
import { connect } from 'react-redux'
import Websocket from 'react-websocket';
import {REST_DNS, DEVICE_OWNER_NAMESPACE} from "../constants/constants";
import {notification} from "../reducers/actions";


export function showNotification(message){
	$.notify({
		icon: "pe-7s-bell",
		message: message

	},{
		type: 'info',
		timer: 3000,
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
        this.props.notificationAction(result.msg);

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

const mapDispatchToProps = {
	notificationAction: notification
}


export default connect(mapStateToProps, mapDispatchToProps)(Notification);
