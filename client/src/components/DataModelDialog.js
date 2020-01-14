import React from 'react'
import { Tabs, Button, Input } from 'antd';

const { TabPane } = Tabs;

const $ = window.$

class DataModelDialog extends React.Component {
  constructor(props) {
    super(props);
    this.newTabIndex = 0;
    const panes = [
      { title: 'Tab 1', content: <div className='dude'><div style={{background: 'red', height: '50%'}}>Content of Tab Pane 1</div><div style={{background: 'green', height: '50%'}}>a</div></div>, key: '1' },
      { title: 'Tab 2', content: 'Content of Tab Pane 2', key: '2' },
    ];
    this.state = {
      activeKey: panes[0].key,
      panes,
      addingTab: false
    };
  }

  onChange = activeKey => {
    this.setState({ activeKey });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = () => {
    const { panes } = this.state;
    const activeKey = `newTab${this.newTabIndex++}`;
    // console.dir(this.NameInput)
    panes.push({ title: this.NameInput.input.value, content: 'New Tab Pane', key: activeKey });
    this.setState({ panes, activeKey, addingTab: false });
  };

  remove = targetKey => {
    let { activeKey } = this.state;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = panes[lastIndex].key;
      } else {
        activeKey = panes[0].key;
      }
    }
    this.setState({ panes, activeKey });
  };

  beginEnterName = () => this.setState({addingTab: true});
  cancelEnterName = () => this.setState({addingTab: false});

  componentDidMount() {
    $('.dude').css('height', $('body').height() - $('.dude').offset().top + 'px');
    window.onresize = function() {
      $('.dude').css('height', $('body').height() - $('.dude').offset().top + 'px');
    }
  }

  render() {
    return (
      <div>
        <div style={{ marginBottom: 16, display: 'flex' }}>
          <Button onClick={this.beginEnterName}>ADD</Button>
          {
            this.state.addingTab && (
              <div>
                <Input ref={input => this.NameInput = input} placeholder="Tab name" style={{width: 150}} />
                <Button onClick={this.add} type="Primary">Submit</Button>
                <Button onClick={this.cancelEnterName}>Cancel</Button>
              </div>
            )
          }
        </div>
        <Tabs
          hideAdd
          onChange={this.onChange}
          activeKey={this.state.activeKey}
          type="editable-card"
          onEdit={this.onEdit}
        >
          {this.state.panes.map(pane => (
            <TabPane tab={pane.title} key={pane.key}>
              {pane.content}
            </TabPane>
          ))}
        </Tabs>
      </div>
    );
  }
}

export default DataModelDialog