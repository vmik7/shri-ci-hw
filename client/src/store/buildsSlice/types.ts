import { Build } from '../../api';

export interface IBuildsState {
    data: Build[];

    isLoading: boolean;
    isLoaded: boolean;
    isAllLoaded: boolean;
    loadError: string | null;

    isModalOpen: boolean;
}
