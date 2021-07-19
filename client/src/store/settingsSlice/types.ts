import { Configuration } from '../../api';

export interface ISettingsState {
    data: Configuration;

    isLoading: boolean;
    isLoaded: boolean;
    loadError: string | null;

    isChanged: boolean;

    isSaving: boolean;
    isSaved: boolean;
    saveError: string | null;
}
