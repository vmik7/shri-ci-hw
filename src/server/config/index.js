require('dotenv').config();

module.exports = {
    PORT: 8085,
    testModeQuery: 'test_mode',
    repoFolderName: 'myrepo',
    axiosConfig: {
        baseURL: 'https://shri.yandex/hw/api',
        headers: {
            Authorization: process.env.KEY,
        },
    },
    minimalUpdateInterval: 1,
};
