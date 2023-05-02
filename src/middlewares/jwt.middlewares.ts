import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import UserController from '../controllers/user.controller';
import { getToken, UnahutorizedResponse, isTokenExpired } from '../utils';

const userController = new UserController()

async function verifyToken(req: Request, res: Response, next: NextFunction, user_type:number){
    let token = getToken(req.headers)

    if(token == null){
        let response = UnahutorizedResponse("Token were not provided")
        res.status(response.statusCode).send(response)
        return
    }
    if(isTokenExpired(token)){
        let response = UnahutorizedResponse("Token is expired")
        res.status(response.statusCode).send(response)
        return
    }

    let aux = verify(token, "enchiladas_verdes")

    if(typeof aux == "string"){
        let response = UnahutorizedResponse("Token is not valid")
        res.status(response.statusCode).send(response)
        return
    }
    let payload: any = aux
    if(typeof payload.user_id != "number"){
        let response = UnahutorizedResponse("Token is not valid")
        res.status(response.statusCode).send(response)
        return
    }

    let user_id:number = payload.user_id;

    let user_role:string = payload.role

    let queryUser:any = await userController.getUserById(user_id)
    
    let user = queryUser.instance

    if(user == undefined){
        let response = UnahutorizedResponse("Token is not valid")
        res.status(response.statusCode).send(response)
        return
    }
    if(user.role != user_role){
        let response = UnahutorizedResponse("Token is not valid")
        res.status(response.statusCode).send(response)
        return
    }
     
    if((user_type == 1) && (user_role == "user"||user_role == "admin" || user_role == "super_admin"))
        next()
    else if((user_type == 2) && (user_role == "admin" || user_role == "super_admin"))
        next();
    else if (user_type == 3 && user_role == "super_admin")
        next();
    else{
        let response = UnahutorizedResponse("You have not permissions to perform this action", "Not enougth permissions")
        res.status(response.statusCode).send(response)
        return
    }
} 

// Your custom "middleware" function:
export const verifyIsUser = async (req: Request, res: Response, next: NextFunction) =>{
    verifyToken(req, res, next, 1)
}

// Your custom "middleware" function:
export const verifyIsAdmin = async (req: Request, res: Response, next: NextFunction) =>{
    verifyToken(req, res, next, 2)
}

// Your custom "middleware" function:
export const verifyIsSuperAdmin = (req: Request, res: Response, next: NextFunction) =>{
    verifyToken(req, res, next, 3)
}