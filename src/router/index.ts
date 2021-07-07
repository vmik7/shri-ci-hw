import { IRoute } from './types';

import { BuildList } from '../pages/BuildList';
import { BuildDetails } from '../pages/BuildDetails';
import { Settings } from '../pages/Settings';
import { Start } from '../pages/Start';

import { fetchBuilds } from '../store/buildsSlice';
import { runFetchBuildById } from '../store/buildSlice';
import { fetchSettings } from '../store/settingsSlice';

export const routes: IRoute[] = [
    {
        path: '/',
        component: BuildList,
        contentClass: 'app__content',
        loadData: () => fetchBuilds(),
    },
    {
        path: '/start',
        component: Start,
        contentClass: 'app__content app__content_center',
        loadData: () => {},
    },
    {
        path: '/build/:id',
        component: BuildDetails,
        contentClass: 'app__content',
        loadData: (id) => runFetchBuildById(id),
    },
    {
        path: '/settings',
        component: Settings,
        contentClass: 'app__content',
        loadData: () => fetchSettings(),
    },
];
