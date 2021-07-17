import { BuildRequestResult } from '../../api';

export interface INewBuildState {
    hash: string;

    isSubmitting: boolean;
    isSubmitted: boolean;
    submitError: string | null;

    data: BuildRequestResult | null;
}
