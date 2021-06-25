const axios = require('axios');
const { axiosConfig } = require('../../config');
const cloneRepo = require('../../util/cloneRepo');
const { setUpdateInterval } = require('../../util/updateInterval');

module.exports = async (req, res) => {
    const currentConfig = { ...axiosConfig };
    currentConfig.headers['Content-Type'] = 'application/json';

    const repoUrl = req.body.repoName;

    try {
        await axios.post('/conf', req.body, currentConfig);

        cloneRepo(repoUrl);

        global.repoUrl = repoUrl;
        global.updatePeriod = req.body.period;
        setUpdateInterval();

        res.status(200).end();
    } catch (error) {
        res.send(error);
    }
};
