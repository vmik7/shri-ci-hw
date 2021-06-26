import BuildList from '../components/BuildList';
import BuildDetails from '../components/BuildDetails';
import Settings from '../components/Settings';
import Start from '../components/Start';

import { fetchBuilds } from '../store/buildsSlice';
import { fetchBuildById } from '../store/buildSlice';
import { fetchSettings } from '../store/settingsSlice';

export const routes = [
    {
        path: '/',
        component: BuildList,
        contentClass: ['app__content'],
        loadData: () => fetchBuilds(),
    },
    {
        path: '/start',
        component: Start,
        contentClass: ['app__content', 'app__content_center'],
        loadData: () => {},
    },
    {
        path: '/build/:id',
        component: BuildDetails,
        contentClass: ['app__content'],
        loadData: (id) => fetchBuildById(id),
    },
    {
        path: '/settings',
        component: Settings,
        contentClass: ['app__content'],
        loadData: () => fetchSettings(),
    },
];
