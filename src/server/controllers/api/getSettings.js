const axios = require('axios');
const { axiosConfig } = require('../../config');

module.exports = async (req, res) => {
    const currentConfig = { ...axiosConfig };

    axios
        .get('/conf', currentConfig)
        .then((response) => res.json(response.data))
        .catch((error) => res.send(error));
};
