import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { routes } from '../../router';

import Footer from '../Footer';

import './style.scss';

export default function App() {
    return (
        <div className="app">
            <Switch>
                {routes.map((route) => (
                    <Route exact path={route.path} key={route.path}>
                        <route.component
                            // loadData={route.loadData}
                            contentClass={route.contentClass}
                        />
                    </Route>
                ))}
            </Switch>
            <div className="app__footer">
                <Footer />
            </div>
        </div>
    );
}
