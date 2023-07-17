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

/* finish the following three functions later */
/* this.state.type == 'GridView' && <Form.Item label={UpperCaseFirstWords('columnCount')}>
  {getFieldDecorator('columnCount', {
  	initialValue: this.widgetProps['columnCount'] || this.currentSelection.columnCount, 
    rules: [
      {
        required: true,
        message: `Please input the inner ${lowerCaseWords('columnCount')}`,
      },
    ],
  })(<InputNumber step={10} onChange={value => EventEmitter.dispatch(`set${UpperCaseFirstWords('columnCount')}`, value) } />)}
</Form.Item> */
// camelCased => Camel Cased
/*function UpperCaseFirstWords(value) {

}

// Normal Words => normalWords
function camelCaseWords(value) {

}

function lowerCaseWords(value) {
	return value.toLowerCase()
}*/

function materialColor(color) {
	if(!color) return null;
	return JSON.parse(window.localStorage.themeData)?.color?.find(data => data.key == color)?.colorCode || null;
}

const actions = ['setText','setHeight','setImage','setStretchMode','setType','setColor','setLabel', 'setPlaceholder', 'setLeadingIcon', 'setTrailingIcon','setTitle', 'setSubtitle', 'setElevation', 'setTabs', 'setTabIcons', 'setIcon',
				'setOptions', 'setTabImages', 'setModel', 'setModelField', 'setActions', 'setDrawerListItems', 'setInnerHeight', 'setColumnCount', 'setBorderWidth', 'setBorderColor', 'setBorderRadius', 'setBackgroundColor', 'setOpacity', 'setEventType', 'setPopupType', 'setCameraType', 'setNavigateToPage', 'setWebsiteURL', 'setDialogTitle', 'setDialogContent', 'setOrientation', 'setShowLabel', 'setMin', 'setMax', 'setDivisions', 'setIsRangeSlider',
				'setIsDeterminate', 'setDocked', 'setMini', 'setFontSize', 'setInkwell', 'setTitles', 'setSubtitles', 'setLeadingIcons', 'setTrailingIcons', 'setTrailingCheckbox', 'setTrailingSwitch', 'setIsSelectable', 'setDeleteIcon', 'setSelectionColor', 'setLabelColor', 'setIconColor', 'setLabels', 'setIcons', 'setImages', 'setPadding', 'setTextWrap', 'setFocusBorderColor', 'setOutlinedBorder', 'setBackgroundImage', 
				'setTitleModelField', 'setSubtitleModelField', 'setLeadingModelField', 'setTrailingModelField', 'setAvatar', 'setMediaHeight', 'setActionText', 'setActionIcons', 'setUseModel', 'setRotation', 'setScale', 
				'setIsCachedNetworkImage', 'setIsYear', 'setIsMonth'
]

export { fieldLabel, pluralize, initializeAction, actions, materialColor };