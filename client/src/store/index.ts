import { configureStore } from '@reduxjs/toolkit';

import { Api } from '../api/index';

const testModeQuery = 'test_mode';

import {
    buildDetailsSliceName,
    buildDetailsReducer,
} from './buildDetailsSlice';
import { buildsSliceName, buildsReducer } from './buildsSlice';
import { newBuildSliceName, newBuillReducer } from './newBuildSlice';
import { settingsSliceName, settingsReducer } from './settingsSlice';

const params = new URLSearchParams(document.location.search);
const testMode = !!params.get(testModeQuery);

export const store = configureStore({
    reducer: {
        [buildsSliceName]: buildsReducer,
        [buildDetailsSliceName]: buildDetailsReducer,
        [settingsSliceName]: settingsReducer,
        [newBuildSliceName]: newBuillReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: { extraArgument: { api: new Api(testMode) } },
        }),
});
