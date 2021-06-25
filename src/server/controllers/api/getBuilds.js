const axios = require('axios');
const { axiosConfig } = require('../../config');

module.exports = async (req, res) => {
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
