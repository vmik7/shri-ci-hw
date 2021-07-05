import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchBuildById = createAsyncThunk(
    'buildById/fetch',
    async (id, { extra: { api } }) => {
        const { data } = await api.buildById(id);
        const { data: logs } = await api.buildLogsById(id);
        return { data, logs };
    },
);

export const fetchRebuild = createAsyncThunk(
    'buildById/rebuild',
    async ({ hash, history }, { extra: { api } }) => {
        const response = await api.pushBuild(hash);
        history.push(`/build/${response.data.id}`);
        return response;
    },
);
export const runRebuild = ({ hash, history }) =>
    fetchRebuild({ hash, history });

export const buildSlice = createSlice({
    name: 'buildById',
    initialState: {},
    extraReducers: (builder) => {
        builder.addCase(fetchBuildById.fulfilled, (state, action) => {
            state[action.payload.data.id] = action.payload;
        });
    },
});

export const getBuildById = (id) => (state) => state.buildById[id];

export const { reducer: buildByIdReducer } = buildSlice;

export const { openRebuild } = buildSlice.actions;
