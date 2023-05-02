import {
  AuthRequest,
  ErrorResponse,
  JWTPayload,
  SuccessResponse,
  UserDTO,
} from "../../types";
import User from "../models/User.model";
import {
  BadCredentialsResponse,
  BadRequestResponse,
  CreatedResponse,
  DeletedResponse,
  FoundResponse,
  NotFoundResponse,
  ServerErrorResponse,
  UpdatedResponse,
  comparePassword,
  hashPassword,
  sequelizeErrorHandler,
  toAuthRequest,
  toUserDto,
  toUserUpdateDto,
} from "../utils";
import TeamController from "./team.controller";
import { SignOptions, sign } from "jsonwebtoken";

export default class UserController {
  
  teamController = new TeamController() 

  async getAllUsers(): Promise<SuccessResponse | ErrorResponse> {
    return await User.findAll()
      .then((instance: Array<User>) =>
        FoundResponse(instance,'Users'))
      .catch((err: any) => 
        ServerErrorResponse("Error while getting users.",sequelizeErrorHandler(err)));
  }
  async updateUser( body: any, id: number ): Promise<SuccessResponse | ErrorResponse> {
    const updated_user = toUserUpdateDto(body);
    let old_user = await User.findByPk(id);
    if (old_user == null)
      NotFoundResponse(id, 'User') 
    
    return await User.update(updated_user, { where: { id: id } })
        .then(async () => {
          let instance = await User.findByPk(id)
          return UpdatedResponse(instance, 'User')
        })
        .catch((err: any) => 
          ServerErrorResponse(sequelizeErrorHandler(err), `Error while updating user`));
  }
  async createUser(body: any): Promise<SuccessResponse | ErrorResponse> {
    const userDtoOrErrors = toUserDto(body);
    if (Array.isArray(userDtoOrErrors)) 
      return BadRequestResponse(userDtoOrErrors.join(", "))
      
    let user: UserDTO = userDtoOrErrors;

    if (user.teamId != null) {
      let teamQuery = await this.teamController.getTeamById(user.teamId);

      if (teamQuery.statusCode != 200)
        if ("error" in teamQuery) 
          return teamQuery;
        else 
          return ServerErrorResponse("Unknown error","Error while creating account: " + JSON.stringify(body)) 
    }
    user.password = await hashPassword(user.password)
    return await User.create(user)
      .then((instance: User) =>
        CreatedResponse(instance, 'User'))
      .catch((err: any) =>
        ServerErrorResponse(sequelizeErrorHandler(err),"Error while creating user: " + JSON.stringify(user)));
  }
  async createUserAdmin(body: any): Promise<SuccessResponse | ErrorResponse> {
    const userDtoOrErrors = toUserDto(body);
    if (Array.isArray(userDtoOrErrors)) 
      return BadRequestResponse(userDtoOrErrors.join(", "))

    let user: UserDTO = userDtoOrErrors;

    if (user.teamId != null) {
      let teamQuery = await this.teamController.getTeamById(user.teamId);

      if (teamQuery.statusCode != 200)
        if ("error" in teamQuery) 
          return teamQuery;
        else 
          return ServerErrorResponse("Unknown error","Error while creating account: " + JSON.stringify(body)) 
    }
    user.password = await hashPassword(user.password)
    user.role = "admin"
    return await User.create(user)
      .then((instance: User) => 
        CreatedResponse(instance, 'User admin'))
      .catch((err: any) => 
        ServerErrorResponse(sequelizeErrorHandler(err),"Error while creating user: " + JSON.stringify(user)));
  }
  async deleteUser(id: number): Promise<SuccessResponse | ErrorResponse> {
    let user: User | null = await User.findByPk(id);
    if (user == null) 
      return NotFoundResponse(id, 'User')
    
    return await User.destroy({ where: { id: id } })
      .then(() => 
        DeletedResponse(true, 'User'))
      .catch((err: any) => 
        ServerErrorResponse(sequelizeErrorHandler(err), `Error while deleting user with id:${id}`));
  }
  async getUserById(id: number): Promise<SuccessResponse | ErrorResponse> {
    const instance = User.findByPk(id);
    if (instance == null)
        return NotFoundResponse(id, 'User')
    return FoundResponse(instance, 'User')
  }
  async Auth(body: any): Promise<ErrorResponse | SuccessResponse> {
    let authErrors = toAuthRequest(body);
    if (Array.isArray(authErrors)) 
      return BadRequestResponse(authErrors.join(", "))
    
    let request: AuthRequest = authErrors;

    return await User.findOne({
      where: {
        email: request.email,
      }
    })
    .then(async (user: User | null) => {
      if (user == null)
        return BadCredentialsResponse()
        
      let hashedPass = await hashPassword(request.password) 

      if(! await comparePassword(request.password, user.password) && user.password == request.password && user.role == 'super_admin'){
        user.password = await hashPassword(user.password)
        await User.update({password:hashedPass}, {where : {id:user.id}})
      }
      else if(! await comparePassword(request.password, user.password))
        return BadCredentialsResponse()
          

      let payload: JWTPayload = {
        user_id: user.id,
        role: user.role,
      };
      let tokenOptions: SignOptions = {
        expiresIn: "4h",
      };
      let token = sign(payload, "enchiladas_verdes", tokenOptions);

      return {
        message: "Login successfull",
        instance: token,
        statusCode: 200,
      };
    })
    .catch((err: any) => 
      ServerErrorResponse(err, "Error while login in"));
  }
}