import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState, AsyncThunkConfig } from '../types';
import { Build, BuildPostResponse } from '../../api/types';
import { History } from '../../common/types';
import { IBuildDetailsState } from './types';

export const buildDetailsSliceName = 'buildDetails';

const initialState: IBuildDetailsState = {
    data: {},
    logs: {},

    isLoading: false,
    isLoaded: false,
    loadError: null,

    rebuild: null,

    isRebuilding: false,
    isRebuilded: false,
    rebuildError: null,
};

export const fetchBuildById = createAsyncThunk<
    { data: Build; logs: string },
    string,
    AsyncThunkConfig
>(`${buildDetailsSliceName}/fetch`, async (id, { extra: { api } }) => {
    const { data } = await api.getBuildById(id);
    const { data: logs } = await api.getBuildLogs(id);
    return { data, logs };
});

export const fetchRebuild = createAsyncThunk<
    { response: BuildPostResponse; history: History },
    { hash: string; history: History },
    AsyncThunkConfig
>(
    `${buildDetailsSliceName}/rebuild`,
    async ({ hash, history }, { extra: { api } }) => {
        const response = await api.postBuild({ commitHash: hash });
        return { response, history };
    },
);

export const buildSlice = createSlice({
    name: buildDetailsSliceName,
    initialState,

    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchBuildById.pending, (state: IBuildDetailsState) => {
                state.isLoading = true;
                state.isLoaded = false;
                state.loadError = null;
            })
            .addCase(
                fetchBuildById.fulfilled,
                (
                    state: IBuildDetailsState,
                    action: PayloadAction<{ data: Build; logs: string }>,
                ) => {
                    const { data, logs } = action.payload;

                    state.data[data.id] = data;
                    state.logs[data.id] = logs;

                    state.isLoading = false;
                    state.isLoaded = true;
                },
            )
            .addCase(fetchBuildById.rejected, (state: IBuildDetailsState) => {
                state.isLoading = false;
                state.loadError = 'Ошибка запроса данных';
            })

            .addCase(fetchRebuild.pending, (state: IBuildDetailsState) => {
                state.isRebuilding = true;
                state.isRebuilded = false;
                state.rebuildError = null;
            })
            .addCase(
                fetchRebuild.fulfilled,
                (
                    state: IBuildDetailsState,
                    action: PayloadAction<{
                        response: BuildPostResponse;
                        history: History;
                    }>,
                ) => {
                    state.isRebuilding = false;

                    const { response, history } = action.payload;

                    if (response.isAdded && response.data) {
                        state.rebuild = response.data || null;
                        state.isRebuilded = true;

                        history.push(`/build/${state.rebuild.id}`);
                    } else if (response.errorMessage) {
                        state.rebuildError = response.errorMessage;
                    }
                },
            )
            .addCase(fetchRebuild.rejected, (state: IBuildDetailsState) => {
                state.isRebuilding = false;
                state.rebuildError = 'Ошибка запроса на повторную сборку';
            });
    },
});

/** Reducer */

export const { reducer: buildDetailsReducer } = buildSlice;

/** Selectors */

export const getBuildById = (id: string) => (state: RootState) => {
    return {
        data: state[buildDetailsSliceName].data[id],
        logs: state[buildDetailsSliceName].logs[id],
    };
};

export const getRebuildData = () => (state: RootState) =>
    state[buildDetailsSliceName].rebuild;

export const getLoadStatus = () => (state: RootState) => {
    return {
        isLoading: state[buildDetailsSliceName].isLoading,
        isLoaded: state[buildDetailsSliceName].isLoaded,
        loadError: state[buildDetailsSliceName].loadError,
    };
};

export const getRebuilStatus = () => (state: RootState) => {
    return {
        isRebuilding: state[buildDetailsSliceName].isRebuilding,
        isRebuilded: state[buildDetailsSliceName].isRebuilded,
        rebuildError: state[buildDetailsSliceName].rebuildError,
    };
};
