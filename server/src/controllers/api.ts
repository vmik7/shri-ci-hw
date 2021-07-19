import path from 'path';
import { Request, Response } from 'express';
import signale from 'signale';

import * as api from '../api';
import * as mocks from '../mocks';
import * as git from '../helpers/git';

import { config } from '../config';

export const getBuildList = (req: Request, res: Response) => {
    signale.await('GET BuildList');

    /* Заглушка для тестов */
    if (req.query[config.testModeQuery]) {
        signale.warn('GET BuildList return stub because of test mode!');
        res.json(mocks.builds);
        return;
    }

    const params: api.BuildListParams = {
        offset: +req.params.offset || 0,
        limit: +req.params.limit || 25,
    };

    api.getBuildList(params)
        .then((data) => {
            signale.success('GET BuildList succesfully!');
            res.json(data);
        })
        .catch((err) => {
            signale.error('GET BuildList error!');
            signale.log(err);
            res.status(400).end();
        });
};

export const getBuildDetails = (req: Request, res: Response) => {
    signale.await('GET BuildDetails');

    /* Заглушка для тестов */
    if (req.query[config.testModeQuery]) {
        signale.warn('GET BuildDetails return stub because of test mode!');
        res.json(mocks.buildById(req.params.buildId));
        return;
    }

    api.getBuildDetails(req.params as api.BuildDetailsParams)
        .then((data) => {
            signale.success('GET BuildDetails succesfully!');
            res.json(data);
        })
        .catch((err) => {
            signale.error('GET BuildDetails error!');
            signale.log(err);
            res.status(400).end();
        });
};

export const getBuildLogs = (req: Request, res: Response) => {
    signale.await('GET BuildLogs');

    /* Заглушка для тестов */
    if (req.query[config.testModeQuery]) {
        signale.warn('GET BuildLogs return stub because of test mode!');
        res.end(mocks.log);
        return;
    }

    api.getBuildLog(req.params as api.BuildLogParams)
        .then((data) => {
            signale.success('GET BuildLogs succesfully!');
            res.end(data);
        })
        .catch((err) => {
            signale.error('GET BuildLogs error!');
            signale.log(err);
            res.status(400).end();
        });
};

export const requestBuild = (req: Request, res: Response) => {
    signale.await('POST requestBuild');

    /* Заглушка для тестов */
    if (req.query[config.testModeQuery]) {
        signale.warn(
            'POST requestBuild will not request build and return stub because of test mode!',
        );
        res.json(mocks.newBuild);
        return;
    }

    const { commitHash } = req.params;
    const repoPath = path.resolve(config.repoFolderName);

    git.clone(repoPath, config.repoName)
        .then(() => {
            signale.complete(
                `Repository ${config.repoName} cloned successfully`,
            );
            return Promise.all([
                git.commitMessageByHash(repoPath, commitHash),
                git.commitAuthorByHash(repoPath, commitHash),
                git.commitBranchByHash(repoPath, commitHash),
            ]);
        })
        .then(([commitMessage, authorName, branchName]) => {
            signale.complete(`Commit details are received`);
            return api.requestBuild({
                commitHash,
                commitMessage,
                authorName,
                branchName,
            });
        })
        .then((data) => {
            signale.success('POST requestBuild succesfully!');
            res.json(data);
        })
        .catch((err) => {
            signale.error('POST requestBuild error!');
            signale.log(err);
            res.status(400).end();
        });
};

export const getSettings = (req: Request, res: Response) => {
    signale.await('GET getSettings');

    /* Заглушка для тестов */
    if (req.query[config.testModeQuery]) {
        signale.warn('GET getSettings return stub because of test mode!');
        res.json(mocks.settings);
        return;
    }

    api.getConfiguration()
        .then((data) => {
            signale.success('GET getSettings succesfully!');
            res.json(data);
        })
        .catch((err) => {
            signale.error('GET getSettings error!');
            signale.log(err);
            res.status(400).end();
        });
};

export const postSettings = async (req: Request, res: Response) => {
    signale.await('POST postSettings');

    /* Заглушка для тестов */
    if (req.query[config.testModeQuery]) {
        signale.warn(
            'POST postSettings will not save settings because of test mode!',
        );
        res.status(200).end();
        return;
    }

    const { repoName } = req.body;
    const repoFolder = path.resolve(config.repoFolderName);

    if (repoName !== config.repoName) {
        signale.note('Repository is changed, current settings will be deleted');
        git.clone(repoFolder, repoName)
            .then(
                () => {
                    signale.complete(
                        `Repository ${repoName} cloned successfully`,
                    );
                    return api.deleteConfiguration();
                },
                (err) => {
                    signale.error(`Can not clone ${repoName}!`);
                    signale.log(err);
                    res.status(400).end('Repository not found!');
                    return Promise.reject();
                },
            )
            .then(
                () => {
                    signale.complete('Current settings deleted successfully');
                    return api.postConfiguration(
                        req.body as api.ConfigurationPostData,
                    );
                },
                (err) => {
                    signale.error(`Can not delete current settings!`);
                    signale.log(err);
                    res.status(400).end();
                    return Promise.reject();
                },
            )
            .then(() => {
                signale.success('POST postSettings succesfully!');
                res.status(200).end();
            })
            .catch((err) => {
                signale.error('POST postSettings error!');
                signale.log(err);
                res.status(400).end();
            });
    } else {
        signale.note('Repository name is not changed');
        api.postConfiguration(req.body as api.ConfigurationPostData)
            .then(() => {
                signale.success('POST postSettings succesfully!');
                res.status(200).end();
            })
            .catch((err) => {
                signale.error('POST postSettings error!');
                signale.log(err);
                res.status(400).end();
            });
    }
};
