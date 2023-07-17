import React from 'react';
import MaterialColorPicker from 'react-material-color-picker';
import {Modal} from 'antd'
import { EventEmitter } from '../utils/Events.js'
import './ColorPickerDialog.css';

const $ = window.$;

class Dialog extends React.Component {
  constructor(props) {
    super(props);

    const themeData = JSON.parse(window.localStorage.themeData)
    const fuck = this.props.name
    // alert(fuck)
    const shit = themeData.color.find(data => data.key == fuck) || { colorCode: '#F00' };
    // console.log('shit: ', shit)
    this.state = {
      visible: false,
      color: shit.colorCode //'white'
    };

    // EventEmitter.subscribe('pickColor', value => this[action](value) );
  }

  /// childElement = React.Children.only(this.props.children);

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
  	// this.formRef.props.getIcon('') // it works!
    this.setState({ visible: false });
  };

  handleSubmit = ({target}) => {
    // alert( $('.material-color-picker-title div:first').text() )
    // EventEmitter.dispatch('pickColor', {materialColor: $('.material-color-picker-title div:first').text(), hexCode: $('#material-color-picker nobr').text()})
    // alert($('div:not(.ant-modal-mask-hidden) nobr').text())
    // alert(target.value)
    this.setState({
      color: target.value,//$('div:not(.ant-modal-mask-hidden) nobr').text(),
      visible: false
    })

    const themeData = JSON.parse(window.localStorage.themeData)
    const shit =  themeData.color.find(data => data.name == this.props.name);
    shit.materialColor = $('.material-color-picker-title div:first').text()
    shit.colorCode = target.value

    window.localStorage.themeData = JSON.stringify(themeData);
  }

  handleCreate = () => {
    /** const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.props.GetPageProps(values);
      form.resetFields();
      this.setState({ visible: false });
    }); */
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  handleSelectIcon(icon) {
	// alert('clicked: ' + JSON.stringify(e))
	this.setState({visible: false})
	// console.dir(this.props.children)
	// this.formRef.hello()
	this.formRef.props.getIcon(icon) // it works!
  }

  render() {
    return (
    	<div>
	    	<Modal
           className="colorPickerDialog"
	    	  width='500px'
	          visible={this.state.visible}
	          title="Choose an color"
	        >
	      		{ /* <IconsWidget handleSelectIcon={this.handleSelectIcon.bind(this)} /> */ }
	      		<MaterialColorPicker 
				    initColor="rgba(0, 0, 0, 0.26)"
				    onSubmit={ this.handleSubmit } // ({target}) => console.log('submit: ' + target.value)
				    onReset={() => console.log('reset')}
				    style={{width: '100%', backgroundColor: '#c7c7c7'}}
				    submitLabel='Apply'
				    resetLabel='Undo'
				/>
	      	</Modal>

	      	<div onClick={this.showModal}>
        		<div style={{border: 'thin solid',height: 32,width: '100%', borderRadius: 2,cursor: 'pointer',background: this.state.color}}></div>
        	</div>
	    </div>
    );
  }
}

export default Dialog;