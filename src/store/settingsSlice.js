import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchSettings = createAsyncThunk(
    'settings/fetch',
    async (_, { extra: { api } }) => {
        const { data } = await api.getSettings();

        dispatchEvent(new Event('settingsLoaded'));

        return {
            repoName: data.repoName,
            buildCommand: data.buildCommand,
            mainBranch: data.mainBranch,
            period: data.period,
        };
    },
);

export const setSettings = createAsyncThunk(
    'settings/set',
    async (_, { extra: { api }, getState }) => {
        const response = await api.setSettings(getState().settings.data);
        return response;
    },
);

export const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        data: {},
        isSaving: false,
        isSaved: false,
        saveError: null,
    },
    reducers: {
        setRepoName(state, action) {
            state.data.repoName = action.payload;
            state.isSaved = false;
            state.saveError = null;
        },
        setBuildCommand(state, action) {
            state.data.buildCommand = action.payload;
            state.isSaved = false;
            state.saveError = null;
        },
        setMainBranch(state, action) {
            state.data.mainBranch = action.payload;
            state.isSaved = false;
            state.saveError = null;
        },
        setPeriod(state, action) {
            state.data.period = action.payload;
            state.isSaved = false;
            state.saveError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSettings.fulfilled, (state, action) => {
                state.data = action.payload;
                state.isSaved = true;
            })
            .addCase(setSettings.pending, (state, action) => {
                state.isSaving = true;
            })
            .addCase(setSettings.fulfilled, (state, action) => {
                state.isSaving = false;
                if (action.payload.isSaved) {
                    state.isSaved = true;
                    state.saveError = null;
                } else {
                    state.isSaved = false;
                    state.saveError = action.payload.errorMessage;
                }
            });
    },
});

export const getSettingsData = () => (state) => state.settings.data;
export const getSavingStatus = () => (state) => {
    return {
        isSaving: state.settings.isSaving,
        isSaved: state.settings.isSaved,
    };
};
export const getSavingErrorData = () => (state) => state.settings.saveError;

export const { setRepoName, setBuildCommand, setMainBranch, setPeriod } =
    settingsSlice.actions;

export const { reducer: settingsReducer } = settingsSlice;
