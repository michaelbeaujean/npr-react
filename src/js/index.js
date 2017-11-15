var React = require('react');
var ReactDOM = require('react-dom');

const css = require('./../sass/style.scss')

import { BurstList } from './components/BurstList';

ReactDOM.render(
	<BurstList />,
	document.getElementById('burstList')
);