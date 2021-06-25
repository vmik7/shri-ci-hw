const { Router } = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const api = require('./controllers/api');

// routes for /api

const apiRouter = new Router();

apiRouter.get('/settings', api.getSettings);
apiRouter.post('/settings', api.saveSettings);
apiRouter.get('/builds', api.getBuilds);
apiRouter.post('/builds/:commitHash', api.addBuild);
apiRouter.get('/builds/:buildId', api.getBuildInfo);
apiRouter.get('/builds/:buildId/logs', api.getBuildLogs);

exports.apiRouter = apiRouter;

// routes for /

const mainRouter = new Router();

mainRouter.get('/', (req, res) => {
    res.send('hello world');
});

mainRouter.use('/api-docs', swaggerUi.serve);
mainRouter.get('/api-docs', swaggerUi.setup(swaggerDocument));

exports.mainRouter = mainRouter;
