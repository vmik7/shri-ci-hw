const axios = require('axios');
const { axiosConfig } = require('../../config');

module.exports = async (req, res) => {
    const currentConfig = { ...axiosConfig };
    currentConfig.params = {
        buildId: req.params.buildId,
    };

    axios
        .get('/build/log', currentConfig)
        .then((response) => res.json(response.data))
        .catch((error) => res.send(error));
};
