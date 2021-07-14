const axios = require('axios');
const { axiosConfig, testModeQuery } = require('../../config');
const { getStubLogs } = require('../../stubs');

module.exports = async (req, res) => {
    if (req.query[testModeQuery]) {
        res.json({
            data: getStubLogs(),
        });
        return;
    }

    const currentConfig = { ...axiosConfig };
    currentConfig.params = {
        buildId: req.params.buildId,
    };

    // TODO: Долго обрабатывается запрос, надо придумать кеширование. Пока что довольствуемся заглушкой
    axios
        .get('/build/log', currentConfig)
        .then((response) =>
            res.json({
                data: response.data,
            }),
        )
        .catch((error) => res.send(error));

    // res.json({
    //     data: getStubLogs(),
    // });
};
