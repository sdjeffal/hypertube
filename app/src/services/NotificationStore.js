export default {
	
	state: [],

	addNotification (notification) {
		this.state.push(notification)
		if (notification.timeout)
			setTimeout(() => {this.removeNotification(notification)}, 3000)
	},

	removeNotification (notification) {
		let index = this.state.indexOf(notification)
		this.state.splice(index, 1)
	},

	showNotification (text, type, timeout)
	{
		this.addNotification({text, type, timeout})
	},

	showInternalErrorNotification()
	{
		this.showNotification(
			"database error",
			"alert-danger",
			true
			)
	}

}