import express from 'express';
import cors from 'cors';

import { PORT, axiosInstance, minimalUpdateInterval } from './config';
import { apiRouter, mainRouter } from './routers';
import { setUpdateInterval } from './util/updateInterval';
import { cloneRepo } from './util/cloneRepo';

const app = express();

// Cors
app.use(
    cors({
        origin: ['http://localhost:3000'],
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    }),
);

app.use(express.json());

// api routes
app.use('/api', apiRouter);

// main routes
app.use('/', mainRouter);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

// Getting config from API and setup updateInterval
axiosInstance
    .get('/conf')
    .then((response) => {
        let { repoName, period } = response.data.data;

        if (period < minimalUpdateInterval) {
            period = minimalUpdateInterval;
        }

        if (!repoName) {
            console.log('Can not fetch settings! Exit...');
            process.exit(-1);
        }

        const repoUrl = `https://github.com/${repoName}.git`;
        cloneRepo(repoUrl);
        setUpdateInterval({ repoUrl, period });
    })
    .catch(console.error);
