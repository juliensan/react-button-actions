import React, { Component, PropTypes } from 'react';
import Styles from './Styles';

class SlidingButton extends Component {

  static propTypes = {
    onClickCallback: PropTypes.func,
    action: PropTypes.object.isRequired,
  };


  constructor(props) {
    super(props);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.initStyles();
  }

  initStyles() {
    this.styles = Styles.ButtonStyles;
    this.containerStyles = { ...this.styles.container, ...this.props.action.style };
  }

  shouldComponentUpdate() {
    return false;
  }

  handleBtnClick() {
    if (this.props.action.onPress) {
      this.props.action.onPress.call();
    }
    this.props.onClickCallback(this.props.action);
  }

  render() {
    return (
      <div onTouchTap={this.handleBtnClick} style={this.containerStyles}>
        <div style={this.styles.content}>{this.props.action.text}</div>
      </div>
    );
  }
}

export default SlidingButton;