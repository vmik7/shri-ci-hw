import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchBuildById = createAsyncThunk(
    'buildById/fetch',
    async (id, { extra: { api } }) => {
        const { data } = await api.buildById(id);
        const logs = `[2K[1G[1myarn run v1.22.5[22m
    [2K[1G[2m$ webpack --config webpack/production.js --color[22m
    /Users/fedinamid/Workspace/webpack-config/webpack
    Hash: [1m2a88f51a3c1cffdbdac8[39m[22m
    Version: webpack [1m4.44.1[39m[22m
    Time: [1m65[39m[22mms
    Built at: 06/19/2021 [1m3:08:51 AM[39m[22m
        [1mAsset[39m[22m       [1mSize[39m[22m  [1mChunks[39m[22m  [1m[39m[22m                 [1m[39m[22m[1mChunk Names[39m[22m
        [1m[32mmain.js[39m[22m  963 bytes       [1m0[39m[22m  [1m[32m[emitted][39m[22m        main
    [1m[32mmain.js.map[39m[22m   4.52 KiB       [1m0[39m[22m  [1m[32m[emitted] [dev][39m[22m  main
    Entrypoint [1mmain[39m[22m = [1m[32mmain.js[39m[22m [1m[32mmain.js.map[39m[22m
    [0] [1m./src/index.js[39m[22m 1 bytes {[1m[33m0[39m[22m}[1m[32m [built][39m[22m
    [2K[1GDone in 0.84s.
`;
        // const { data: logs } = await api.buildLogsById(id);
        return { data, logs };
    },
);

export const fetchRebuild = createAsyncThunk(
    'buildById/rebuild',
    async (hash, { extra: { api } }) => {
        return await api.pushBuild(hash);
    },
);
export const runRebuild = (hash) => fetchRebuild(hash);

export const buildSlice = createSlice({
    name: 'buildById',
    initialState: {
        rebuildId: null,
    },
    reducers: {
        openRebuild(state, action) {
            state.rebuildId = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBuildById.fulfilled, (state, action) => {
                state[action.payload.data.id] = action.payload;
            })
            .addCase(fetchRebuild.fulfilled, (state, action) => {
                state.rebuildId = action.payload.data.id;
            });
    },
});

export const getBuildById = (id) => (state) => state.buildById[id];
export const getRebuildId = () => (state) => state.buildById.rebuildId;

export const { reducer: buildByIdReducer } = buildSlice;

export const { openRebuild } = buildSlice.actions;
