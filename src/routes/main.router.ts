import express from "express";
import userRoutes from './users.routes';
import teamRoutes from './teams.routes';
import accountRoutes from './account.routes';
import operationRoutes from './operation.routes';
import authRoutes from './auth.routes';
import { verifyIsAdmin } from "../middlewares/jwt.middlewares";

const router = express.Router();

router.use('/accounts/', verifyIsAdmin, accountRoutes)
router.use('/teams/', verifyIsAdmin,teamRoutes)
router.use('/users/', userRoutes)
router.use('/operations/', verifyIsAdmin, operationRoutes)
router.use('/', authRoutes)

export default router