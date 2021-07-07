import { IComponentProps } from '../../common';

export type BuildStatus =
    | 'Success'
    | 'Waiting'
    | 'InProgress'
    | 'Fail'
    | 'Canceled';

export interface IBuildItemProps extends IComponentProps {
    buildNumber: number;
    commitMessage: string;
    commitHash: string;
    branchName: string;
    authorName: string;
    status: BuildStatus;
    start?: string;
    duration?: number;
    isDetailed?: boolean;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}
