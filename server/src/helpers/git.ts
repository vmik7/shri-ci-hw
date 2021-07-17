import { rm } from 'fs/promises';
import util from 'util';
import { execFile } from 'child_process';

const execFileP = util.promisify(execFile);

/** Клонирование репозитория */
export const clone = async (folder: string, repoName: string) => {
    const repoUrl = `https://github.com/${repoName}.git`;
    await rm(folder, {
        recursive: true,
        force: true,
    });
    return execFileP('git', ['clone', repoUrl, folder]);
};

/** Получить сообщение коммита по его hash */
export const commitMessageByHash = async (
    repoPath: string,
    commitHash: string,
) => {
    const { stdout } = await execFileP(
        'git',
        ['log', '--max-count=1', commitHash, `--pretty=format:'%s'`],
        { cwd: repoPath },
    );

    const commitMessage = stdout.trim().slice(1, -1);

    if (!commitMessage) {
        throw new Error('Can not get commit message');
    }

    return commitMessage;
};

/** Получить сообщение коммита по его hash */
export const commitAuthorByHash = async (
    repoPath: string,
    commitHash: string,
) => {
    const { stdout } = await execFileP(
        'git',
        ['log', '--max-count=1', commitHash, `--pretty=format:'%an'`],
        { cwd: repoPath },
    );

    const commitAuthor = stdout.trim().slice(1, -1);

    if (!commitAuthor) {
        throw new Error('Can not get commit author');
    }

    return commitAuthor;
};

/** Получить имя какой-либо ветки, содержаей заданный коммит */
export const commitBranchByHash = async (
    repoPath: string,
    commitHash: string,
) => {
    const { stdout } = await execFileP(
        'git',
        ['branch', '--contains', commitHash],
        { cwd: repoPath },
    );
    const commitBranch = stdout.trim().replace('*', '').split('\n')[0].trim();

    if (!commitBranch) {
        throw new Error('Can not get commit branch');
    }

    return commitBranch;
};
