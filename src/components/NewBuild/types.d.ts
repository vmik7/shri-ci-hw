import { IComponentProps } from '../../common';

export interface INewBuildProps extends IComponentProps {}

export interface INewBuildState {
    hash: string;
    isSubmiting: boolean;
    isSubmited: boolean;
    isSubmitError: boolean;
    submitError: null | string;
    newBuildId: null | string;
}
