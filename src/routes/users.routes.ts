import express from 'express';
import UserCntroller from '../controllers/user.controller';
import { ErrorResponse, SuccessResponse } from '../../types';
import { verifyIsAdmin, verifyIsUser } from '../middlewares/jwt.middlewares';
const userRoutes = express.Router();
const controller = new UserCntroller()
userRoutes.get('/', verifyIsAdmin , async (_req, res) => {

    let response = await controller.getAllUsers()
    res.status(response.statusCode).send(response);

});
userRoutes.get('/getProfile', verifyIsUser, (_req, res) => {
    res.send("My profile");
});
userRoutes.put('/:id',verifyIsAdmin, async (req, res) => {
    let id:number
    try{
        id = parseInt(req.params.id);
    }catch(err:any){
        let response:ErrorResponse = {
            message:"user id is not valid",
            error:"user id must be number",
            statusCode:400
        }
        res.status(response.statusCode).send(response);
        return
    }
    let response = await controller.updateUser(req.body, id);
    res.status(response.statusCode).send(response);
})
userRoutes.delete('/:id',verifyIsAdmin, async (req, res) => {
    let id:number
    try{
        id = parseInt(req.params.id);
    }catch(err:any){
        let response:ErrorResponse = {
            message:"user id is not valid",
            error:"user id must be number",
            statusCode:400
        }
        res.status(response.statusCode).send(response);
        return
    }
    let response:ErrorResponse|SuccessResponse
    // if(req.user.id == id)
    //     response = {
    //         message:"you cannot delete yout own user",
    //         error:"trying to delete self-user",
    //         statusCode:400
    //     }
    // else
    response = await controller.deleteUser(id);
    

    res.status(response.statusCode).send(response);
})
userRoutes.get('/:id',verifyIsAdmin, async (req, res) => {
    let id:number
    try{
        id = parseInt(req.params.id);
    }catch(err:any){
        let response:ErrorResponse = {
            message:"user id is not valid",
            error:"user id must be number",
            statusCode:400
        }
        res.status(response.statusCode).send(response);
        return
    }
    let response = await controller.getUserById(id);
    res.status(response.statusCode).send(response);
});
userRoutes.post('/',verifyIsAdmin, async (req, res) => {

    let response = await controller.createUser(req.body);
    res.status(response.statusCode).send(response);

});
userRoutes.post('/admin', async (req, res) => {

    let response = await controller.createUserAdmin(req.body);
    res.status(response.statusCode).send(response);

});

export default userRoutes;
