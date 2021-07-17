import path from 'path';
import util from 'util';
import { execFile } from 'child_process';
import { v4 as uuidv4 } from 'uuid';

import { repoFolderName } from '../config';

const execFileP = util.promisify(execFile);

interface ICommitDetails {
    successful: boolean;
    params: {
        commitHash: string;
        branchName: string;
        authorName: string;
        commitMessage: string;
    };
}

export async function getCommitDetails(
    commitHash: string,
): Promise<ICommitDetails> {
    const result: ICommitDetails = {
        successful: true,
        params: {
            commitHash,
            branchName: '',
            authorName: '',
            commitMessage: '',
        },
    };

    try {
        const { stdout: gitBranchOutput } = await execFileP(
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
            result.successful = false;
            return result;
        }

        const divider = uuidv4();

        const { stdout: gitLogOutput } = await execFileP(
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
            result.successful = false;
            return result;
        }
    } catch (e) {
        console.error(e);
        result.successful = false;
        return result;
    }

    return result;
}
