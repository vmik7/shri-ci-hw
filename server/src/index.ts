import path from 'path';
import express from 'express';
import cors from 'cors';

import { config } from './config';
import { apiRouter, mainRouter } from './router';
import { getConfiguration } from './api';
import * as git from './helpers/git';

const app = express();

app.use(
    cors({
        origin: ['http://localhost:3000'],
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    }),
);
app.use(express.json());

app.use('/api', apiRouter);
app.use('/', mainRouter);

app.listen(config.port, () => {
    console.log(`Server started on port ${config.port}`);

    getConfiguration()
        .then(({ repoName }) => {
            const repoFolder = path.resolve(config.repoFolderName);
            config.repoName = repoName;
            return git.clone(repoFolder, repoName);
        })
        .catch((err) => {
            console.error(err);
            process.exit(-1);
        });
});
