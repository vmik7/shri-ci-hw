import path from 'path';
import { Request, Response } from 'express';

import * as api from '../api';
import * as mocks from '../mocks';
import * as git from '../helpers/git';

import { config } from '../config';

export const getBuildList = (req: Request, res: Response) => {
    console.log('GET BuildList');

    /* Заглушка для тестов */
    if (req.query[config.testModeQuery]) {
        res.json(mocks.builds);
        return;
    }

    api.getBuildList(req.params as api.BuildListParams)
        .then(res.json)
        .catch(res.status(400).end);
};

export const getBuildDetails = (req: Request, res: Response) => {
    console.log('GET BuildDetails');

    /* Заглушка для тестов */
    if (req.query[config.testModeQuery]) {
        res.json(mocks.buildById(req.params.buildId));
        return;
    }

    api.getBuildDetails(req.params as api.BuildDetailsParams)
        .then(res.json)
        .catch(res.status(400).end);
};

export const getBuildLogs = (req: Request, res: Response) => {
    console.log('GET BuildLog');

    /* Заглушка для тестов */
    if (req.query[config.testModeQuery]) {
        res.json(mocks.log);
        return;
    }

    api.getBuildLog(req.params as api.BuildLogParams)
        .then(res.json)
        .catch(res.status(400).end);
};

export const requestBuild = (req: Request, res: Response) => {
    console.log('POST requestBuild');

    /* Заглушка для тестов */
    if (req.query[config.testModeQuery]) {
        res.json(mocks.newBuild);
        return;
    }

    const { commitHash } = req.params;
    const repoPath = path.resolve(config.repoFolderName);

    git.clone(repoPath, config.repoName)
        .then(() =>
            Promise.all([
                git.commitMessageByHash(repoPath, commitHash),
                git.commitAuthorByHash(repoPath, commitHash),
                git.commitBranchByHash(repoPath, commitHash),
            ]),
        )
        .then(([commitMessage, authorName, branchName]) =>
            api.requestBuild({
                commitHash,
                commitMessage,
                authorName,
                branchName,
            }),
        )
        .then(res.json)
        .catch(res.status(400).end);
};

export const getSettings = (req: Request, res: Response) => {
    console.log('GET getSettings');

    /* Заглушка для тестов */
    if (req.query[config.testModeQuery]) {
        res.json(mocks.settings);
        return;
    }

    api.getConfiguration().then(res.json).catch(res.status(400).end);
};

export const postSettings = async (req: Request, res: Response) => {
    console.log('POST postSettings');

    /* Заглушка для тестов */
    if (req.query[config.testModeQuery]) {
        res.status(200).end();
        return;
    }

    const { repoName } = req.body;

    try {
        if (repoName !== config.repoName) {
            config.repoName = repoName;
            await api.deleteConfiguration();
        }
    } catch (e) {
        console.error('ERROR! Can not delete Settings.');
    }

    const repoFolder = path.resolve(config.repoFolderName);

    git.clone(repoFolder, repoName)
        .then(() =>
            api.postConfiguration(req.body as api.ConfigurationPostData),
        )
        .then(() => res.status(200).end())
        .catch(res.status(400).end);
};
