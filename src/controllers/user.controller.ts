import {
  AuthRequest,
  ErrorResponse,
  JWTPayload,
  SuccessResponse,
  UserDTO,
} from "../../types";
import User from "../models/User.model";
import { LogError } from "../app";
import {
  sequelizeErrorHandler,
  toAuthRequest,
  toUserDto,
  toUserUpdateDto,
} from "../utils";
import TeamController from "./team.controller";
import { SignOptions, sign } from "jsonwebtoken";

import bcrypt from 'bcrypt'

export default class UserController {
  
  teamController = new TeamController() 

  async getAllUsers(): Promise<SuccessResponse | ErrorResponse> {
    return await User.findAll()
      .then((instance: Array<User>) => {
        let message = "Users consulted successfully";
        let res = {
          message,
          instance,
          statusCode: 200,
        };
        return res;
      })
      .catch((err: any) => {
        let message = "Error while getting users ";
        let error = sequelizeErrorHandler(err);
        let res = {
          message: message,
          error,
          statusCode: 500,
        };
        LogError(message + ": " + error);
        return res;
      });
  }
  async updateUser( body: any, id: number ): Promise<SuccessResponse | ErrorResponse> {
    const updated_user = toUserUpdateDto(body);
    let old_user = await User.findByPk(id)
    let response: SuccessResponse | ErrorResponse;
    if (old_user == null) {
      let message = "User not fouded";
      let error = `User with id ${id} not found`;
      response = {
        message,
        error,
        statusCode: 404,
      };
      LogError(message + ": " + error);
    } else {
      response = await User.update(updated_user, { where: { id: id } })
        .then(async () => {
          response = {
            message: "user updated successfully",
            instance: await User.findByPk(id),
            statusCode: 200,
          };
          return response;
        })
        .catch((err: any) => {
          let message = "Error while updating user ";
          let error = sequelizeErrorHandler(err);
          let response: ErrorResponse = {
            message,
            error,
            statusCode: 500,
          };
          LogError(message + ": " + error);
          return response;
        });
    }
    return response;
  }
  async createUser(body: any): Promise<SuccessResponse | ErrorResponse> {
    const userDtoOrErrors = toUserDto(body);
    if (Array.isArray(userDtoOrErrors)) {
      const response: ErrorResponse = {
        message: "Error while creating the user",
        error: userDtoOrErrors.join(", "),
        statusCode: 400,
      };
      return response;
    }
    let user: UserDTO = userDtoOrErrors;
    if (user.teamId != null) {
      let teamQuery = await this.teamController.getTeamById(user.teamId);

      if (teamQuery.statusCode != 200) {
        let queryResponse: ErrorResponse;
        if ("error" in teamQuery) {
          queryResponse = teamQuery;
        } else {
          const message =
            "Error while creating account: " + JSON.stringify(body);
          const response: ErrorResponse = {
            message,
            error: "Unknown error",
            statusCode: 500,
          };
          queryResponse = response;
          LogError(message + " " + response.error);
        }
        return queryResponse;
      }
    }
    user.password = await hashPassword(user.password)
    return User.create(user)
      .then((instance: User) => {
        const response: SuccessResponse = {
          message: "User created successfully",
          instance,
          statusCode: 201,
        };
        return response;
      })
      .catch((err: any) => {
        const message = "Error while creating user: " + JSON.stringify(user);
        const error = sequelizeErrorHandler(err);
        const response: ErrorResponse = {
          message,
          error,
          statusCode: 500,
        };
        LogError(message + " " + error);
        return response;
      });
  }
  async createUserAdmin(body: any): Promise<SuccessResponse | ErrorResponse> {
    const userDtoOrErrors = toUserDto(body);
    if (Array.isArray(userDtoOrErrors)) {
      const response: ErrorResponse = {
        message: "Error while creating the user",
        error: userDtoOrErrors.join(", "),
        statusCode: 400,
      };
      return response;
    }
    let user: UserDTO = userDtoOrErrors;
    if (user.teamId != null) {
      let teamQuery = await this.teamController.getTeamById(user.teamId);

      if (teamQuery.statusCode != 200) {
        let queryResponse: ErrorResponse;
        if ("error" in teamQuery) {
          queryResponse = teamQuery;
        } else {
          const message =
            "Error while creating account: " + JSON.stringify(body);
          const response: ErrorResponse = {
            message,
            error: "Unknown error",
            statusCode: 500,
          };
          queryResponse = response;
          LogError(message + " " + response.error);
        }
        return queryResponse;
      }
    }
    user.password = await hashPassword(user.password)
    user.role = "admin"
    return User.create(user)
      .then((instance: User) => {
        const response: SuccessResponse = {
          message: "User created successfully",
          instance,
          statusCode: 201,
        };
        return response;
      })
      .catch((err: any) => {
        const message = "Error while creating user: " + JSON.stringify(user);
        const error = sequelizeErrorHandler(err);
        const response: ErrorResponse = {
          message,
          error,
          statusCode: 500,
        };
        LogError(message + " " + error);
        return response;
      });
  }
  async deleteUser(id: number): Promise<SuccessResponse | ErrorResponse> {
    let user: User | null = await User.findByPk(id);
    let response: SuccessResponse | ErrorResponse;
    if (user == null) {
      let message: string = "User not found";
      let error: string = "user with id:" + id + " not found";
      response = {
        message,
        error,
        statusCode: 404,
      };

      LogError(message + ": " + error);

      return response;
    }

    response = await User.destroy({ where: { id: id } })
      .then(() => {
        return {
          message: "User deleted successfully",
          instance: null,
          statusCode: 200,
        };
      })
      .catch((err: any) => {
        let error = sequelizeErrorHandler(err);
        let message = "Error while deleting user with id:" + id;

        LogError(message + ": " + error);
        return {
          message,
          error,
          statusCode: 500,
        };
      });

    return response;
  }
  async getUserById(id: number): Promise<SuccessResponse | ErrorResponse> {
    return User.findByPk(id).then((instance: User | null) => {
      let response: SuccessResponse | ErrorResponse;
      if (instance == null) {
        let message = "User not fouded";
        let error = `User with id ${id} not found`;
        response = {
          message,
          error,
          statusCode: 404,
        };
        LogError(message + ": " + error);
      } else {
        response = {
          message: "User finded",
          instance,
          statusCode: 200,
        };
      }
      return response;
    });
  }
  async Auth(body: any): Promise<ErrorResponse | SuccessResponse> {
    let authErrors = toAuthRequest(body);
    if (Array.isArray(authErrors)) {
      const response: ErrorResponse = {
        message: "Error while creating the user",
        error: authErrors.join(", "),
        statusCode: 400,
      };
      return response;
    }
    let request: AuthRequest = authErrors;

    return await User.findOne({
      where: {
        email: request.email,
      }
    }).then(async (user: User | null) => {
        if (user == null) {
          let response: ErrorResponse = {
            message: "Error while trying to log in",
            error: "Invalid credentials",
            statusCode: 401,
          };
          return response;
        }
        let hashedPass = await bcrypt.hash(request.password,4) 
        if(! await comparePassword(request.password, user.password) && user.password == request.password && user.role == 'super_admin'){
          user.password = await hashPassword(user.password)
          await User.update({password:hashedPass}, {where : {id:user.id}})
        }else if(! await comparePassword(request.password, user.password)){
          let response: ErrorResponse = {
            message: "Error while trying to log in",
            error: "Invalid credentials",
            statusCode: 401,
          };
          return response;
          }

          let payload: JWTPayload = {
            user_id: user.id,
            role: user.role,
          };
          let tokenOptions: SignOptions = {
            expiresIn: "4h",
          };
          let token = sign(payload, "enchiladas_verdes", tokenOptions);

          let response: SuccessResponse = {
            message: "Login successfull",
            instance: token,
            statusCode: 200,
          };
          return response;
        
      })
      .catch((err: any) => {
        let message = "Error while login in";
        let error = err;
        let response: ErrorResponse = {
          message,
          error,
          statusCode: 500,
        };
        LogError(message + ": " + error);
        return response;
      });
  }
}

async function hashPassword(plaintextPassword:string) {
  const hash = await bcrypt.hash(plaintextPassword, 10);
  return hash
}
// compare password
async function comparePassword(plaintextPassword:string, hash:string) {
  const result = await bcrypt.compare(plaintextPassword, hash);
  return result;
}
