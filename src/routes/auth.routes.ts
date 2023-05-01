import express from 'express';
import UserController from '../controllers/user.controller';
const controller = new UserController()
const authRoutes = express.Router();

authRoutes.post('/login', async (req, res) => {
    let response =await controller.Auth(req.body)
    res.status(response.statusCode).send(response)
});

export default authRoutes