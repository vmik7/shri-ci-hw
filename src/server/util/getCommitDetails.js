const { v4: uuidv4 } = require('uuid');

// const fs = require('fs');
const path = require('path');
const util = require('util');
const { repoFolderName } = require('../config');

const execFile = util.promisify(require('child_process').execFile);

module.exports = async (commitHash) => {
    const result = {
        successful: true,
        params: { commitHash },
    };

    try {
        const { stdout: gitBranchOutput } = await execFile(
            'git',
            ['branch', '--contains', commitHash],
            { cwd: path.resolve(repoFolderName) },
        );
        const branchName = gitBranchOutput
            .trim()
            .replace('*', '')
            .split('\n')[0]
            .trim();

        if (branchName) {
            result.params.branchName = branchName;
        } else {
            return { successful: false };
        }

        const divider = uuidv4();

        const { stdout: gitLogOutput } = await execFile(
            'git',
            [
                'log',
                '--max-count=1',
                commitHash,
                `--pretty=format:'%an${divider}%s'`,
            ],
            { cwd: path.resolve(repoFolderName) },
        );
        const currentLog = gitLogOutput.trim().slice(1, -1).split(divider);

        if (currentLog) {
            [result.params.authorName, result.params.commitMessage] =
                currentLog;
        } else {
            return { successful: false };
        }
    } catch (e) {
        console.error(e);
        return { successful: false };
    }

    return result;
};
