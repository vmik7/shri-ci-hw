import fs from 'fs';
import path from 'path';
import util from 'util';
import { repoFolderName } from '../config';

const execFile = util.promisify(require('child_process').execFile);

export const cloneRepo = async (repoUrl: string) => {
    try {
        await fs.promises.rm(path.resolve(repoFolderName), {
            recursive: true,
            force: true,
        });
        await execFile('git', ['clone', repoUrl, repoFolderName]);
        return {
            successful: true,
        };
    } catch (e) {
        return {
            successful: false,
            error: e.stderr,
        };
    }
};
