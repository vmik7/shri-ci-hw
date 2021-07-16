const axios = require('axios');
const { axiosConfig, testModeQuery } = require('../../config');
const { getStubBuilds } = require('../../stubs');

module.exports = async (req, res) => {
    if (req.query[testModeQuery]) {
        res.json({
            data: getStubBuilds(),
        });
        return;
    }

    const currentConfig = { ...axiosConfig };
    currentConfig.params = {
        offset: req.query.offset || 0,
        limit: req.query.limit || 25,
    };

    axios
        .get('/build/list', currentConfig)
        .then((response) => res.json(response.data))
        .catch((error) => res.send(error));
};
