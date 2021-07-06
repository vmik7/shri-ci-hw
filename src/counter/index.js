import { Counter } from './Counter';

const SEND_TO_CONSOLE = false;

const GUID = '4bdb7ac4-23e8-4de3-b728-410baf9f1abd';
const page = 'index';
const counter = new Counter();

const testModeQuery = 'test_mode';
const params = new URLSearchParams(document.location.search);
const testMode = !!params.get(testModeQuery);

function getBrowserName() {
    if (/MSIE/.test(navigator.userAgent)) {
        return 'Internet Explorer';
    }
    if (/Firefox/.test(navigator.userAgent)) {
        return 'Firefox';
    }
    if (/Opera/.test(navigator.userAgent)) {
        return 'Opera';
    }
    if (/YaBrowser/.test(navigator.userAgent)) {
        return 'Yandex Browser';
    }
    if (/Chrome/.test(navigator.userAgent)) {
        return 'Google Chrome';
    }
    if (/Safari/.test(navigator.userAgent)) {
        return 'Safari';
    } else {
        return 'other';
    }
}

function getPlatform() {
    if (
        /iPhone/.test(navigator.userAgent) ||
        /iPad/.test(navigator.userAgent) ||
        /Android/.test(navigator.userAgent) ||
        /RIM/.test(navigator.userAgent)
    ) {
        return 'mobile';
    } else {
        return 'desktop';
    }
}

if (!testMode) {
    counter.init(GUID, String(Math.random()).substr(2, 12), page);
    counter.setAdditionalParams({
        platform: getPlatform(),
        browser: getBrowserName(),
    });

    const timeStart = Date.now();

    function sendMetric(name, value) {
        if (SEND_TO_CONSOLE) {
            console.log(name, value);
        } else {
            counter.send(name, value);
        }
    }

    function sendCustomEvent(name) {
        function handler() {
            sendMetric(name, Date.now() - timeStart);
            removeEventListener(name, handler);
        }
        addEventListener(name, handler);
    }

    function sendPaintMetrics() {
        const entries = performance.getEntriesByType('paint');
        const metrics = entries.filter(
            (entry) => entry.name === 'first-contentful-paint' || 'first-paint',
        );
        metrics.forEach((entry) => {
            const name = entry.name === 'first-paint' ? 'fp' : 'fcp';
            sendMetric(name, Math.round(entry.startTime));
        });
    }

    function sendConnect() {
        let [entry] = performance.getEntriesByType('navigation');
        let value = entry
            ? entry.connectEnd - entry.connectStart
            : performance.timing.connectEnd - performance.timing.connectStart;
        sendMetric('connect', Math.round(value));
    }

    function sendTTFB() {
        sendMetric(
            'ttfb',
            performance.timing.responseEnd - performance.timing.requestStart,
        );
    }

    addEventListener('load', () => {
        sendConnect();
        sendTTFB();
        sendPaintMetrics();
    });

    sendCustomEvent('buildListLoaded');
    sendCustomEvent('settingsLoaded');
    sendCustomEvent('showMoreButtonPressed');
}
