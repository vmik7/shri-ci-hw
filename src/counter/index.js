import { Counter } from './Counter';

const GUID = '92e903c3-055e-4c78-93ba-35505693061b';

const page = 'index';

const counter = new Counter();

counter.init(GUID, String(Math.random()).substr(2, 12), page);
counter.setAdditionalParams({
    env: 'production',
    platform: 'touch',
});

counter.send(
    'connect',
    performance.timing.connectEnd - performance.timing.connectStart,
);
counter.send(
    'ttfb',
    performance.timing.responseEnd - performance.timing.requestStart,
);

// let timeStart = Date.now();

// setTimeout(function () {
//     document.querySelector('.square').classList.add('black');

//     counter.send('load', Date.now() - timeStart);
// }, Math.random() * 1000 + 500);
