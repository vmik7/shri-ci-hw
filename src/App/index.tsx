import { FC } from 'react';
import { Switch, Route } from 'react-router-dom';

import { cn } from '../common';
import { routes } from '../router';

import { Footer } from '../components/Footer';

import './style.scss';

export const App: FC = () => {
    const cnApp = cn('app');

    return (
        <div className={cnApp()}>
            <Switch>
                {routes.map((route) => (
                    <Route exact path={route.path} key={route.path}>
                        <route.component
                            loadData={route.loadData}
                            contentClass={route.contentClass}
                        />
                    </Route>
                ))}
            </Switch>
            <Footer extraClasses={cnApp('footer')} />
        </div>
    );
};
