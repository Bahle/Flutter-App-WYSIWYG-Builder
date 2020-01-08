const RaisedButtonActions = {
	setText: function(e, stageRef) {
		const selected = JSON.parse(window.localStorage.currentSelection).id;
		stageRef.setText(e.target.value);
	},
	shit: function() { alert('fuck') }
}

module.exports = RaisedButtonActions