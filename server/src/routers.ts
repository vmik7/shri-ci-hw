import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import * as api from './controllers/api';

// routes for /api

export const apiRouter = Router();

apiRouter.get('/settings', api.getSettings);
apiRouter.post('/settings', api.saveSettings);
apiRouter.get('/builds', api.getBuilds);
apiRouter.post('/builds/:commitHash', api.addBuild);
apiRouter.get('/builds/:buildId', api.getBuildInfo);
apiRouter.get('/builds/:buildId/logs', api.getBuildLogs);

// routes for /

export const mainRouter = Router();

mainRouter.use('/api-docs', swaggerUi.serve);
mainRouter.get('/api-docs', swaggerUi.setup(swaggerDocument));
