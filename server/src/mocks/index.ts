import * as api from '../api';

/** Зашлушка для списка билдов */
export const builds: api.Build[] = [
    {
        id: '5659c0fc-e718-11eb-ba80-0242ac130004',
        configurationId: 'f835a982-e717-11eb-ba80-0242ac130004s',
        buildNumber: 3,
        commitMessage: 'Feature: add readme',
        commitHash: '7f7c5df27cc71188d19276b71a4214ebbfb01a46',
        branchName: 'main',
        authorName: 'Ivan Ivanovich',
        status: 'Waiting',
    },
    {
        id: '5659c0fc-e718-11eb-ba80-0242ac130004',
        configurationId: 'f835a982-e717-11eb-ba80-0242ac130004s',
        buildNumber: 2,
        commitMessage: 'Fix: bug with api',
        commitHash: 'a22516b67d525c04d34cd7da6d5b1dc26139c291',
        branchName: 'main',
        authorName: 'Ivan Ivanovich',
        status: 'Success',
        start: '2021-07-02T09:44:13.055Z',
        duration: 1030581,
    },
    {
        id: '6b335c68-e718-11eb-ba80-0242ac130004',
        configurationId: 'f835a982-e717-11eb-ba80-0242ac130004s',
        buildNumber: 1,
        commitMessage: 'Initial commit',
        commitHash: '4452d71687b6bc2c9389c3349fdc17fbd73b833b',
        branchName: 'main',
        authorName: 'Ivan Ivanovich',
        status: 'Canceled',
        start: '2021-07-01T09:44:13.055Z',
    },
];

/** Зашлушка для BuildLog */
export const log: api.BuildLog = `[2K[1G[1myarn run v1.22.5[22m
    [2K[1G[2m$ webpack --config webpack/production.js --color[22m
    /Users/fedinamid/Workspace/webpack-config/webpack
    Hash: [1m2a88f51a3c1cffdbdac8[39m[22m
    Version: webpack [1m4.44.1[39m[22m
    Time: [1m65[39m[22mms
    Built at: 06/19/2021 [1m3:08:51 AM[39m[22m
        [1mAsset[39m[22m       [1mSize[39m[22m  [1mChunks[39m[22m  [1m[39m[22m                 [1m[39m[22m[1mChunk Names[39m[22m
        [1m[32mmain.js[39m[22m  963 bytes       [1m0[39m[22m  [1m[32m[emitted][39m[22m        main
    [1m[32mmain.js.map[39m[22m   4.52 KiB       [1m0[39m[22m  [1m[32m[emitted] [dev][39m[22m  main
    Entrypoint [1mmain[39m[22m = [1m[32mmain.js[39m[22m [1m[32mmain.js.map[39m[22m
    [0] [1m./src/index.js[39m[22m 1 bytes {[1m[33m0[39m[22m}[1m[32m [built][39m[22m
    [2K[1GDone in 0.84s.
`;

/** Зашлушка для настроек */
export const settings: api.Configuration = {
    id: 'f835a982-e717-11eb-ba80-0242ac130004s',
    repoName: 'test/ci_test_repo',
    buildCommand: 'npm run build',
    mainBranch: 'main',
    period: 5,
};

/** Зашлушка для нового билда */
export const newBuild: api.BuildRequestResult = {
    id: 'dcd0a80e-8e25-4892-a5b9-0992ce7e2cb1',
    buildNumber: 4,
    status: 'Waiting',
};

/** Получаем заглушку билда по BuildId */
export const buildById = (id: string) => {
    return builds.find((item) => item.id === id);
};
