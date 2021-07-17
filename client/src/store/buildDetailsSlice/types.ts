import { Build, BuildRequestResult, BuildLog } from '../../api';

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

    isLogsLoading: boolean;
    isLogsLoaded: boolean;
    loadLogsError: string | null;

    rebuild: BuildRequestResult | null;

    isRebuilding: boolean;
    isRebuilded: boolean;
    rebuildError: string | null;
}

export interface LogThunkResult {
    id: string;
    log: BuildLog;
}
