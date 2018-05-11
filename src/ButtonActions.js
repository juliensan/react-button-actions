import React from 'react';
import PropTypes from 'prop-types';
import Hammer from 'hammerjs';
import CoreSwipe from './CoreSwipe';
import SlidingButton from './SlidingButton';
import { SwipeStyles, ButtonStyles } from './Styles';

const computeShowAnimationCssValue = (distance, maxWidth) => {
  const raw = Math.min(distance / maxWidth, 1);
  return Math.round(raw * 1000) / 1000;

};
const computeHideAnimationCssValue = (distance, maxWidth) => {
  const raw = Math.max(1 - (distance / maxWidth), 0);
  return Math.round(raw * 1000) / 1000;
}

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
    this.hasCached = {};
    this.swipeId = Math.floor(Math.random() * 1000);
    this.deactivateHorizontal = false;
    this.state = {
      forceRender: false
    };
    this.deactivateVertical = false;
    this.sizeInitialized = false;
    this.leftBtnContainerScale = 0;
    this.rightBtnContainerScale = 0;
    this.overlayTransform = 0;
    this.btnsLeftWidthPixels = 0;
    this.btnsRightWidthPixels = 0;
    this.bindedEvents = {};
    this.bindedEventsVert = false;

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

    this.threshold = 0;
    this.computeCssSizes();

  }

  deinitialize = () => {
    this.unRegisterSwipe(this.swipeId);
    this.hasCached = undefined;
    this.resetEvents();
  }

  componentWillUnmount() {
    this.deinitialize();
  }

  // onVerticalPanStart = (evt) => {
  //   if (this.deactivateVertical === false && this.deactivateHorizontal === false) {
  //     this.deactivateHorizontal = true;
  //   }
  // }

  // onVerticalPanEnd = (evt) => {
  //   if (this.deactivateHorizontal === true) {
  //     this.deactivateHorizontal = false;
  //   }
  // }

  // onHorizontalPanStart = (evt) => {
  //   if (this.deactivateHorizontal === false) {
  //     // this.deactivateVertical = true;
  //     this.panStartDelta = evt.deltaX;
  //   }
  // }

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
    return this.overlayTransform !== 0;
    // return this.overlay.style.transform !== 'translate3d(0px, 0px, 0px)';
  }

  resetOverlay = (withDispatch = true) => {
    if (withDispatch && (this.leftIsVisible || this.rightIsVisible)) {
      this.onClose();
    }
    this.currentLeftDistance = false;
    this.currentRightDistance = false;
    this.leftIsVisible = false;
    this.rightIsVisible = false;

    if (this.isOverlayTransformed()) this.resetButtons();
  }

  showRightMenu = () => {
    this.onClose();
    this.translateOverlay(-this.btnsRightWidthPixels);
    this.transformLeftButton(0);
    this.transformRightButton(1);
    this.leftIsVisible = false;
    this.rightIsVisible = true;
    this.onOpen();
  }

  showLeftMenu = () => {
    this.onClose();
    this.translateOverlay(this.btnsLeftWidthPixels);
    this.transformLeftButton(1);
    this.transformRightButton(0);
    this.leftIsVisible = true;
    this.rightIsVisible = false;
    this.onOpen();
  }

  onHorizontalPanEnd = (evt) => {
    if (this.deactivateHorizontal === false) {
      // console.log('this.rightBtnContainerScale', this.rightBtnContainerScale);
      // console.log('this.leftBtnContainerScale', this.leftBtnContainerScale);
      // this.deactivateVertical = false;
      this.shouldShowRight = (this.leftIsVisible === false && this.rightBtnContainer && evt.deltaX < 0 && evt.distance > this.threshold);
      this.shouldShowLeft = (this.rightIsVisible === false && this.leftBtnContainer && evt.deltaX > 0 && evt.distance > this.threshold);

      if (!this.shouldShowRight && !this.shouldShowLeft) return this.resetOverlay();

      if (this.shouldShowRight) return this.showRightMenu();

      if (this.shouldShowLeft) return this.showLeftMenu();
    }
  }

  hasRightBtns() {
    return (this.props.right && this.props.right.length);
  }

  hasLeftBtns() {
    return (this.props.left && this.props.left.length);
  }

  transformButtonsFromLeftPan(distance) {
    const dist = distance * -1;
    if (this.leftBtnContainerScale > 0) {
      const leftScale = computeHideAnimationCssValue(dist, this.btnsLeftWidthPixels);
      return this.transformLeftButton(leftScale);
    } else {
      if (!this.hasRightBtns()) return;

      const rightFn = computeShowAnimationCssValue;
      const rightScale = rightFn(dist, this.btnsRightWidthPixels);
      return this.transformRightButton(rightScale);
    }
  }

  transformButtonsFromRightPan(distance) {
    const dist = distance;
    if (this.rightBtnContainerScale > 0) {
      const rightScale = computeHideAnimationCssValue(dist, this.btnsRightWidthPixels);
      // const rightScale = Math.max(1 - (dist / this.btnsRightWidthPixels), 0);
      return this.transformRightButton(rightScale);
    }

    if (!this.hasLeftBtns()) return;

    const leftFn = computeShowAnimationCssValue;
    const leftScale = leftFn(dist, this.btnsLeftWidthPixels);
    return this.transformLeftButton(leftScale);
  }

  transformLeftButton(value) {
    if (this.leftBtnContainer && this.rightBtnContainerScale === 0 && this.rightIsVisible === false) {
      this.leftBtnContainerScale = value;
      this.leftBtnContainer.style.transform = `scale3d(${value}, 1, 1)`;
    }
  }

  transformRightButton(value) {
    if (this.rightBtnContainer && this.leftBtnContainerScale === 0 && this.leftIsVisible === false) {
      this.rightBtnContainerScale = value;
      this.rightBtnContainer.style.transform = `scale3d(${value}, 1, 1)`;
    }
  }
  translateOverlayFromLeftPan(value) {
    if (this.overlay) {
      if (this.leftBtnContainerScale > 0) {
        const ongoingTranslate = Math.round(this.overlayTransform * this.leftBtnContainerScale);
        this.overlayTransform = ongoingTranslate;
        this.overlay.style.transform = `translate3d(${ongoingTranslate}px,0px,0px)`;
      } else {
        const correctedValue = (this.leftIsVisible)
          ? Math.max(value, 0)
          : value;

        this.overlayTransform = correctedValue;
        this.overlay.style.transform = `translate3d(${correctedValue}px,0px,0px)`;
      }
    }
  }

  translateOverlayFromRightPan(value) {
    if (this.overlay) {
      if (this.rightBtnContainerScale > 0) {
        const ongoingTranslate = Math.round(this.overlayTransform * this.rightBtnContainerScale);
        this.overlayTransform = ongoingTranslate;
        this.overlay.style.transform = `translate3d(${ongoingTranslate}px,0px,0px)`;
      } else {
        const correctedValue = (this.rightIsVisible)
          ? Math.min(value, 0)
          : value;
        this.overlayTransform = correctedValue;
        this.overlay.style.transform = `translate3d(${correctedValue}px,0px,0px)`;
      }
    }
  }

  translateOverlay(value) {
    if (this.overlay) {
      this.overlayTransform = value;
      this.overlay.style.transform = `translate3d(${value}px,0px,0px)`;
    }
  }

  handleLeftPanWithRightVisible(value) {
    console.log('handleLeftPanWithRightVisible')
    const correctedValue = (this.leftIsVisible)
      ? Math.max(value, 0)
      : Math.min(value, this.currentRightDistance);

    this.currentLeftDistance = correctedValue;
    this.translateOverlay(correctedValue);
    this.transformButtons(correctedValue);
  }

  onRightPan = (evt) => {
    // const dist = this.getAbsDistanceWithVelocity(evt.deltaX, evt.velocityX);
    const dist = this.getAbsDistanceWithVelocity(evt);
    if (dist !== 0) {
      const maxDistance = (this.rightBtnContainerScale > 0)
        ? Math.round(Math.min(dist, this.btnsRightWidthPixels))
        : Math.round(Math.min(dist, this.btnsLeftWidthPixels));

      if (maxDistance !== this.currentRightDistance) {
        this.currentRightDistance = maxDistance;
        this.transformButtonsFromRightPan(maxDistance);
        this.translateOverlayFromRightPan(maxDistance);
      }
    }
  }

  onLeftPan = (evt) => {
    // if (!this.rightBtnContainer && this.leftBtnContainerScale === 0) return;
    const dist = this.getAbsDistanceWithVelocity(evt);
    if (dist !== 0) {
      const maxDistance = (this.leftBtnContainerScale > 0)
        ? Math.round(Math.min(dist, this.btnsLeftWidthPixels) * - 1)
        : Math.round(Math.min(dist, this.btnsRightWidthPixels) * - 1);

      if (maxDistance !== this.currentLeftDistance) {
        this.currentLeftDistance = maxDistance;
        this.transformButtonsFromLeftPan(maxDistance);
        this.translateOverlayFromLeftPan(maxDistance);
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

  // getAbsDistanceWithVelocity(position, velocity) {
  //   return Math.abs(position - this.panStartDelta * (1 + velocity));
  // }

  getAbsDistanceWithVelocity(event) {
    if (event.center.x === 0 && event.center.y === 0) return 0; // hammerjs bug : https://github.com/hammerjs/hammer.js/issues/1132
    const distance = (event.distance - 75);
    const velocity = Math.abs(1 + ((event.velocityX) / 2));
    return distance * velocity;
  }

  handleRightPanWithLeftVisible(value) {
    const correctedValue = Math.max(value, this.currentLeftDistance);
    this.currentRightDistance = correctedValue;
    this.translateOverlay(correctedValue);
    this.transformButtons(correctedValue);
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
    // if (this.bindedEventsVert) {
      // const eventsStringVert = Object.keys(this.bindedEventsVert).join(' ');
      // this.hammerVertical.off(eventsStringVert);
      // this.hammerVertical.destroy();
      // this.bindedEventsVert = false;
    // }

  }

  resetTapEvents() {
    this.containerHammer.off('tap');
    this.containerHammer.destroy();
  }

  resetEvents = () => {
    this.resetTapEvents();
    this.resetSwipeEvents();
  }
  // initBindedEvents2 = () => {
  //   if (this.bindedEventsVert === false) this.bindedEventsVert = {};
  // }
  registerEvent(eventName, second = false) {
    // if (second) {
    //   this.initBindedEvents2();
    //   this.bindedEventsVert[eventName] = true;
    // }
    this.bindedEvents[eventName] = true;
  }

  // initVerticalBlocker = () => {
  //   this.registerEvent('pandown', true);
  //   this.registerEvent('panup', true);
  //   this.hammerVertical.on('panstart', this.onVerticalPanStart);
  //   this.hammerVertical.on('panend', this.onVerticalPanEnd);
  // }

  initEventsFromProps() {
    const events = this.getEvents();
    // console.log('events', events);
    if (events.left || events.right) {
      // console.log('binding pan');
      // this.initVerticalBlocker();

      // this.registerEvent('panstart');
      // this.hammer.on('panstart', this.onHorizontalPanStart);

      this.registerEvent('panend');
      this.hammer.on('panend', this.onHorizontalPanEnd);

      this.registerEvent('panleft');
      this.hammer.on('panleft', this.onLeftPan);

      this.registerEvent('panright');
      this.hammer.on('panright', this.onRightPan);
    }
  }

  initTouchEvents = () => {
    this.containerHammer = new Hammer(this.container);
    this.containerHammer.add(new Hammer.Tap());
    this.containerHammer.on('tap', this.handleContainerClick);

    // console.log('binding hammer', this.overlay);
    this.hammer = new Hammer(this.overlay);
    // this.hammerVertical = new Hammer(this.overlay);
    this.hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 75, touchAction: 'pan-x' });
    // this.hammerVertical.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL, threshold: 2 });
    this.initEventsFromProps();
  }

  computeDomNodeWidths = () => {
    if (this.container && this.container.offsetWidth === this.overlayWidth) return;

    this.overlayWidth = this.container.offsetWidth;
    // this.overlay.style.width = `${this.overlayWidth}px`;

    const { leftLength, rightLength } = this.getNbButtonsBySide();



    this.btnsLeftWidthPixels = (this.isFullWidth && leftLength)
      ? this.overlayWidth
      : (leftLength > 3) ? this.overlayWidth * 0.7 : (this.overlayWidth / 4.5) * leftLength;

    this.btnsRightWidthPixels = (this.isFullWidth && rightLength)
      ? this.overlayWidth
      : (rightLength > 3) ? this.overlayWidth * 0.7 : (this.overlayWidth / 4.5) * rightLength;

    this.threshold = Math.round(this.overlayWidth / 3.3);
  }

  computeCssSizes = () => {
    const { leftLength, rightLength } = this.getNbButtonsBySide();
    const maxWidth = 70;

    const btnsLeftWidthCss = (this.isFullWidth && leftLength)
      ? 100
      : (leftLength > 3) ? maxWidth : 22.2 * leftLength;
    const btnsRightWidthCss = (this.isFullWidth && rightLength)
      ? 100
      : (rightLength > 3) ? maxWidth : 22.2 * rightLength;

    this.leftContainerStyles = { ...SwipeStyles.leftContainerStyles, ...{ width: `${btnsLeftWidthCss}%` }};
    this.rightContainerStyles = { ...SwipeStyles.rightContainerStyles, ...{ width: `${btnsRightWidthCss}%`}};
  }

  initSizes = () => {
    if (this.container) {
      requestAnimationFrame(this.computeDomNodeWidths);
    }
     // else {
    //   requestAnimationFrame(this.initSizes);
    // }
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
      this.initSizes();
      if (this.isLinkedToOthers) this.registerSwipe(this.swipeId, this.resetOverlay);
    }
  }

  componentDidMount() {
    this.update();
  }
  componentDidMount() {
    this.initialize();
  }

  handleBtnClick = (action) => {
    // console.log('action clicked : ', action);
    if (this.shouldCloseAutomatically) this.resetOverlay();
  }
  bindLeftBtnContainer = (c) => {
    this.leftBtnContainer = c;
  }

  generateLeftBtnsOnce = () => {
    if (this.hasCached['leftBtns']) return this.hasCached['leftBtns'];
    const myData = (
      <div
        className="leftBtnContainer"
        key="leftBtnContainer"
        style={this.leftContainerStyles}
        ref={this.bindLeftBtnContainer}
      >
       {
        this.props.left.map((action, index) =>
          <SlidingButton
            key={index}
            onClickCallback={this.handleBtnClick}
            styles={ButtonStyles}
            action={action} />
        )
        }
      </div>
    );
    this.hasCached['leftBtns'] = myData;
    return myData;
  }
  renderLeftButtons() {
    return (this.props.left && this.props.left.length)
    ? this.generateLeftBtnsOnce()
    : null;
  }
  bindRightBtnContainer = (c) => {
    this.rightBtnContainer = c;
  }
  generateRightBtnsOnce = () => {
    if (this.hasCached['rightBtns']) return this.hasCached['rightBtns'];

    const myData = (
      <div
        className="rightBtnContainer"
        key="rightBtnContainer"
        ref={this.bindRightBtnContainer}
        style={this.rightContainerStyles}
      >
        { this.props.right.map(
          (action, index) =>
            <SlidingButton
              action={action}
              key={index}
              styles={ButtonStyles}
              onClickCallback={this.handleBtnClick}
            />
        )}
      </div>
    );
    this.hasCached['rightBtns'] = myData;
    return myData;
  }
  renderRightButtons() {
    return (this.props.right && this.props.right.length)
      ? this.generateRightBtnsOnce()
      : null;
  }

  renderButtons() {
    return (this.hasEvents())
    ? (
      <div className="buttonsContainer">
        {this.renderLeftButtons()}
        {this.renderRightButtons()}
      </div>
    )
    : '';
  }

  handleContainerClick = () => {
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
    this.initSizes();
    this.resetOverlay(false);
  }

  forceRerender() {
    this.setState((state) => ({ forceRender: !state.forceRender}));
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.forceRender !== this.state.forceRender) {
      return true;
    }

    if (this.props.updateKey && (nextProps.updateKey !== this.props.updateKey)) {
      return true;
    }

    if (this.props.doNotReRender === true) return false;
    return true;
  }
  computeStyles() {
    const baseStyles = SwipeStyles.baseSwipeContainerStyles;
    if (!this.props.style) return baseStyles;

    if (this.initStyles) return this.initStyles;
    this.initStyles = {...baseStyles, ...this.props.style };

    return this.initStyles;
  }
  render() {
    const styles = this.computeStyles();
    return (
      <div ref={this.bindContainerRef} className="swipeContainer" style={styles}>
        {this.renderButtons()}

        <div style={SwipeStyles.overlayStyles} className="swipeOverlay" ref={this.bindOverlayRef}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default ButtonActions;
