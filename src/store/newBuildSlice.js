import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const pushBuild = createAsyncThunk(
    'newBuild/push',
    async (_, { extra: { api }, getState }) => {
        return api.pushBuild(getState().newBuild.hash);
    },
);

export const newBuildSlice = createSlice({
    name: 'newBuild',
    initialState: {
        hash: '',
        isSubmiting: false,
        isSubmitError: false,
        newBuildId: null,
        submitError: null,
    },
    reducers: {
        setHash(store, action) {
            store.hash = action.payload;
            store.isSubmitError = false;
            store.submitError = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(pushBuild.pending, (state, action) => {
            state.isSubmiting = true;
            state.isSubmitError = false;
        });
        builder.addCase(pushBuild.fulfilled, (state, action) => {
            state.isSubmiting = false;
            if (action.payload.isAdded) {
                state.isSubmitError = false;
                state.newBuildId = action.payload.data.id;
            } else {
                state.isSubmitError = true;
                state.submitError = action.payload.errorMessage;
            }
        });
    },
});

export const getNewBuildData = (state) => state.newBuild;

export const { reducer: newBuillReducer } = newBuildSlice;

export const { setHash } = newBuildSlice.actions;
