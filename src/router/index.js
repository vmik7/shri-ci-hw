import BuildList from '../components/BuildList';
import BuildDetails from '../components/BuildDetails';
import Settings from '../components/Settings';
import Start from '../components/Start';

// import { fetchArticles } from '../store/articlesSlice';
// import { fetchArticleById } from '../store/articleSlice';

export const routes = [
    {
        path: '/',
        component: BuildList,
        contentClass: ['app__content'],
        // loadData: () => fetchArticles(),
    },
    {
        path: '/start',
        component: Start,
        contentClass: ['app__content', 'app__content_center'],
        // loadData: () => fetchArticles(),
    },
    {
        path: '/build/:number',
        component: BuildDetails,
        contentClass: ['app__content'],
        // loadData: ({ id }) => fetchArticleById(id),
    },
    {
        path: '/settings',
        component: Settings,
        contentClass: ['app__content'],
        // loadData: ({ id }) => fetchArticleById(id),
    },
];
