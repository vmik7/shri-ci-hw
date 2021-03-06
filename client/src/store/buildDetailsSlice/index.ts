import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState, AsyncThunkConfig } from '../types';
import { Build, BuildRequestResult } from '../../api';
import { History } from '../../common/types';
import { IBuildDetailsState, LogThunkResult } from './types';

export const buildDetailsSliceName = 'buildDetails';

const initialState: IBuildDetailsState = {
    data: {},
    logs: {},

    isLoading: false,
    isLoaded: false,
    loadError: null,

    isLogsLoading: false,
    isLogsLoaded: false,
    loadLogsError: null,

    rebuild: null,

    isRebuilding: false,
    isRebuilded: false,
    rebuildError: null,
};

export const fetchBuildById = createAsyncThunk<Build, string, AsyncThunkConfig>(
    `${buildDetailsSliceName}/fetch`,
    (id, { extra: { api } }) => {
        return api.getBuildById({ buildId: id });
    },
);

export const fetchLogById = createAsyncThunk<
    LogThunkResult,
    string,
    AsyncThunkConfig
>(`${buildDetailsSliceName}/logs`, async (id, { extra: { api } }) => {
    const log = await api.getBuildLogById({ buildId: id });
    return { id, log };
});

export const fetchRebuild = createAsyncThunk<
    BuildRequestResult,
    string,
    AsyncThunkConfig
>(`${buildDetailsSliceName}/rebuild`, (hash, { extra: { api } }) => {
    return api.newBuild({ commitHash: hash });
});

export const buildSlice = createSlice({
    name: buildDetailsSliceName,
    initialState,

    reducers: {
        nullRebuildError(state: IBuildDetailsState) {
            state.rebuildError = null;
        },
        nullRebuildData(state: IBuildDetailsState) {
            state.rebuild = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchBuildById.pending, (state: IBuildDetailsState) => {
                state.isLoading = true;
                state.isLoaded = false;
                state.loadError = null;
            })
            .addCase(
                fetchBuildById.fulfilled,
                (state: IBuildDetailsState, action: PayloadAction<Build>) => {
                    const buildData = action.payload;

                    state.data[buildData.id] = buildData;

                    state.isLoading = false;
                    state.isLoaded = true;
                },
            )
            .addCase(fetchBuildById.rejected, (state: IBuildDetailsState) => {
                state.isLoading = false;
                state.loadError = '???????????? ?????????????? ????????????';
            })

            .addCase(fetchLogById.pending, (state: IBuildDetailsState) => {
                state.isLogsLoading = true;
                state.isLogsLoaded = false;
                state.loadLogsError = null;
            })
            .addCase(
                fetchLogById.fulfilled,
                (
                    state: IBuildDetailsState,
                    action: PayloadAction<LogThunkResult>,
                ) => {
                    const { id, log } = action.payload;

                    state.logs[id] = log;

                    state.isLogsLoading = false;
                    state.isLogsLoaded = true;
                },
            )
            .addCase(fetchLogById.rejected, (state: IBuildDetailsState) => {
                state.isLogsLoading = false;
                state.loadLogsError = '???????????? ?????????????? logs';
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
                    action: PayloadAction<BuildRequestResult>,
                ) => {
                    state.isRebuilding = false;

                    state.rebuild = action.payload;
                    state.isRebuilded = true;
                },
            )
            .addCase(fetchRebuild.rejected, (state: IBuildDetailsState) => {
                state.isRebuilding = false;
                state.rebuildError = '???????????? ?????????????? ???? ?????????????????? ????????????';
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

/** Actions */

export const { nullRebuildError, nullRebuildData } = buildSlice.actions;
