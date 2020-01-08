import React from 'react'
import { Card } from 'antd'
import './Page.css';


class Page extends React.PureComponent {
  constructor(props) {
    super(props);
    this.childElement = React.Children.only(this.props.children);
    
    /*alert(window.localStorage.pages)
    alert(typeof JSON.parse(window.localStorage.pages))
    alert(this.props.title + ' ' + JSON.parse(window.localStorage.pages).find(page => true).height)*/

    this.state = {
      // height: '640px'
      overflow: (this.props.title != 'New Page' && this.props.title != 'New Popup') && JSON.parse(window.localStorage.pages).find(page => page.name == this.props.title).height > 640
    }
  }

  handlePageClick() {
    // alert('setting localStorage: ' + JSON.stringify(this.props));
    window.localStorage.setItem('currentPage', this.props.title); // id and key not appearing in props even though
  }

  setHeight(value) {
    value = parseInt(value);
    if(!this.state.overflow && value > 640) {
      this.setState({overflow: true})
    } else if(this.state.overflow && value <= 640) {
      this.setState({overflow: false})
    }

    this.stageRef.setHeight(value);
    // this.setState({height: value + 'px'})
  }

  getStageRef() {
    return this.stageRef;
  }

  /*componentDidMount() {
    console.log('componentDidMount yippee!')
    console.dir(this.ref);
  }
*/
  render() {
    return (
      <div className="app-page" onClick={this.handlePageClick.bind(this)}>
        <Card
            hoverable
            style={this.props.styling}
            className={this.state.overflow ? 'page-overflowed' : ''}
          >
          {/*<Button type="primary" icon="plus" style={{backgroundColor: '#d1d1d1', color: 'white', borderColor: 'transparent'}} onClick={this.showModal} />*/}
          {
            React.cloneElement(
              this.childElement, 
              { ref: el => this.stageRef = el }
            )
          }
        </Card>
        <div className="page-title">{this.props.title}</div>
      </div>
    );
  }
}

export default Page;