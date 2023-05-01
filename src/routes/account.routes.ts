import express from 'express';
import AccountController from '../controllers/account.controller';
import { ErrorResponse } from '../../types';
const accountRoutes = express.Router();
const controller = new AccountController()

accountRoutes.get('/', async (_req, res) => {

    let response = await controller.getAllAccounts()
    res.status(response.statusCode).send(response);

});

accountRoutes.put('/:id', async (req, res) => {
    let id:number
    try{
        id = parseInt(req.params.id);
    }catch(err:any){
        let response:ErrorResponse = {
            message:"account id is not valid",
            error:"account id must be number",
            statusCode:400
        }
        res.status(response.statusCode).send(response);
        return
    }
    let response = await controller.updateAccount(req.body, id);
    res.status(response.statusCode).send(response);
})

accountRoutes.delete('/:id', async (req, res) => {
    let id:number
    try{
        id = parseInt(req.params.id);
    }catch(err:any){
        let response:ErrorResponse = {
            message:"account id is not valid",
            error:"account id must be number",
            statusCode:400
        }
        res.status(response.statusCode).send(response);
        return
    }
    let response = await controller.deleteAccount(id);
    res.status(response.statusCode).send(response);
})

accountRoutes.get('/:id', async (req, res) => {
    let id:number
    try{
        id = parseInt(req.params.id);
    }catch(err:any){
        let response:ErrorResponse = {
            message:"account id is not valid",
            error:"account id must be number",
            statusCode:400
        }
        res.status(response.statusCode).send(response);
        return
    }
    let response = await controller.getAccountById(id);
    res.status(response.statusCode).send(response);
});
accountRoutes.post('/', async (req, res) => {

    let response = await controller.createAccount(req.body);
    res.status(response.statusCode).send(response);

});



export default accountRoutes;
