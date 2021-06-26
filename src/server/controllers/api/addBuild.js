const axios = require('axios');
const { axiosConfig } = require('../../config');

const getCommitDetails = require('../../util/getCommitDetails');

module.exports = async (req, res) => {
    const { commitHash } = req.params;

    const currentConfig = { ...axiosConfig };
    currentConfig.headers['Content-Type'] = 'application/json';

    const { successful, params } = await getCommitDetails(commitHash);

    if (successful) {
        try {
            const response = await axios.post(
                '/build/request',
                params,
                currentConfig,
            );
            res.json({ isAdded: true, ...response.data });
        } catch (error) {
            res.json({ isAdded: false, errorMessage: error });
        }
    } else {
        res.json({ isAdded: false, errorMessage: 'Коммит не найден!' });
    }
};
