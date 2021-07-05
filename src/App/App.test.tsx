import { it, expect } from '@jest/globals';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import App from '.';
import { store } from '../store';
import { render, screen } from '@testing-library/react';

it('по корневому запросу открывается список сборок', () => {
    const history = createBrowserHistory();
    history.push('/');

    const app = (
        <Router history={history}>
            <Provider store={store}>
                <App />
            </Provider>
        </Router>
    );

    const { getByTestId } = render(app);
    getByTestId('build-list');
});

it('по запросу /settings открывается страница настроек', () => {
    const history = createBrowserHistory();
    history.push('/settings');

    const app = (
        <Router history={history}>
            <Provider store={store}>
                <App />
            </Provider>
        </Router>
    );

    const { getByTestId } = render(app);
    getByTestId('settings');
});

it('по запросу /start открывается стартовый экран', () => {
    const history = createBrowserHistory();
    history.push('/start');

    const app = (
        <Router history={history}>
            <Provider store={store}>
                <App />
            </Provider>
        </Router>
    );

    const { getByTestId } = render(app);
    getByTestId('start');
});

it('по запросу /build/some_id открывается стартовый экран', () => {
    const history = createBrowserHistory();
    history.push('/build/some_id');

    const app = (
        <Router history={history}>
            <Provider store={store}>
                <App />
            </Provider>
        </Router>
    );

    const { getByTestId } = render(app);
    getByTestId('build-details');
});
