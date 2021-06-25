const axios = require('axios');
const { axiosConfig } = require('../../config');

const getCommitDetails = require('../../util/getCommitDetails');

module.exports = async (req, res) => {
    const { commitHash } = req.params;

    const currentConfig = { ...axiosConfig };
    currentConfig.headers['Content-Type'] = 'application/json';

    const params = await getCommitDetails(commitHash);

    axios
        .post('/build/request', params, currentConfig)
        .then((response) => res.json(response.data))
        .catch((error) => res.send(error));
};
