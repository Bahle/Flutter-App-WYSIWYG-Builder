import React from 'react'
import { AutoComplete } from 'antd';

function onSelect(value) {
  // console.log('onSelect', value);
}

class Complete extends React.Component {
  state = {
    value: '',
    dataSource: this.props.dataSource || [],
  };

  onSearch = searchText => {
    this.setState({
      dataSource: this.props.dataSource.filter(source => ~source.toLowerCase().indexOf(searchText.toLowerCase()) ) //!searchText ? [] : [searchText, searchText.repeat(2), searchText.repeat(3)],
    });

    this.props.onChange(searchText)
  };

  onChange = value => {
    this.setState({ value });
  };

  render() {
    const { dataSource, value } = this.state;
    return (
      <div>
        <AutoComplete
          dataSource={dataSource}
          style={{ width: this.props.width || 200 }}
          onSelect={onSelect}
          onSearch={this.onSearch}
          onChange={this.props.onChange}
          placeholder={this.props.placeholder || ""}
          value={this.props.value}
        />
        {/*<br />
        <br />
        <AutoComplete
          value={value}
          dataSource={dataSource}
          style={{ width: this.props.width || 200 }}
          onSelect={onSelect}
          onSearch={this.onSearch}
          onChange={this.onChange}
          placeholder={ this.props.placeholder || ""}
        />*/}
      </div>
    );
  }
}

Complete.defaultProps = {
    dataSource: []
}

export default Complete;