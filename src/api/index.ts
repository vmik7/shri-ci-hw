import { IApi, BuildListParams, ConfigurationPost, BuildPost } from './types';

import { PORT, testModeQuery } from '../server/config';
const API = `http://localhost:${PORT}/api`;

export class Api implements IApi {
    testMode: boolean;

    constructor(testMode = false) {
        this.testMode = testMode;
    }

    async get(url: string, params?: any) {
        let searchParams = new URLSearchParams(params);

        if (this.testMode) {
            searchParams.append(testModeQuery, '1');
        }

        let fullUrl = API + url;
        if (params || this.testMode) {
            fullUrl += '?' + searchParams.toString();
        }

        const response = await fetch(fullUrl);
        return await response.json();
    }

    async post(url: string, data: object = {}) {
        let fullUrl = API + url;
        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return await response.json();
    }

    getBuildList(params: BuildListParams) {
        return this.get('/builds', params);
    }

    getBuildById(id: string) {
        return this.get(`/builds/${id}`);
    }

    getBuildLogs(id: string) {
        return this.get(`/builds/${id}/logs`);
    }

    getSettings() {
        return this.get('/settings');
    }

    postSettings(data: ConfigurationPost) {
        return this.post('/settings', data);
    }

    postBuild(data: BuildPost) {
        return this.post(`/builds/${data.commitHash}`);
    }
}
