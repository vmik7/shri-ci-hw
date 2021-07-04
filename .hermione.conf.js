const { testModeQuery } = require('./src/server/config');

module.exports = {
    baseUrl: 'http://localhost:3000/',
    gridUrl: 'http://localhost:4444/wd/hub',

    browsers: {
        chrome: {
            desiredCapabilities: {
                browserName: 'chrome',
            },
        },
    },

    plugins: {
        'selenium-runner': true,
        'url-decorator': {
            query: {
                [testModeQuery]: '1',
            },
        },
        'html-reporter/hermione': {
            path: 'hermione/html-reports',
        },
    },
};
