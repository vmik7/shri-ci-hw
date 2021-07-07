export type BuildStatus =
    | 'Success'
    | 'Waiting'
    | 'InProgress'
    | 'Fail'
    | 'Canceled';

export interface IBuildItemProps {
    buildNumber: number;
    commitMessage: string;
    commitHash: string;
    branchName: string;
    authorName: string;
    status: BuildStatus;
    start?: string;
    duration?: number;
    extraClasses?: string;
    isDetailed?: boolean;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}
