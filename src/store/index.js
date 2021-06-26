import { configureStore } from '@reduxjs/toolkit';

import { Api } from '../api';
import { buildByIdReducer } from './buildSlice';
import { buildsReducer } from './buildsSlice';
import { settingsReducer } from './settingsSlice';

export const store = configureStore({
    reducer: {
        builds: buildsReducer,
        buildById: buildByIdReducer,
        settings: settingsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: { extraArgument: { api: new Api() } },
        }),
});
