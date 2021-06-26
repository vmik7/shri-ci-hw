const { PORT } = require('../server/config');

const API = `http://localhost:${PORT}/api`;

export class Api {
    async get(url, params) {
        let fullUrl = API + url;
        if (params) {
            fullUrl += '?' + new URLSearchParams(params).toString();
        }
        const response = await fetch(fullUrl);
        return await response.json();
    }
    async post(url, data) {
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
    buildList(params) {
        return this.get('/builds', params);
    }
    buildById(id) {
        return this.get(`/builds/${id}`);
    }
    buildLogsById(id) {
        return this.get(`/builds/${id}/logs`);
    }
    getSettings() {
        return this.get('/settings');
    }
    setSettings(data) {
        return this.post('/settings', data);
    }
}
