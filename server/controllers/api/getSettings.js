const axios = require('axios');
const { axiosConfig, testModeQuery } = require('../../config');
const { getStubSettings } = require('../../stubs');

module.exports = async (req, res) => {
    if (req.query[testModeQuery]) {
        res.json({
            data: getStubSettings(),
        });
        return;
    }

    const currentConfig = { ...axiosConfig };

    axios
        .get('/conf', currentConfig)
        .then((response) => res.json(response.data))
        .catch((error) => res.send(error));
};
