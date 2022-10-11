import React from 'react';
import ReactDOM from 'react-dom';
// import './assets/style.css';
import ChatRoot from './conversation/App';
import VideoRoot from './video/App'
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<ChatRoot />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
