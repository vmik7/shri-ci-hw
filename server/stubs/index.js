const stubBuilds = require('./builds');
const stubLogs = require('./logs');
const stubSettings = require('./settings');

module.exports = {
    getStubBuildById(id) {
        return stubBuilds.find((item) => item.id === id);
    },
    getStubBuilds() {
        return stubBuilds;
    },
    getStubLogs() {
        return stubLogs;
    },
    getStubSettings() {
        return stubSettings;
    },
};
