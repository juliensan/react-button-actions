import React from 'react';
import ReactDOM from 'react-dom';
import Perf from 'react-addons-perf';
window.Perf = Perf;

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import Example from './Example';


ReactDOM.render(
  <Example />,
  document.getElementById('app')
);