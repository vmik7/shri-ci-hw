import { configureStore } from '@reduxjs/toolkit';

import { Api } from '../api/index.ts';
import { buildByIdReducer } from './buildSlice';
import { buildsReducer } from './buildsSlice';
import { newBuillReducer } from './newBuildSlice';
import { settingsReducer } from './settingsSlice';

export const store = configureStore({
    reducer: {
        builds: buildsReducer,
        buildById: buildByIdReducer,
        settings: settingsReducer,
        newBuild: newBuillReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: { extraArgument: { api: new Api() } },
        }),
});
