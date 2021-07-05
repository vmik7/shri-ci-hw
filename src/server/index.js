const fs = require('fs');
const path = require('path');
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const morgan = require('morgan');

const { PORT, axiosConfig, minimalUpdateInterval } = require('./config');
const { apiRouter, mainRouter } = require('./routers');
const { setUpdateInterval } = require('./util/updateInterval');
const cloneRepo = require('./util/cloneRepo');

const app = express();

let accessLogStream = fs.createWriteStream(path.resolve('access.log'), {
    flags: 'a',
});

// Logger
app.use(
    morgan(':method :url', {
        stream: accessLogStream,
        immediate: true,
    }),
);

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
axios
    .get('/conf', axiosConfig)
    .then((response) => {
        let { repoName, period } = response.data.data;

        if (period < minimalUpdateInterval) {
            period = minimalUpdateInterval;
        }

        if (repoName) {
            const repoUrl = `https://github.com/${repoName}.git`;
            global.repoUrl = repoName;

            cloneRepo(repoUrl);
        }

        global.updatePeriod = period;

        setUpdateInterval();
    })
    .catch(console.error);
