import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchBuilds = createAsyncThunk(
    'builds/fetch',
    async (_, { extra: { api } }) => {
        const response = await api.buildList();
        return response.data;
    },
);

export const buildsSlice = createSlice({
    name: 'builds',
    initialState: null,
    extraReducers: (builder) => {
        builder.addCase(fetchBuilds.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});

export const getBuilds = (state) => state.builds;

export const { reducer: buildsReducer } = buildsSlice;
