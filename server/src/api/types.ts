/** Статус билда */
export type BuildStatus =
    | 'Waiting'
    | 'InProgress'
    | 'Success'
    | 'Fail'
    | 'Canceled';

/** Логи билда */
export type BuildLog = string;

/** Билд */
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

/** Настройки */
export type Configuration = {
    id: string;
    repoName: string;
    buildCommand: string;
    mainBranch: string;
    period: number;
};

/** Параметры запроса списка билдов */
export type BuildListParams = {
    limit?: number;
    offset?: number;
};

/** Параметры запроса деталей билда */
export type BuildDetailsParams = {
    buildId: string;
};

/** Параметры запроса логов билда */
export type BuildLogParams = {
    buildId: string;
};

/** Данные post запроса на добавление билда */
export type BuildRequestData = {
    commitMessage: string;
    commitHash: string;
    branchName: string;
    authorName: string;
};

export type NewBuildData = Pick<BuildRequestData, 'commitHash'>;

/** Результат post запроса на добавление билда */
export type BuildRequestResult = Pick<Build, 'id' | 'buildNumber' | 'status'>;

/** Данные post запроса на старт билда */
export type BuildStartData = {
    buildId: string;
    dateTime: string;
};

/** Данные post запроса на финиш билда */
export type BuildFinishData = {
    buildId: string;
    duration: number;
    success: string;
    buildLog: string;
};

/** Данные post запроса на отмену билда */
export type BuildCancelData = {
    buildId: string;
    dateTime: string;
};

/** Данные post запроса на сохранение настроек */
export type ConfigurationPostData = Pick<
    Configuration,
    'repoName' | 'buildCommand' | 'mainBranch' | 'period'
>;
