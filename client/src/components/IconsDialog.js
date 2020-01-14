import React from 'react'
import { Input as AntInput, Row, Col, Modal } from 'antd'
// import { CropOriginalIcon } from '@material-ui/icons';
import iconList from './iconList'
const MaterialIcons = require('@material-ui/icons')

const { Search: AntSearch } = AntInput;

const iconBoxStyle = {
	position: 'absolute',
	background: 'white',
	border: 'solid thin #ddd',
	borderRadius: '3px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	width: '95%',
	height: '95%',
	top: '2.5%',
	left: '2.5%',
	flexDirection: 'column',
	cursor: 'pointer'
}

const Box = ({title, children}) => {
	return (
		<Col xs={{ span: 8 }} sm={{ span: 6 }} md={{ span: 4 }}>
			<div style={{position: 'relative'}}>
				<div style={iconBoxStyle}>
					{children}
					<div style={{color:'#888', textAlign: 'center'}}>{title.replace(/[A-Z]/g, ' $&')}</div>
				</div>
				<div style={{paddingTop: '100%'}}></div>
			</div>
		</Col>
	)
}

/*const Custom = ({Tag}) => {
	return <div>{(require('@material-ui/icons')[Tag])}</div>
}*/

class IconsWidget extends React.Component {
	state = {
		search: ''
	}

	handleSearch(e) {
		console.log(e.target.value)
		this.setState({search: e.target.value});
	}

	handleClick(icon) {
		// alert('you click: ' + icon)
		this.props.handleSelectIcon(icon)
	}


	render() {
		return(
			<div style={{maxWidth: 800, margin: 'auto'}}>
				<AntSearch width="100%" placeholder="Search" onKeyUp={this.handleSearch.bind(this)} size="large" />

				<Row style={{background: '#eee', display: 'block'}}>
					{
						iconList.filter(check => ~check.toLowerCase().indexOf(this.state.search)).slice(0, 42).map(icon => {
							const Tag = icon;

							return (<div key={icon} onClick={this.handleClick.bind(this, icon)}><Box title={icon}>
								{React.createElement(MaterialIcons[icon])}
							</Box></div>)
						})
					}
				</Row>
			</div>
		)
	}
}

class Dialog extends React.Component {
  state = {
    visible: false,
  };

  childElement = React.Children.only(this.props.children);

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
  	this.formRef.props.getIcon('') // it works!
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.props.GetPageProps(values);
      /*alert('sdf')
      console.log('Received values of form: ', values);*/
      form.resetFields();
      this.setState({ visible: false });
    });
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
	    	  width='800px'
	          visible={this.state.visible}
	          title="Choose an icon"
	          okText="Okay"
	          cancelText="Set None"
	          onCancel={this.handleCancel.bind(this)}
	          onOk={this.handleCreate.bind(this)}
	        >
	      		<IconsWidget handleSelectIcon={this.handleSelectIcon.bind(this)} />
	      	</Modal>

	      	<div onClick={this.showModal}>
        		{
		            React.cloneElement(
		              this.childElement, 
		              { ref: el => this.formRef = el }
		            )
		        }
        	</div>
	    </div>
    );
  }
}

export default Dialog;