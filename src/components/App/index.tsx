import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Routes } from '../../constants';

import Footer from '../Footer';
import BuildList from '../BuildList';
import BuildDetails from '../BuildDetails';
import Settings from '../Settings';
import Start from '../Start';

import './style.scss';

export default function App() {
    return (
        <div className="app">
            <Switch>
                <Route
                    exact
                    path={Routes.startScreen}
                    render={() => (
                        <Start
                            contentClass={[
                                'app__content',
                                'app__content_center',
                            ]}
                        />
                    )}
                />

                <Route
                    exact
                    path="/"
                    render={() => <BuildList contentClass={['app__content']} />}
                />

                <Route
                    path={Routes.buildDetails}
                    render={() => (
                        <BuildDetails contentClass={['app__content']} />
                    )}
                />

                <Route
                    path={Routes.settings}
                    render={() => <Settings contentClass={['app__content']} />}
                />
            </Switch>
            <div className="app__footer">
                <Footer />
            </div>
        </div>
    );
}
