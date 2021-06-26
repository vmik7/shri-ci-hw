const { PORT } = require('../server/config');

const API = `http://localhost:${PORT}/api`;

export class Api {
    async get(url: string, params?: any) {
        let fullUrl = API + url;
        if (params) {
            fullUrl += '?' + new URLSearchParams(params).toString();
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
    buildList(params: buildListParams) {
        return this.get('/builds', params);
    }
    buildById(id: string) {
        return this.get(`/builds/${id}`);
    }
    buildLogsById(id: string) {
        return this.get(`/builds/${id}/logs`);
    }
    getSettings() {
        return this.get('/settings');
    }
    setSettings(data: setSettingsData) {
        return this.post('/settings', data);
    }
    pushBuild(commitHash: string) {
        return this.post(`/builds/${commitHash}`);
    }
}

interface buildListParams {
    limit?: number;
    offset?: number;
}

interface setSettingsData {
    repoName: string;
    buildCommand: string;
    mainBranch: string;
    period: number | '';
}
