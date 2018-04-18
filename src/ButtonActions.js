import React from 'react';
import PropTypes from 'prop-types';
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
    linked: PropTypes.bool,
    fullwidth: PropTypes.bool,
    updateKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool
    ]),
    left: PropTypes.array,
    right: PropTypes.array,
    onOpen: PropTypes.func,
    onClose: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.styles = Styles.SwipeStyles;
    this.swipeId = Math.floor(Math.random() * 1000);
    this.deactivateHorizontal = false;
    this.state = {
      forceRender: false
    };
    this.deactivateVertical = false;
    this.btnsLeftWidth = 0;
    this.btnsRightWidth = 0;
    this.bindedEvents = {};
    this.bindedEvents2 = false;

    this.childrenProps = {};
    this.shouldShowRight = false;
    this.shouldShowLeft = false;
    this.leftIsVisible = false;
    this.rightIsVisible = false;

    this.currentRightDistance = false;
    this.currentLeftDistance = false;


    this.shouldCloseAutomatically = props.autoclose !== false;
    this.isLinkedToOthers = props.linked !== false;
    this.isFullWidth = props.fullwidth === true;

    this.initBindings();
    this.threshold = 0;
  }

  initBindings() {
    this.resetOverlay = this.resetOverlay.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.showRightMenu = this.showRightMenu.bind(this);
    this.showLeftMenu = this.showLeftMenu.bind(this);
    this.onHorizontalPanStart = this.onHorizontalPanStart.bind(this);
    this.onHorizontalPanEnd = this.onHorizontalPanEnd.bind(this);
    this.initSizes = this.initSizes.bind(this);
    this.onLeftPan = this.onLeftPan.bind(this);
    this.onRightPan = this.onRightPan.bind(this);
    this.initTouchEvents = this.initTouchEvents.bind(this);
    this.resetEvents = this.resetEvents.bind(this);
    this.handleContainerClick = this.handleContainerClick.bind(this);
  }

  deinitialize = () => {
    this.unRegisterSwipe(this.swipeId);
    this.resetEvents();
  }

  componentWillUnmount() {
    this.deinitialize();
  }

  onVerticalPanStart = (evt) => {
    if (this.deactivateVertical === false && this.deactivateHorizontal === false) {
      console.log('DEACTIVATE HORI');
      this.deactivateHorizontal = true;
    }
  }

  onVerticalPanEnd = (evt) => {
    if (this.deactivateHorizontal === true) {
      console.log('ACTIVATE HORI');
      this.deactivateHorizontal = false;
    }
  }

  onHorizontalPanStart(evt) {
    if (this.deactivateHorizontal === false) {
      console.log('DEACTIVATE VERT');
      this.deactivateVertical = true;
      this.panStartDelta = evt.deltaX;
    }
  }

  close = () => {
    this.resetOverlay();
  }

  resetButtons = () => {
    this.translateOverlay(0);
    this.transformLeftButton(0);
    this.transformRightButton(0);
    // this.leftIsVisible = false;
    // this.rightIsVisible = false;
  }

  isOverlayTransformed = () => {
    return this.overlay.style.transform !== 'translate3d(0px, 0px, 0px)';
  }

  resetOverlay() {
    if (this.leftIsVisible || this.rightIsVisible) {
      this.onClose();
    }
    this.currentLeftDistance = false;
    this.currentRightDistance = false;
    this.leftIsVisible = false;
    this.rightIsVisible = false;

    if (this.isOverlayTransformed()) this.resetButtons();
  }

  showRightMenu() {
    this.onClose();
    this.translateOverlay(-this.btnsRightWidth);
    this.transformLeftButton(0);
    this.transformRightButton(1);
    this.leftIsVisible = false;
    this.rightIsVisible = true;
    this.onOpen();
  }

  showLeftMenu() {
    this.onClose();
    this.translateOverlay(this.btnsLeftWidth);
    this.transformLeftButton(1);
    this.transformRightButton(0);
    this.leftIsVisible = true;
    this.rightIsVisible = false;
    this.onOpen();
  }

  onHorizontalPanEnd(evt) {
    if (this.deactivateHorizontal === false) {
      console.log('ACTIVATE VERT');
      this.deactivateVertical = false;
      this.shouldShowRight = (this.leftIsVisible === false && this.rightBtnContainer && evt.deltaX < 0 && evt.distance > this.threshold);
      this.shouldShowLeft = (this.rightIsVisible === false && this.leftBtnContainer && evt.deltaX > 0 && evt.distance > this.threshold);

      if (!this.shouldShowRight && !this.shouldShowLeft) return this.resetOverlay();

      if (this.shouldShowRight) return this.showRightMenu();

      if (this.shouldShowLeft) return this.showLeftMenu();
    }
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
    if (this.leftBtnContainer) {
      this.leftBtnContainer.style.transform = `scale3d(${value}, 1, 1)`;
    }
  }

  transformRightButton(value) {
    if (this.rightBtnContainer) {
      this.rightBtnContainer.style.transform = `scale3d(${value}, 1, 1)`;
    }
  }

  translateOverlay(value) {
    if (this.overlay) {
      this.overlay.style.transform = `translate3d(${value}px,0px,0px)`;
    }
  }

  onLeftPan(evt) {
    if (this.deactivateHorizontal === false) {
      // left: dist < 0
      const dist = this.getMovement(evt.deltaX, evt.velocityX);
      const value = Math.max(dist, this.btnsRightWidth * - 1);

      if (this.currentRightDistance !== false) {
        const correctedValue = (this.leftIsVisible)
          ? Math.max(value, 0)
          : Math.min(value, this.currentRightDistance);

        this.currentLeftDistance = correctedValue;
        this.translateOverlay(correctedValue);
        this.transformButtons(correctedValue);
      } else {
        this.currentLeftDistance = value;
        this.translateOverlay(value);
        this.transformButtons(value);
      }
    }
  }

  onOpen() {
    if (this.props.onOpen) this.props.onOpen.call();
    if (this.isLinkedToOthers) this.closeSwipes(this.swipeId);
  }

  onClose() {
    const hasSomeValues = this.rightIsVisible || this.leftIsVisible;
    if (this.props.onClose && hasSomeValues) {
      const values = (this.rightIsVisible) ? this.props.right : this.props.left;
      return this.props.onClose.call(null, values);
    }
  }

  getMovement(position, velocity) {
    return Math.round(position - this.panStartDelta * (1 + velocity));
  }

  onRightPan(evt) {
    if (this.deactivateHorizontal === false) {
      const dist = this.getMovement(evt.deltaX, evt.velocityX);
      const value = Math.min(dist, this.btnsLeftWidth);

      if (this.currentLeftDistance !== false) {
        const correctedValue = Math.max(value, this.currentLeftDistance);
        this.currentRightDistance = correctedValue;
        this.translateOverlay(correctedValue);
        this.transformButtons(correctedValue);
      } else {
        this.currentRightDistance = value;
        this.translateOverlay(value);
        this.transformButtons(value);
      }
    }
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

  getNbButtonsBySide() {
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

  resetSwipeEvents() {
    const eventsString = Object.keys(this.bindedEvents).join(' ');
    this.hammer.off(eventsString);
    this.hammer.destroy();
    this.bindedEvents = {};
    if (this.bindedEvents2) {
      const eventsString2 = Object.keys(this.bindedEvents2).join(' ');
      this.hammer2.off(eventsString);
      this.hammer2.destroy();
      this.bindedEvents2 = false;
    }

  }

  resetTapEvents() {
    this.containerHammer.off('tap');
    this.containerHammer.destroy();
  }

  resetEvents() {
    this.resetTapEvents();
    this.resetSwipeEvents();
  }
  initBindedEvents2 = () => {
    if (this.bindedEvents2 === false) this.bindedEvents2 = {};
  }
  registerEvent(eventName, second = false) {
    if (second) {
      this.initBindedEvents2();
      this.bindedEvents2[eventName] = true;
    }
    this.bindedEvents[eventName] = true;
  }

  initVerticalBlocker = () => {
    this.registerEvent('pandown', true);
    this.registerEvent('panup', true);
    this.hammer2.on('panstart', this.onVerticalPanStart);
    this.hammer2.on('panend', this.onVerticalPanEnd);
  }

  initEventsFromProps() {
    const events = this.getEvents();
    // console.log('events', events);
    if (events.left || events.right) {
      // console.log('binding pan');
      this.initVerticalBlocker();

      this.registerEvent('panstart');
      this.hammer.on('panstart', this.onHorizontalPanStart);

      this.registerEvent('panend');
      this.hammer.on('panend', this.onHorizontalPanEnd);

      this.registerEvent('panleft');
      this.hammer.on('panleft', this.onLeftPan);

      this.registerEvent('panright');
      this.hammer.on('panright', this.onRightPan);
    }
  }

  initTouchEvents() {
    this.containerHammer = new Hammer(this.container);
    this.containerHammer.add(new Hammer.Tap());
    this.containerHammer.on('tap', this.handleContainerClick);

    // console.log('binding hammer', this.overlay);
    this.hammer = new Hammer(this.overlay);
    this.hammer2 = new Hammer(this.overlay);
    this.hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 20 });
    this.hammer2.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL, threshold: 2 });
    this.initEventsFromProps();
  }

  debouncedInitSizes = () => {
    this.overlayWidth = this.container.offsetWidth;
    this.overlay.style.width = `${this.overlayWidth}px`;

    const { leftLength, rightLength } = this.getNbButtonsBySide();

    this.btnsLeftWidth = (this.isFullWidth && leftLength) ? this.overlayWidth : (this.overlayWidth / 4.5) * leftLength;
    this.btnsRightWidth = (this.isFullWidth && rightLength) ? this.overlayWidth : (this.overlayWidth / 4.5) * rightLength;

    if (this.rightBtnContainer) {
      this.rightBtnContainer.style.width = `${this.btnsRightWidth}px`;
    }

    if (this.leftBtnContainer) {
      this.leftBtnContainer.style.width  = `${this.btnsLeftWidth}px`;
    }

    this.threshold = Math.round(this.overlayWidth / 4.5);
  }

  initSizes = () => {
    if (this.container) {
      this.debouncedInitSizes();
    } else {
      requestAnimationFrame(this.initSizes);
    }
  }

  checkFullWidthConstraints() {
    if (this.isFullWidth === false) return true;

    const { leftLength, rightLength } = this.getNbButtonsBySide();
    if (leftLength > 1 || rightLength > 1) {
      console.error('react-action-buttons element : ', this);
      throw new Error('^^^^^^ react-action-buttons : Can\'t make a fullWidth swipe with more than 1 item');
    }

    return true;
  }


  constraintsAreValid() {
    return this.checkFullWidthConstraints();
  }

  initialize = () => {
    if (this.hasEvents() && this.constraintsAreValid()) {
      this.initTouchEvents();
      requestAnimationFrame(() => this.initSizes());
      if (this.isLinkedToOthers) this.registerSwipe(this.swipeId, this.resetOverlay);
    }
  }

  componentDidMount() {
    this.initialize();
  }

  handleBtnClick(action) {
    // console.log('action clicked : ', action);
    if (this.shouldCloseAutomatically) this.resetOverlay();
  }
  bindLeftBtnContainer = (c) => {
    this.leftBtnContainer = c;
  }
  renderLeftButtons() {
    return (this.props.left && this.props.left.length) ? (
      <div className="leftBtnContainer" key="leftBtnContainer" style={this.styles.leftContainerStyles} ref={this.bindLeftBtnContainer} >
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
  bindRightBtnContainer = (c) => {
    this.rightBtnContainer = c;
  }

  renderRightButtons() {
    return (this.props.right && this.props.right.length) ? (
      <div
        className="rightBtnContainer"
        key="rightBtnContainer"
        ref={this.bindRightBtnContainer}
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
    if (this.shouldCloseAutomatically) this.resetOverlay();
  }

  bindOverlayRef = (c) => {
    this.overlay = c;
  }

  bindContainerRef = (c) => {
    this.container = c;
  }

  update() {
    requestAnimationFrame(() => this.initSizes());
    this.resetButtons();
  }

  componentDidUpdate(prevProps) {
    this.update();
  }
  forceRerender() {
    this.setState((state) => {
      if (state.forceRender === false) {
        return { forceRender: true };
      }
      return null;
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.forceRender === true) {
      return true;
    }
    if (this.props.doNotReRender === true) return false;
    return true;
  }

  render() {
    const mergedSwipeContainerStyles = {
      ...this.styles.baseSwipeContainerStyles,
      ...this.props.style
    };
    return (
      <div ref={this.bindContainerRef} className="swipeContainer" style={mergedSwipeContainerStyles}>
        {this.renderButtons()}

        <div style={this.styles.overlayStyles} className="swipeOverlay" ref={this.bindOverlayRef}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default ButtonActions;