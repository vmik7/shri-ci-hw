import { Configuration } from '../../api/types';

export interface ISettingsState {
    data: Configuration;

    isLoading: boolean;
    isLoaded: boolean;
    loadError: string | null;

    isSaving: boolean;
    isSaved: boolean;
    saveError: string | null;
}
