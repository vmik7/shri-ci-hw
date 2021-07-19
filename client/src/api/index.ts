import * as types from './types';
export * from './types';

const baseApiUrl = `http://localhost:8085/api`;

export const testModeQuery = 'test_mode';
export interface IApi {
    getBuildList(params: types.BuildListParams): Promise<types.Build[]>;
    getBuildById(params: types.BuildDetailsParams): Promise<types.Build>;
    getBuildLogById(params: types.BuildLogParams): Promise<types.BuildLog>;
    newBuild(data: types.NewBuildData): Promise<types.BuildRequestResult>;

    getSettings(): Promise<types.Configuration>;
    postSettings(data: types.ConfigurationPostData): Promise<Response>;
}

export class Api implements IApi {
    testMode: boolean;

    constructor(testMode = false) {
        this.testMode = testMode;
    }

    get(url: string, params?: any) {
        const searchParams = new URLSearchParams(params);

        if (this.testMode) {
            searchParams.append(testModeQuery, '1');
        }

        const fullUrl = baseApiUrl + url;
        const fullUrlWithParams =
            params || this.testMode
                ? fullUrl + '?' + searchParams.toString()
                : fullUrl;

        return fetch(fullUrlWithParams);
    }

    post(url: string, data: object = {}) {
        const fullUrl = baseApiUrl + url;
        return fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }

    getBuildList(params: types.BuildListParams) {
        return this.get('/builds', params).then((res) => res.json());
    }

    getBuildById(params: types.BuildDetailsParams) {
        const { buildId } = params;
        return this.get(`/builds/${buildId}`).then((res) => res.json());
    }

    getBuildLogById(params: types.BuildLogParams) {
        const { buildId } = params;
        return this.get(`/builds/${buildId}/logs`).then((res) => res.text());
    }

    getSettings() {
        return this.get('/settings').then((res) => res.json());
    }

    postSettings(data: types.ConfigurationPostData) {
        return this.post('/settings', data);
    }

    newBuild(data: types.NewBuildData) {
        return this.post(`/builds/${data.commitHash}`).then((res) =>
            res.json(),
        );
    }
}
