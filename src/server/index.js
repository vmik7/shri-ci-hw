const express = require('express');
const axios = require('axios');
const { PORT, axiosConfig, minimalUpdateInterval } = require('./config');
const { apiRouter, mainRouter } = require('./routers');
const { setUpdateInterval } = require('./util/updateInterval');
const cloneRepo = require('./util/cloneRepo');

const cors = require('cors');

const app = express();

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
            cloneRepo(repoName);
        }

        global.repoUrl = repoName;
        global.updatePeriod = period;

        setUpdateInterval();
    })
    .catch(console.error);
