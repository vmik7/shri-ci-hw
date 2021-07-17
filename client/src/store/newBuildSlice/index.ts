import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BuildRequestResult } from '../../api';
import { AsyncThunkConfig, RootState } from '../types';
import { INewBuildState } from './types';

export const newBuildSliceName = 'newBuild';

const initialState: INewBuildState = {
    hash: '',

    isSubmitting: false,
    isSubmitted: false,
    submitError: null,

    data: null,
};

export const postBuild = createAsyncThunk<
    BuildRequestResult,
    void,
    AsyncThunkConfig
>(`${newBuildSliceName}/push`, async (_, { extra: { api }, getState }) => {
    return api.newBuild({ commitHash: getState()[newBuildSliceName].hash });
});

export const newBuildSlice = createSlice({
    name: newBuildSliceName,
    initialState,

    reducers: {
        setHash(store, action: PayloadAction<string>) {
            store.hash = action.payload;
        },
        nullSubmitError(store) {
            store.submitError = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(postBuild.pending, (state: INewBuildState) => {
                state.isSubmitting = true;
                state.isSubmitted = false;
                state.submitError = null;
            })
            .addCase(
                postBuild.fulfilled,
                (
                    state: INewBuildState,
                    action: PayloadAction<BuildRequestResult>,
                ) => {
                    state.isSubmitting = false;
                    state.data = action.payload;
                    state.isSubmitted = true;
                },
            )
            .addCase(postBuild.rejected, (state: INewBuildState) => {
                state.isSubmitting = false;
                state.submitError = 'Ошибка запроса';
            });
    },
});

/** Reducer */

export const { reducer: newBuillReducer } = newBuildSlice;

/** Selectors */

export const getHash = () => (state: RootState) =>
    state[newBuildSliceName].hash;

export const getNewBuildData = () => (state: RootState) =>
    state[newBuildSliceName].data;

export const getSubmittingStatus = () => (state: RootState) => {
    return {
        isSubmitting: state[newBuildSliceName].isSubmitting,
        isSubmitted: state[newBuildSliceName].isSubmitted,
        submitError: state[newBuildSliceName].submitError,
    };
};

/** Actions */

export const { setHash, nullSubmitError } = newBuildSlice.actions;
