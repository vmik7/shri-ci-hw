import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Configuration } from '../../api';
import { AsyncThunkConfig, RootState } from '../types';
import { ISettingsState } from './types';

export const settingsSliceName = 'settings';

const initialState: ISettingsState = {
    data: {
        id: '',
        repoName: '',
        buildCommand: 'npm run build',
        mainBranch: 'main',
        period: 10,
    },

    isLoading: false,
    isLoaded: false,
    loadError: null,

    isSaving: false,
    isSaved: false,
    saveError: null,
};

export const fetchSettings = createAsyncThunk<
    Configuration,
    void,
    AsyncThunkConfig
>(`${settingsSliceName}/fetch`, async (_, { extra: { api } }) => {
    const config = await api.getSettings();

    /** Custom metric: settingsLoaded */
    dispatchEvent(new Event('settingsLoaded'));

    return config;
});

export const setSettings = createAsyncThunk<void, void, AsyncThunkConfig>(
    `${settingsSliceName}/post`,
    async (_, { extra: { api }, getState }) => {
        const settingsData = getState()[settingsSliceName].data;
        return api.postSettings({
            repoName: settingsData.repoName,
            buildCommand: settingsData.buildCommand,
            mainBranch: settingsData.mainBranch,
            period: settingsData.period,
        });
    },
);

export const settingsSlice = createSlice({
    name: settingsSliceName,
    initialState,

    reducers: {
        setRepoName(state: ISettingsState, action: PayloadAction<string>) {
            state.data.repoName = action.payload;
            state.isSaved = false;
        },
        setBuildCommand(state: ISettingsState, action: PayloadAction<string>) {
            state.data.buildCommand = action.payload;
            state.isSaved = false;
        },
        setMainBranch(state: ISettingsState, action: PayloadAction<string>) {
            state.data.mainBranch = action.payload;
            state.isSaved = false;
        },
        setPeriod(state: ISettingsState, action: PayloadAction<number>) {
            state.data.period = action.payload;
            state.isSaved = false;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchSettings.pending, (state: ISettingsState) => {
                state.isLoading = true;
                state.isLoaded = false;
                state.loadError = null;

                state.isSaved = false;
            })
            .addCase(
                fetchSettings.fulfilled,
                (
                    state: ISettingsState,
                    action: PayloadAction<Configuration>,
                ) => {
                    state.data = action.payload;

                    state.isLoading = false;
                    state.isLoaded = true;

                    state.isSaved = true;
                },
            )
            .addCase(fetchSettings.rejected, (state: ISettingsState) => {
                state.isLoading = false;
                state.loadError = 'Ошибка при загрузке настроек';
            })

            .addCase(setSettings.pending, (state: ISettingsState) => {
                state.isSaving = true;
                state.isSaved = false;
                state.saveError = null;
            })
            .addCase(setSettings.fulfilled, (state: ISettingsState) => {
                state.isSaving = false;
                state.isSaved = true;
            })
            .addCase(setSettings.rejected, (state: ISettingsState) => {
                state.isSaving = false;
                state.saveError = 'Ошибка сохранения настроек';
            });
    },
});

/** Reducer */

export const { reducer: settingsReducer } = settingsSlice;

/** Selectors */

export const getRepoName = () => (state: RootState) =>
    state[settingsSliceName].data.repoName;

export const getSettingsData = () => (state: RootState) =>
    state[settingsSliceName].data;

export const getLoadingStatus = () => (state: RootState) => {
    return {
        isLoading: state[settingsSliceName].isLoading,
        isLoaded: state[settingsSliceName].isLoaded,
        loadError: state[settingsSliceName].loadError,
    };
};

export const getSavingStatus = () => (state: RootState) => {
    return {
        isSaving: state[settingsSliceName].isSaving,
        isSaved: state[settingsSliceName].isSaved,
        saveError: state[settingsSliceName].saveError,
    };
};

/** Actions */

export const { setRepoName, setBuildCommand, setMainBranch, setPeriod } =
    settingsSlice.actions;
