const axios = require('axios');
const { axiosConfig } = require('../../config');
const cloneRepo = require('../../util/cloneRepo');
const { setUpdateInterval } = require('../../util/updateInterval');

module.exports = async (req, res) => {
    const currentConfig = { ...axiosConfig };
    currentConfig.headers['Content-Type'] = 'application/json';

    const repoUrl = req.body.repoName;

    const cloneResult = await cloneRepo(repoUrl);
    if (cloneResult.successful) {
        // console.log('clone success!');

        global.repoUrl = repoUrl;
        global.updatePeriod = req.body.period;
        setUpdateInterval();

        try {
            await axios.post('/conf', req.body, currentConfig);
            res.status(200).send({
                isSaved: true,
            });
        } catch (error) {
            res.send(error);
        }
    } else {
        // console.log('clone error!');
        res.status(200).send({
            isSaved: false,
            errorMessage: cloneResult.error,
        });
    }
};
