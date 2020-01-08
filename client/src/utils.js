function fieldLabel(item) {
	item = item.replace('_', ' ');

	return item[0].toUpperCase() + item.substr(1);
}

function pluralize(item) {
	return item[item.length-1] == 's' ? item : item + 's';
}

export { fieldLabel, pluralize };