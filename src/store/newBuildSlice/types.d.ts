import { BuildStatus, BuildPostResult } from '../../api/types';

export interface INewBuildState {
    hash: string;

    isSubmitting: boolean;
    isSubmitted: boolean;
    submitError: string | null;

    data: BuildPostResult | null;
}
