import {
  SuccessResponse,
  HistoryDTO,
  User as IUser,
} from "../../types";
import {
  BadRequestResponse,
  FoundResponse,
  ServerErrorResponse,
  sequelizeErrorHandler,
  toHistoryDto,
} from "../utils";
import UserController from "./user.controller";
import TeamController from "./team.controller";
import History from "../models/History.model";
import User from "../models/User.model";

export default class OperationController {
  
  teamController = new TeamController()
  userController = new UserController()

  async moveUser(body: any) {

    let user: IUser;
    let hisotryDtoErrors = toHistoryDto(body);

    if (Array.isArray(hisotryDtoErrors))
      return BadRequestResponse(hisotryDtoErrors.join(", "));
      
    let historyDto: HistoryDTO = hisotryDtoErrors;
    let teamQuery = await this.teamController.getTeamById(historyDto.teamJoin);

    if (teamQuery.statusCode != 200) 
      if ("error" in teamQuery)
        return teamQuery;
      else 
        return ServerErrorResponse("Unknown error",  "Error while moving user: " + JSON.stringify(body))

    let userQuery = await this.userController.getUserById(historyDto.user);

    if (userQuery.statusCode != 200)
      if ("error" in userQuery) 
        return userQuery;
       else 
        return ServerErrorResponse("Unknown error","Error while moving user: " + JSON.stringify(body))
    
    if ("instance" in userQuery)
      user = userQuery.instance;
    else 
      return ServerErrorResponse("Unknown error", "Error while consulting user: " + JSON.stringify(body))    

    if (user.teamId == historyDto.teamJoin)
      return BadRequestResponse("Error while moving user", `User:${user.id} is already on team ${user.teamId}`)

    historyDto.teamLeft = user.teamId;

    let moveUserError;

    let userUpdated = await User.update({teamId:historyDto.teamJoin}, {
      where: { id: user.id },
    })
      .then(() => true)
      .catch((err: any) => {
        moveUserError = err;
        return false;
      });

    if (!userUpdated)
      return ServerErrorResponse( "Error while trying to update user",sequelizeErrorHandler(moveUserError))

    return await History.create(historyDto)
      .then((instance: History) => {
        let response: SuccessResponse = {
          message: "User moved succesfully",
          instance,
          statusCode: 201,
        };
        return response;
      })
      .catch(async (err: any) => {
        await User.update({teamId : historyDto.teamLeft}, { where: { id: user.id } });
        return ServerErrorResponse(sequelizeErrorHandler(err),"Error while moving user")
      });
  }
  async getAllHistory() {
    return await History.findAll()
      .then((instance: Array<History>) => 
        FoundResponse(instance, 'History'))
      .catch((err) =>
        ServerErrorResponse(sequelizeErrorHandler(err),"Error while consulting users"));
  }
}
