import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { setHash } from './newBuildSlice';

const buildsCountToLoad = 5;

export const fetchBuilds = createAsyncThunk(
    'builds/fetch',
    async (_, { extra: { api }, getState, dispatch }) => {
        const { data } = await api.buildList({
            limit: buildsCountToLoad,
            offset: getState().builds.data.length || 0,
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
        allLoaded(state, action) {
            state.isAllLoaded = true;
        },
        openModal(state, action) {
            state.isModalOpen = true;
        },
        closeModal(state, action) {
            state.isModalOpen = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchBuilds.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(fetchBuilds.fulfilled, (state, action) => {
            state.data.push(...action.payload);
            state.isLoading = false;
        });
    },
});

export const getBuilds = (state) => state.builds;

export const { allLoaded, openModal, closeModal } = buildsSlice.actions;

export const { reducer: buildsReducer } = buildsSlice;
