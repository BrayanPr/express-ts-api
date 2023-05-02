import express from 'express';
import OperationController from '../controllers/operation.controller';
import { verifyIsAdmin } from '../middlewares/jwt.middlewares';

const operationRoutes = express.Router();
const controller = new OperationController()
operationRoutes.use(verifyIsAdmin)

operationRoutes.post('/move', async (req, res) => {

    let response = await controller.moveUser(req.body);
    res.status(response.statusCode).send(response);

});

operationRoutes.get('/',async (_req, res) => {
    let response = await controller.getAllHistory();
    res.status(response.statusCode).send(response);
})


export default operationRoutes;