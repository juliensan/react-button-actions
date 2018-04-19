import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SlidingButton extends Component {

  static propTypes = {
    onClickCallback: PropTypes.func,
    action: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
  };

  shouldComponentUpdate() {
    return false;
  }

  handleBtnClick = () => {
    if (this.props.action.onPress) {
      this.props.action.onPress.call();
    }
    this.props.onClickCallback(this.props.action);
  }

  render() {
    const containerStyles = { ...this.props.styles.container, ...this.props.action.style };
    return (
      <div onClick={this.handleBtnClick} style={containerStyles}>
        <div style={this.props.styles.content}>{this.props.action.text}</div>
      </div>
    );
  }
}

export default SlidingButton;