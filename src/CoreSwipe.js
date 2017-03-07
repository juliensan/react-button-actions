import React, { Component, PropTypes } from 'react';
const _compCallbacks = {};

class SwipeJS extends Component {

  constructor(props) {
    super(props);
  }

  closeSwipes(filteredId) {
    Object.keys(_compCallbacks)
      .filter((callbackId) => callbackId !== `${filteredId}`)
      .forEach((idToClose) => _compCallbacks[idToClose].call());
  }

  registerSwipe(id, callback) {
    _compCallbacks[id] = callback;
    console.log('added :', _compCallbacks);
  }

  unRegisterSwipe(id) {
    delete _compCallbacks[id];
    console.log('removed : ', _compCallbacks);
  }

}

export default SwipeJS;