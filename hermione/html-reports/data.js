var data = {
    skips: [],
    config: {
        defaultView: 'all',
        baseHost: '',
        scaleImages: false,
        lazyLoadOffset: 800,
        errorPatterns: [],
        metaInfoBaseUrls: {},
        customScripts: [],
        yandexMetrika: { counterNumber: null },
        pluginsEnabled: false,
        plugins: [],
    },
    apiValues: {
        extraItems: {},
        metaInfoExtenders: {},
        imagesSaver: {
            saveImg:
                'async (srcCurrPath, {destPath, reportDir}) => {\n        await utils.copyFileAsync(srcCurrPath, destPath, reportDir);\n\n        return destPath;\n    }',
        },
        reportsSaver: null,
    },
    date: 'Sat Jul 03 2021 10:57:29 GMT+0300 (Москва, стандартное время)',
};
try {
    module.exports = data;
} catch (e) {}
