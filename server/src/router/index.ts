import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import * as api from '../controllers/api';

/* Роутер для '/api' */

export const apiRouter = Router();

apiRouter.get('/settings', api.getSettings);
apiRouter.post('/settings', api.postSettings);

apiRouter.get('/builds', api.getBuildList);
apiRouter.get('/builds/:buildId', api.getBuildDetails);
apiRouter.get('/builds/:buildId/logs', api.getBuildLogs);
apiRouter.post('/builds/:commitHash', api.requestBuild);

/* Роутер для '/' */

export const mainRouter = Router();

mainRouter.use('/api-docs', swaggerUi.serve);
mainRouter.get('/api-docs', swaggerUi.setup(swaggerDocument));
