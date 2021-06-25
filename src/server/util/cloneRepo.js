const fs = require('fs');
const path = require('path');
const util = require('util');
const { repoFolderName } = require('../config');

const execFile = util.promisify(require('child_process').execFile);

module.exports = async (repoUrl) => {
    try {
        await fs.promises.rm(path.resolve(repoFolderName), {
            recursive: true,
            force: true,
        });
        await execFile('git', ['clone', repoUrl, repoFolderName]);
    } catch (e) {
        console.error(e);
    }
};
