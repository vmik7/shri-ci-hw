import { Build, BuildPostResult } from '../../api/types';

export interface IBuildDetailsState {
    data: {
        [index: string]: Build;
    };
    logs: {
        [index: string]: string;
    };

    isLoading: boolean;
    isLoaded: boolean;
    loadError: string | null;

    rebuild: BuildPostResult | null;

    isRebuilding: boolean;
    isRebuilded: boolean;
    rebuildError: string | null;
}
