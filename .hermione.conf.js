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
        'html-reporter/hermione': {
            path: 'hermione/html-reports',
        },
    },
};
