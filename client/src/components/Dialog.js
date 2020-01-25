import React from 'react'
import { Modal } from 'antd'

class Dialog extends React.Component {
  state = { visible: false };
  // childElement = React.Children.only(this.props.children);
  
  showModal = (visible = true) => {
    this.setState({visible});
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <div>
        <div onClick={this.showModal}>
        	{this.props.Trigger}
        </div>

        <Modal
          width={this.props.Width || 750}
          title={this.props.Title || "Modal"}
          visible={this.state.visible}
          onOk={this.props.OnOk || this.handleOk}
          onCancel={this.props.OnCancel || this.handleCancel}
          okText={this.props.OkText || 'OK'}
          cancelText={this.props.CancelText || 'Cancel'}
        >
          {
            /*React.cloneElement(
              this.childElement, 
              { ref: el => this.formRef = el }
            )*/
            this.props.children
          }
        </Modal>
      </div>
    );
  }
}

export default Dialog;

// <Dialog Trigger={}>Button</Dialog>