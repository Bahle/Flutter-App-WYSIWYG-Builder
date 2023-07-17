import React from 'react'
import { Card } from 'antd'
import './Page.css';
import { EventEmitter } from '../utils/Events.js'
import { materialColor } from '../utils.js'

// console.log('window.localStorage.pages: ', window.localStorage.pages)

class Page extends React.PureComponent {
  constructor(props) {
    super(props);
    this.childElement = React.Children.only(this.props.children);
    
    /*alert(window.localStorage.pages)
    alert(typeof JSON.parse(window.localStorage.pages))
    alert(this.props.title + ' ' + JSON.parse(window.localStorage.pages).find(page => true).height)*/
    // console.log(this.props.title)
    // console.log('Another window.localStorage.pages: ', window.localStorage.pages)
    // debugger

    // alert('Page: ' + window.localStorage.pages)
    // debugger
    // alert('3.1: ' + window.localStorage.pages)
    // alert('this.props.title', this.props.title)
    this.currentPage = JSON.parse(window.localStorage.pages).find(page => page.name == this.props.title)

    this.state = {
      // height: '640px'
      overflow: (this.props.title != 'New Page' && this.props.title != 'New Popup') && this.currentPage && this.currentPage.height > 640,
      backgroundColor: (this.currentPage && this.currentPage.backgroundColor && materialColor(this.currentPage.backgroundColor)) || 'white',
      outerHeight: this.currentPage?.outerHeight
    }


    // alert('3.2: ' + window.localStorage.pages)
    EventEmitter.subscribe('setPageHeight', this.setPageHeight.bind(this));
    EventEmitter.subscribe('setOuterPageHeight', this.setOuterPageHeight.bind(this));
    EventEmitter.subscribe('setBackgroundColor', this.setBackgroundColor.bind(this));
    EventEmitter.subscribe('setBackgroundImage', this.setBackgroundImage.bind(this));
  }

  handlePageClick() {
    // alert('setting localStorage: ' + JSON.stringify(this.props));
    window.localStorage.setItem('currentPage', this.props.title); // id and key not appearing in props even though
  }

  setPageHeight(value) {
    console.log('this.props.title', this.props.title)
    console.log('window.localStorage.currentPage', window.localStorage.currentPage)
    if(this.props.title != window.localStorage.currentPage) return;

    value = parseInt(value);
    if(!this.state.overflow && value > 640) {
      this.setState({overflow: true})
    } else if(this.state.overflow && value <= 640) {
      this.setState({overflow: false})
    }

    // this.stageRef.setHeight(value);
    // this.setState({height: value + 'px'})
  }

  setOuterPageHeight(value) {
    this.setState({outerHeight: value})
    let pages = JSON.parse(window.localStorage.pages)
    pages = pages.map(page => {
      return this.currentPage.id != page.id ? page : { ...page, outerHeight: value }
    })

    window.localStorage.pages = JSON.stringify(pages)
  }

  setBackgroundColor(value) {
    if(this.props.title != window.localStorage.currentPage || window.localStorage.currentSelection != "") return;
    const color = materialColor(value);

    this.setState({backgroundColor: color});
    this.currentPage.backgroundColor = color;

    let pages = JSON.parse(window.localStorage.pages).map(page => page.name == this.props.title ? this.currentPage : page) // set the new current page props
    // alert('pages: ' + JSON.stringify(pages))
    window.localStorage.pages = JSON.stringify(pages)
  }

  setBackgroundImage(value) {
    if(this.props.title != window.localStorage.currentPage || window.localStorage.currentSelection != "") return;
    
    this.setState({backgroundImage: value})
    this.currentPage.backgroundImage = value;

    let pages = JSON.parse(window.localStorage.pages).map(page => page.name == this.props.title ? this.currentPage : page) // set the new current page props
    window.localStorage.pages = JSON.stringify(pages)
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
            style={{...this.props.styling, height: this.props.type == 'ScrollableBottomSheet' ? (this.state.outerHeight ?? this.props.height) : this.props.styling.height, backgroundColor: this.state.backgroundColor, backgroundImage: `url('${this.state.backgroundImage}')`}}
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