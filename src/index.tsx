import React from 'react';
import ReactDOM from 'react-dom';

import { Router } from 'react-router-dom';

import { Provider } from 'react-redux';
import { store } from './store';
import history from './router/history';

import App from './components/App';

import './nullstyle.css';
import './index.scss';

ReactDOM.render(
    <Router history={history}>
        <Provider store={store}>
            <App />
        </Provider>
    </Router>,
    document.getElementById('root'),
);
