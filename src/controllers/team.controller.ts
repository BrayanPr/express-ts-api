import { ErrorResponse, SuccessResponse, TeamDTO } from "../../types";
import Team from "../models/Team.model";
import { LogError } from "../app";
import { sequelizeErrorHandler, toTeamDto } from "../utils";

export default class TeamController {
  
  async getAllTeams(): Promise<SuccessResponse | ErrorResponse> {
    let response: SuccessResponse | ErrorResponse;

    response = await Team.findAll()
      .then((teams: Array<Team>) => {
        return {
          message: "Teams consulted successfully",
          instance: teams,
          statusCode: 200,
        };
      })
      .catch((err: any) => {
        let message = "Error while consulting teams";
        let error = sequelizeErrorHandler(err);
        LogError(message + ": " + error);
        return {
          message,
          error,
          statusCode: 500,
        };
      });
    return response;
  }
  async createTeam(body: any): Promise<SuccessResponse | ErrorResponse> {
    let teamDtoErrors = toTeamDto(body);
    if (Array.isArray(teamDtoErrors)) {
      const response: ErrorResponse = {
        message: "Error while creating the team",
        error: teamDtoErrors.join(", "),
        statusCode: 400,
      };
      return response;
    }
    let team: TeamDTO = teamDtoErrors;
    return Team.create(team)
      .then((instance: Team) => {
        const response: SuccessResponse = {
          message: "Team created successfully",
          instance,
          statusCode: 201,
        };
        return response;
      })
      .catch((err: any) => {
        const message = "Error while creating team: " + JSON.stringify(team);
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
  async updateTeam(
    body: any,
    id: number
  ): Promise<SuccessResponse | ErrorResponse> {
    const updated_team = toTeamDto(body);
    let old_team = await Team.findByPk(id);
    let response: SuccessResponse | ErrorResponse;
    if (old_team == null) {
      let message = "Team not found";
      let error = `Team with id ${id} not found`;
      response = {
        message,
        error,
        statusCode: 404,
      };
      LogError(message + ": " + error);
    } else {
      response = await Team.update(updated_team, { where: { id: id } })
        .then(async () => {
          response = {
            message: "Team updated successfully",
            instance: await Team.findByPk(id),
            statusCode: 200,
          };
          return response;
        })
        .catch((err: any) => {
          let message = "Error while updating team ";
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
  async deleteTeam(id: number): Promise<SuccessResponse | ErrorResponse> {
    let team: Team | null = await Team.findByPk(id);
    let response: SuccessResponse | ErrorResponse;
    if (team == null) {
      let message: string = "Team not found";
      let error: string = "Team with id:" + id + " not found";
      response = {
        message,
        error,
        statusCode: 404,
      };

      LogError(message + ": " + error);

      return response;
    }

    response = await Team.destroy({ where: { id: id } })
      .then(() => {
        return {
          message: "Team deleted successfully",
          instance: null,
          statusCode: 200,
        };
      })
      .catch((err: any) => {
        let error = sequelizeErrorHandler(err);
        let message = "Error while deleting team with id:" + id;

        LogError(message + ": " + error);
        return {
          message,
          error,
          statusCode: 500,
        };
      });

    return response;
  }
  async getTeamById(id: number): Promise<SuccessResponse | ErrorResponse> {
    return Team.findByPk(id).then((instance: Team | null) => {
      let response: SuccessResponse | ErrorResponse;
      if (instance == null) {
        let message = "Team not found";
        let error = `Team with id ${id} not found`;
        response = {
          message,
          error,
          statusCode: 404,
        };
        LogError(message + ": " + error);
      } else {
        response = {
          message: "Team found",
          instance,
          statusCode: 200,
        };
      }
      return response;
    });
  }
}
