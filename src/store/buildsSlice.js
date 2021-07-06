import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { setHash } from './newBuildSlice';

const buildsCountToLoad = 5;

export const fetchBuilds = createAsyncThunk(
    'builds/fetch',
    async (_, { extra: { api }, dispatch }) => {
        const { data } = await api.buildList({
            limit: buildsCountToLoad,
            offset: 0,
        });
        if (data.length === 0) {
            dispatch(allLoaded());
        }

        dispatchEvent(new Event('buildListLoaded'));

        return data;
    },
);

export const moreBuilds = createAsyncThunk(
    'builds/more',
    async (_, { extra: { api }, getState, dispatch }) => {
        dispatchEvent(new Event('showMoreButtonPressed'));

        const { data } = await api.buildList({
            limit: buildsCountToLoad,
            offset: getState().builds.data.length,
        });
        if (data.length === 0) {
            dispatch(allLoaded());
        }
        return data;
    },
);

export const buildsSlice = createSlice({
    name: 'builds',
    initialState: {
        data: [],
        isLoading: false,
        isAllLoaded: false,
        isModalOpen: false,
    },
    reducers: {
        allLoaded(state) {
            state.isAllLoaded = true;
        },
        openModal(state) {
            state.isModalOpen = true;
        },
        closeModal(state) {
            state.isModalOpen = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBuilds.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchBuilds.fulfilled, (state, action) => {
                state.data = action.payload;
                state.isLoading = false;
            })
            .addCase(moreBuilds.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(moreBuilds.fulfilled, (state, action) => {
                state.data.push(...action.payload);
                state.isLoading = false;
            });
    },
});

export const getBuilds = (state) => state.builds;

export const { allLoaded, openModal, closeModal } = buildsSlice.actions;

export const { reducer: buildsReducer } = buildsSlice;
