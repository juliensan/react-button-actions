import React, { PropTypes } from 'react';
import Hammer from 'hammerjs';

import CoreSwipe from './CoreSwipe';
import SlidingButton from './SlidingButton';
import Styles from './Styles';

const computeShowAnimationCssValue = (distance, maxWidth) => Math.min(distance / maxWidth, 1);
const computeHideAnimationCssValue = (distance, maxWidth) => Math.max(1 - (distance / maxWidth), 0);

class ButtonActions extends CoreSwipe {

  static propTypes = {
    onPress: PropTypes.func,
    autoclose: PropTypes.bool,
    style: PropTypes.object,
    left: PropTypes.array,
    right: PropTypes.array,
    onOpen: PropTypes.func,
    onClose: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.styles = Styles.SwipeStyles;
    this.swipeId = Math.floor(Math.random() * 1000);
    this.btnsLeftWidth = 0;
    this.btnsRightWidth = 0;
    this.bindedEvents = {};
    this.childrenProps = {};

    this.shouldShowRight = false;
    this.shouldShowLeft = false;
    this.leftIsVisible = false;
    this.rightIsVisible = false;

    this.initBindings();
    this.treshold = 0;
  }

  initBindings() {
    this.resetOverlay = this.resetOverlay.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.showRightMenu = this.showRightMenu.bind(this);
    this.showLeftMenu = this.showLeftMenu.bind(this);
    this.onPanStart = this.onPanStart.bind(this);
    this.onPanEnd = this.onPanEnd.bind(this);
    this.initSizes = this.initSizes.bind(this);
    this.onLeftPan = this.onLeftPan.bind(this);
    this.onRightPan = this.onRightPan.bind(this);
    this.initTouchEvents = this.initTouchEvents.bind(this);
    this.resetEvents = this.resetEvents.bind(this);
    this.handleContainerClick = this.handleContainerClick.bind(this);
  }

  componentWillUnmount() {
    this.unRegisterSwipe(this.swipeId);
    this.resetEvents();
  }

  onPanStart(evt) {
    this.panStartDelta = evt.deltaX;
  }

  resetOverlay() {
    if (this.leftIsVisible || this.rightIsVisible) {
      this.translateOverlay(0);
      this.transformLeftButton(0);
      this.transformRightButton(0);
    }
  }

  showRightMenu() {
    this.translateOverlay(-this.btnsRightWidth);
    this.transformLeftButton(0);
    this.transformRightButton(1);
    this.leftIsVisible = false;
    this.rightIsVisible = true;
  }

  showLeftMenu() {
    this.translateOverlay(this.btnsLeftWidth);
    this.transformLeftButton(1);
    this.transformRightButton(0);
    this.leftIsVisible = true;
    this.rightIsVisible = false;
  }

  handleClosingOpenings() {
    const leftClosing = (this.leftIsVisible && this.props.left && this.shouldShowLeft === false);
    const rightClosing = (this.rightIsVisible && this.props.right && this.shouldShowRight === false);

    const leftOpening = (this.leftIsVisible === false && this.props.left && this.shouldShowLeft === true);
    const rightOpening = (this.rightIsVisible === false && this.props.right && this.shouldShowRight === true);

    if (leftClosing) {
      this.onClose(this.props.left);
      this.leftIsVisible = false;
    }

    if (leftOpening) this.onOpen(this.props.left);

    if (rightClosing) {
      this.onClose(this.props.right);
      this.rightIsVisible = false;
    }

    if (rightOpening) this.onOpen(this.props.right);
  }

  onPanEnd(evt) {
    this.shouldShowRight = (evt.deltaX < 0 && evt.distance > this.treshold);
    this.shouldShowLeft = (evt.deltaX > 0 && evt.distance > this.treshold);

    this.handleClosingOpenings();

    if (!this.shouldShowRight && !this.shouldShowLeft) return this.resetOverlay();

    if (this.shouldShowRight) return this.showRightMenu();

    if (this.shouldShowLeft) return this.showLeftMenu();
  }

  transformButtons(distance) {
    const lefty = (distance > 0);
    const dist = (lefty) ? distance : distance * -1;

    const leftFn = (lefty) ? computeShowAnimationCssValue : computeHideAnimationCssValue;
    const rightFn = (lefty) ? computeHideAnimationCssValue : computeShowAnimationCssValue;

    const leftScale = leftFn(dist, this.btnsLeftWidth);
    const rightScale = rightFn(dist, this.btnsRightWidth);

    this.transformLeftButton(leftScale);
    this.transformRightButton(rightScale);
  }

  transformLeftButton(value) {
    if (this.refs.leftBtnContainer) {
      this.refs.leftBtnContainer.style.transform = `scale3d(${value}, 1, 1)`;
    }
  }

  transformRightButton(value) {
    if (this.refs.rightBtnContainer) {
      this.refs.rightBtnContainer.style.transform = `scale3d(${value}, 1, 1)`;
    }
  }

  translateOverlay(value) {
    if (this.refs.overlay) {
      this.refs.overlay.style.transform = `translate3d(${value}px,0px,0px)`;
    }

  }

