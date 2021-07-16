const getSettings = require('./getSettings');
const saveSettings = require('./saveSettings');
const getBuilds = require('./getBuilds');
const addBuild = require('./addBuild');
const getBuildInfo = require('./getBuildInfo');
const getBuildLogs = require('./getBuildLogs');

module.exports = {
    ping: (req, res) => res.json({ ping: 'pong' }),
    getSettings,
    saveSettings,
    getBuilds,
    addBuild,
    getBuildInfo,
    getBuildLogs,
};
