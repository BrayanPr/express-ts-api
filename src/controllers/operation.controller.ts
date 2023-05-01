import {
  SuccessResponse,
  ErrorResponse,
  HistoryDTO,
  User as IUser,
  HistoyByDatesRequest,
} from "../../types";
import UserController from "./user.controller";
import TeamController from "./team.controller";
import History from "../models/History.model";
import {
  sequelizeErrorHandler,
  toHistoryByDates,
  toHistoryDto,
  toUserDto,
} from "../utils";
import { LogError } from "../app";
import User from "../models/User.model";


export default class OperationController {
  
  teamController = new TeamController()
  userController = new UserController()

  async moveUser(body: any) {
    let user: IUser;
    let hisotryDtoErrors = toHistoryDto(body);

    if (Array.isArray(hisotryDtoErrors)) {
      const response: ErrorResponse = {
        message: "Error while moving user",
        error: hisotryDtoErrors.join(", "),
        statusCode: 400,
      };
      return response;
    }
    let historyDto: HistoryDTO = hisotryDtoErrors;
    let teamQuery = await this.teamController.getTeamById(historyDto.teamJoin);

    if (teamQuery.statusCode != 200) {
      let queryResponse: ErrorResponse;
      if ("error" in teamQuery) {
        queryResponse = teamQuery;
      } else {
        const message = "Error while moving user: " + JSON.stringify(body);
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

    let userQuery = await this.userController.getUserById(historyDto.user);

    if (userQuery.statusCode != 200) {
      let queryResponse: ErrorResponse;
      if ("error" in userQuery) {
        queryResponse = userQuery;
      } else {
        const message = "Error while moving user: " + JSON.stringify(body);
        const response: ErrorResponse = {
          message,
          error: "Unknown error",
          statusCode: 500,
        };
        queryResponse = response;
        LogError(message + " " + response.error);
      }
      return queryResponse;
    } else {
      if ("instance" in userQuery) {
        user = userQuery.instance;
      } else {
        const message = "Error while consulting user: " + JSON.stringify(body);
        const response: ErrorResponse = {
          message,
          error: "Unknown error",
          statusCode: 500,
        };
        LogError(message + " " + response.error);
        return response;
      }
    }

    if (user.teamId == historyDto.teamJoin) {
      let response: ErrorResponse = {
        message: "Error while moving user",
        error: "User: " + user.id + " is already on team:" + user.teamId,
        statusCode: 400,
      };
      return response;
    }

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

    if (!userUpdated) {
      let response = {
        message: "Error while trying to update user",
        error: sequelizeErrorHandler(moveUserError),
        statusCode: 500,
      };
      return response;
    }

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
        let message = "Error while moving user";
        let error = sequelizeErrorHandler(err);
        let response: ErrorResponse = {
          message,
          error,
          statusCode: 500,
        };
        LogError(message + ": " + error);
        user.teamId = historyDto.teamLeft;
        await User.update(toUserDto(user), { where: { id: user.id } });
        return response;
      });
  }
  async getAllHistory() {
    return await History.findAll()
      .then((instance: Array<History>) => {
        let response: SuccessResponse = {
          message: "History consulted successully",
          instance,
          statusCode: 200,
        };
        return response;
      })
      .catch((err) => {
        let message = "Error while consulting users";
        let error = sequelizeErrorHandler(err);
        let response: ErrorResponse = {
          message,
          error,
          statusCode: 500,
        };
        return response;
      });
  }
  async getHistoryByDates(body: any) {
    let historyByDatesRequestErrors = toHistoryByDates(body);

    if (Array.isArray(historyByDatesRequestErrors)) {
      const response: ErrorResponse = {
        message: "Error while consulting dates",
        error: historyByDatesRequestErrors.join(", "),
        statusCode: 400,
      };
      return response;
    }
    let req: HistoyByDatesRequest = historyByDatesRequestErrors;

    return await History.findAll({
      where: {
        date: {
          $between: [req.startDate, req.endDate],
        },
      },
    })
      .then((instance: Array<History>) => {
        let response: SuccessResponse = {
          message: "History consulted successully",
          instance,
          statusCode: 200,
        };
        return response;
      })
      .catch((err) => {
        let message = "Error while consulting users";
        let error = sequelizeErrorHandler(err);
        let response: ErrorResponse = {
          message,
          error,
          statusCode: 500,
        };
        return response;
      });
  }
}