  onLeftPan(evt) {
    const dist = this.getMovement(evt.deltaX, evt.velocityX);
    const value = Math.max(dist, this.btnsRightWidth * - 1);

    if (this.btnsRightWidth === 0) {
      this.resetOverlay();
    } else {
      this.translateOverlay(value);
      this.transformButtons(value);
    }
  }

  onOpen(values) {
    if (this.props.onOpen) this.props.onOpen.call(null, values);
    this.closeSwipes(this.swipeId);
  }

  onClose(values) {
    if (this.props.onClose) {
      return this.props.onClose.call(null, values);
    }
  }

  getMovement(position, velocity) {
    return Math.round(position - this.panStartDelta * (1 + velocity));
  }

  onRightPan(evt) {
    const dist = this.getMovement(evt.deltaX, evt.velocityX);
    const value = Math.min(dist, this.btnsLeftWidth);
    if (this.btnsLeftWidth === 0) {
      this.resetOverlay();
    } else {
      this.translateOverlay(value);
      this.transformButtons(value);
    }
  }

  onPressUp() {

  }

  getEvents() {
    const { left, right, onOpen, onClose } = this.props;

    return {
      left,
      right,
      onOpen,
      onClose
    };
  }

  getNbButtons() {
    const { left, right } = this.getEvents();
    return {
      leftLength: (left && left.length) ? left.length : 0,
      rightLength: (right && right.length) ? right.length : 0
    };
  }

  hasEvents() {
    const { left, right, onOpen, onClose } = this.getEvents();
    return !!left || !!right ;
  }

  resetEvents() {
    const eventsString = Object.keys(this.bindedEvents).join(' ');
    this.hammer.off(eventsString);
  }

  registerEvent(eventName) {
    this.bindedEvents[eventName] = true;
  }

  initEventsFromProps() {
    const events = this.getEvents();

    this.registerEvent('panstart');
    this.hammer.on('panstart', this.onPanStart);
    this.hammer.on('panend', this.onPanEnd);

    this.registerEvent('panleft');
    this.hammer.on('panleft', this.onLeftPan);

    this.registerEvent('panright');
    this.hammer.on('panright', this.onRightPan);
  }

  initTouchEvents() {
    if (this.hasEvents()) {
      this.hammer = new Hammer(this.refs.overlay);
      this.hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });

      this.initEventsFromProps();
    }
  }

  initSizes() {
    this.overlayWidth = this.refs.childrenContainer.offsetWidth;

    this.refs.overlay.style.width = `${this.overlayWidth}px`;

    const { leftLength, rightLength } = this.getNbButtons();
    this.btnsLeftWidth = (this.overlayWidth / 4.5) * leftLength;
    this.btnsRightWidth = (this.overlayWidth / 4.5) * rightLength;

    if (this.refs.rightBtnContainer) {
      this.refs.rightBtnContainer.style.width = `${this.btnsRightWidth}px`;
    }

    if (this.refs.leftBtnContainer) {
      this.refs.leftBtnContainer.style.width  = `${this.btnsLeftWidth}px`;
    }

    this.treshold = Math.round(this.overlayWidth / 4.5);
  }

  componentDidMount() {
    // console.group('On did mount Swipe');
    // linking hammer ref content
    this.initTouchEvents();
    this.initSizes();
    this.registerSwipe(this.swipeId, this.resetOverlay);
    // console.groupEnd();
  }

  handleBtnClick(action) {
    this.resetOverlay();
  }

  renderLeftButtons() {
    return (this.props.left && this.props.left.length) ? (
      <div className="leftBtnContainer" key="leftBtnContainer" style={this.styles.leftContainerStyles} ref="leftBtnContainer" >
       { this.props.left.map((action, index) =>
          <SlidingButton
            key={index}
            onClickCallback={this.handleBtnClick}
            action={action} />
        )}
      </div>
    )
    : '';
  }

  renderRightButtons() {
    return (this.props.right && this.props.right.length) ? (
      <div
        className="rightBtnContainer"
        key="rightBtnContainer"
        ref="rightBtnContainer"
        style={this.styles.rightContainerStyles}
      >
        { this.props.right.map(
          (action, index) =>
            <SlidingButton
              action={action}
              key={index}
              onClickCallback={this.handleBtnClick}
            />
        )}
      </div>
    )
    : '';
  }

  renderButtons() {
    return (this.hasEvents())
    ? (
      <div className="buttonsContainer" style={this.styles.buttonsContainerStyles}>
        {this.renderLeftButtons()}
        {this.renderRightButtons()}
      </div>
    )
    : '';
  }

  handleContainerClick() {
    if (this.props.onPress) {
      this.props.onPress.call();
    }
    this.resetOverlay();
  }

  render() {
    const children = React.cloneElement(this.props.children, {...this.childrenProps});
    const mergedSwipeContainerStyles = {
      ...this.styles.baseSwipeContainerStyles,
      ...this.props.style
    };

    return (
      <div onTouchTap={this.handleContainerClick} className="swipeContainer" style={mergedSwipeContainerStyles}>

        {this.renderButtons()}

        <div style={this.styles.overlayStyles} className="swipeOverlay" ref="overlay">
          <div className="childrenContainer" ref="childrenContainer">
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default ButtonActions;