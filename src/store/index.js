import { configureStore } from '@reduxjs/toolkit';

import { Api } from '../api/index.ts';
import { buildByIdReducer } from './buildSlice';
import { buildsReducer } from './buildsSlice';
import { newBuillReducer } from './newBuildSlice';
import { settingsReducer } from './settingsSlice';
import { testModeQuery } from '../server/config';

const params = new URLSearchParams(document.location.search);
const testMode = !!params.get(testModeQuery);

export const store = configureStore({
    reducer: {
        builds: buildsReducer,
        buildById: buildByIdReducer,
        settings: settingsReducer,
        newBuild: newBuillReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: { extraArgument: { api: new Api(testMode) } },
        }),
});
