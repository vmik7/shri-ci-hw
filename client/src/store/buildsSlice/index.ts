import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AsyncThunkConfig, RootState } from '../types';
import { Build } from '../../api/types';

import { IBuildsState } from './types';

export const buildsSliceName = 'builds';

const buildsCountToLoad = 10;

const initialState: IBuildsState = {
    data: [],

    isLoading: false,
    isLoaded: false,
    isAllLoaded: false,
    loadError: null,

    isModalOpen: false,
};

export const fetchBuilds = createAsyncThunk<Build[], void, AsyncThunkConfig>(
    `${buildsSliceName}/fetch`,
    async (_, { extra: { api }, dispatch }) => {
        const { data } = await api.getBuildList({
            limit: buildsCountToLoad,
            offset: 0,
        });

        if (data.length === 0) {
            dispatch(allLoaded());
        }

        /** Custom metric: buildListLoaded */
        dispatchEvent(new Event('buildListLoaded'));

        return data;
    },
);

export const moreBuilds = createAsyncThunk<Build[], void, AsyncThunkConfig>(
    `${buildsSliceName}/more`,
    async (_, { extra: { api }, getState, dispatch }) => {
        /** Custom metric: showMoreButtonPressed */
        dispatchEvent(new Event('showMoreButtonPressed'));

        const { data } = await api.getBuildList({
            limit: buildsCountToLoad,
            offset: getState()[buildsSliceName].data.length,
        });

        if (data.length === 0) {
            dispatch(allLoaded());
        }

        return data;
    },
);

export const buildsSlice = createSlice({
    name: buildsSliceName,
    initialState,

    reducers: {
        allLoaded(state: IBuildsState) {
            state.isAllLoaded = true;
        },
        openModal(state: IBuildsState) {
            state.isModalOpen = true;
        },
        closeModal(state: IBuildsState) {
            state.isModalOpen = false;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchBuilds.pending, (state: IBuildsState) => {
                state.isLoading = true;
                state.isLoaded = false;
                state.isAllLoaded = false;
                state.loadError = null;
            })
            .addCase(
                fetchBuilds.fulfilled,
                (state: IBuildsState, action: PayloadAction<Build[]>) => {
                    state.data = action.payload;
                    state.isLoading = false;
                    state.isLoaded = true;
                },
            )
            .addCase(fetchBuilds.rejected, (state: IBuildsState) => {
                state.isLoading = false;
                state.loadError = 'Ошибка запроса';
            })

            .addCase(moreBuilds.pending, (state: IBuildsState) => {
                state.isLoading = true;
                state.isLoaded = false;
                state.loadError = null;
            })
            .addCase(
                moreBuilds.fulfilled,
                (state: IBuildsState, action: PayloadAction<Build[]>) => {
                    state.data.push(...action.payload);
                    state.isLoading = false;
                    state.isLoaded = true;
                },
            )
            .addCase(moreBuilds.rejected, (state: IBuildsState) => {
                state.isLoading = false;
                state.loadError = 'Ошибка запроса';
            });
    },
});

/** Reducer */

export const { reducer: buildsReducer } = buildsSlice;

/** Selectors */

export const getBuilds = () => (state: RootState) => state[buildsSliceName];

/** Actions */

export const { allLoaded, openModal, closeModal } = buildsSlice.actions;
