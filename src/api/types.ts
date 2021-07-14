export interface IApi {
    getBuildList(params: BuildListParams): Promise<{
        data: Build[];
    }>;
    getBuildById(id: string): Promise<{
        data: Build;
    }>;
    getBuildLogs(id: string): Promise<{
        data: string;
    }>;
    getSettings(): Promise<{
        data: Configuration;
    }>;
    postSettings(data: ConfigurationPost): Promise<ConfigurationPostResponse>;
    postBuild(data: BuildPost): Promise<BuildPostResponse>;
}

export type BuildListParams = {
    limit?: number;
    offset?: number;
};

export type BuildStatus =
    | 'Waiting'
    | 'InProgress'
    | 'Success'
    | 'Fail'
    | 'Canceled';

export type Build = {
    id: string;
    configurationId: string;
    buildNumber: number;
    commitMessage: string;
    commitHash: string;
    branchName: string;
    authorName: string;
    status: BuildStatus;
    start?: string;
    duration?: number;
};

export type BuildPost = {
    commitHash: string;
};

export type BuildPostResult = {
    id: string;
    buildNumber: number;
    status: BuildStatus;
};

export type BuildPostResponse = {
    isAdded: boolean;
    data?: BuildPostResult;
    errorMessage?: string;
};

export type Configuration = {
    id: string;
    repoName: string;
    buildCommand: string;
    mainBranch: string;
    period: number;
};

export type ConfigurationPost = {
    repoName: string;
    buildCommand: string;
    mainBranch: string;
    period: number;
};

export type ConfigurationPostResponse = {
    isSaved: boolean;
    errorMessage?: string;
};
