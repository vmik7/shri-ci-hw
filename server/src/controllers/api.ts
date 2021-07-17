import path from 'path';
import { Request, Response } from 'express';

import * as api from '../api';
import * as mocks from '../mocks';
import * as git from '../helpers/git';

import { config } from '../config';

export const getBuildList = (req: Request, res: Response) => {
    console.log('GET BuildList');

    const params: api.BuildListParams = {
        offset: +req.params.offset || 0,
        limit: +req.params.limit || 25,
    };

    /* Заглушка для тестов */
    if (req.query[config.testModeQuery]) {
        res.json(mocks.builds);
        return;
    }

    api.getBuildList(params)
        .then((data) => res.json(data))
        .catch((error) => res.status(400).end(error));
};

export const getBuildDetails = (req: Request, res: Response) => {
    console.log('GET BuildDetails');

    /* Заглушка для тестов */
    if (req.query[config.testModeQuery]) {
        res.json(mocks.buildById(req.params.buildId));
        return;
    }

    api.getBuildDetails(req.params as api.BuildDetailsParams)
        .then((data) => res.json(data))
        .catch((error) => res.status(400).end(error));
};

export const getBuildLogs = (req: Request, res: Response) => {
    console.log('GET BuildLog');

    /* Заглушка для тестов */
    if (req.query[config.testModeQuery]) {
        res.json(mocks.log);
        return;
    }

    // TODO Запрос логов долгий. Продумать кэш

    api.getBuildLog(req.params as api.BuildLogParams)
        .then((data) => res.end(data))
        .catch((error) => res.status(400).end(error));
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

    // TODO Клонировать репозиторий каждый раз плохо. Перейти на GitHub API

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
        .then((data) => res.json(data))
        .catch((error) => res.status(400).end(error));
};

export const getSettings = (req: Request, res: Response) => {
    console.log('GET getSettings');

    /* Заглушка для тестов */
    if (req.query[config.testModeQuery]) {
        res.json(mocks.settings);
        return;
    }

    api.getConfiguration()
        .then((data) => res.json(data))
        .catch((error) => res.status(400).end(error));
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
        .then(() => res.status(400).end())
        .catch((error) => res.status(400).end(error));
};
