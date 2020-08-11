import express, { response } from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';


const routes = express.Router();
const classControllers = new ClassesController();
const connectionController = new ConnectionsController();

routes.post('/classes',classControllers.create);
routes.get('/classes', classControllers.index);
routes.post('/connections',connectionController.create);
routes.get('/connections',connectionController.index);

export default routes;