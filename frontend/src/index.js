import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import './UIKit/styles/index.scss';
import './UIKit/styles/fontello.scss';
import App from './App';
import './i18n';
import {Resource} from './Resources/Resource';
import {Config} from "./Config";

Resource.init(Config.backend);

ReactDOM.render(<App/>, document.getElementById('root'));
