const axios = require('axios');
const { axiosConfig, testModeQuery } = require('../../config');
const { getStubBuildById } = require('../../stubs');

module.exports = async (req, res) => {
    if (req.query[testModeQuery]) {
        res.json({
            data: getStubBuildById(req.params.buildId),
        });
        return;
    }

    const currentConfig = { ...axiosConfig };
    currentConfig.params = {
        buildId: req.params.buildId,
    };

    axios
        .get('/build/details', currentConfig)
        .then((response) => res.json(response.data))
        .catch((error) => res.send(error));
};
