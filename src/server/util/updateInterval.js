const cloneRepo = require('./cloneRepo');

let interval;

function clearUpdateInterval() {
    if (interval) {
        clearInterval(interval);
    }
}

function setUpdateInterval() {
    clearUpdateInterval();

    const { repoUrl, updatePeriod } = global;

    if (repoUrl && updatePeriod) {
        interval = setInterval(() => {
            cloneRepo(repoUrl);
        }, updatePeriod * 60 * 1000);
    }
}

module.exports = {
    setUpdateInterval,
    clearUpdateInterval,
};
