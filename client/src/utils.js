function fieldLabel(item) {
	item = item.replace('_', ' ');

	return item[0].toUpperCase() + item.substr(1);
}

function pluralize(item) {
	return item[item.length-1] == 's' ? item : item + 's';
}

function initializeAction(actions, self) {
	let actionNames = [];
	actions.forEach(action => {
		actionNames.push(action);

		self[action] = function(param, stageRef) {
			stageRef[action](param.target ? param.target.value : param);
		}
	})

	return actionNames;
}

const actions = ['setText','setHeight','setImage','setStretchMode','setType','setColor','setLabel', 'setPlaceholder']

export { fieldLabel, pluralize, initializeAction, actions };