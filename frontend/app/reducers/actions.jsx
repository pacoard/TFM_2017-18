export function selectSideElement(sideElement) {
	return {
		type: 'SELECT_SIDE_ELEMENT',
		sideElementName: sideElement.props.name,
	};
} 

export function switchUser(userEmail) {
	return {
		type: 'SWITCH_USER',
		userEmail: userEmail,
	};
}