import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BuildPostResponse, BuildPostResult } from '../../api/types';
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
    BuildPostResponse,
    void,
    AsyncThunkConfig
>(`${newBuildSliceName}/push`, async (_, { extra: { api }, getState }) => {
    return api.postBuild({ commitHash: getState()[newBuildSliceName].hash });
});

export const newBuildSlice = createSlice({
    name: newBuildSliceName,
    initialState,

    reducers: {
        setHash(store, action: PayloadAction<string>) {
            store.hash = action.payload;
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
                    action: PayloadAction<BuildPostResponse>,
                ) => {
                    state.isSubmitting = false;
                    if (action.payload.isAdded) {
                        state.data = action.payload.data || null;
                        state.isSubmitted = true;
                    } else if (action.payload.errorMessage) {
                        state.submitError = action.payload.errorMessage;
                    }
                },
            )
            .addCase(postBuild.rejected, (state: INewBuildState) => {
                state.isSubmitting = false;
                state.submitError = 'Ошибка запроса';
            });
    },
});

/** Reducer */

export const { setHash } = newBuildSlice.actions;

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

export const { reducer: newBuillReducer } = newBuildSlice;
