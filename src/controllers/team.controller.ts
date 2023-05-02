import { ErrorResponse, SuccessResponse, TeamDTO } from "../../types";
import Team from "../models/Team.model";
import { sequelizeErrorHandler, toTeamDto } from "../utils";
import {
  BadRequestResponse,
  CreatedResponse,
  DeletedResponse,
  FoundResponse,
  NotFoundResponse,
  ServerErrorResponse,
  UpdatedResponse,
} from "../responses";
export default class TeamController {
  async getAllTeams(): Promise<SuccessResponse | ErrorResponse> {
    return await Team.findAll()
      .then((teams: Array<Team>) => FoundResponse(teams, "Teams"))
      .catch((err: any) =>
        ServerErrorResponse(
          sequelizeErrorHandler(err),
          "Error while consulting teams"
        )
      );
  }
  async createTeam(body: any): Promise<SuccessResponse | ErrorResponse> {
    let teamDtoErrors = toTeamDto(body);
    if (Array.isArray(teamDtoErrors))
      return BadRequestResponse(teamDtoErrors.join(", "));

    let team: TeamDTO = teamDtoErrors;
    return Team.create(team)
      .then((instance: Team) => CreatedResponse(instance, "Team"))
      .catch((err: any) =>
        ServerErrorResponse(
          sequelizeErrorHandler(err),
          "Error while creating team: " + JSON.stringify(team)
        )
      );
  }
  async updateTeam(
    body: any,
    id: number
  ): Promise<SuccessResponse | ErrorResponse> {
    const updated_team = toTeamDto(body);
    let old_team = await Team.findByPk(id);
    if (old_team == null) return NotFoundResponse(id, "Team");

    return await Team.update(updated_team, { where: { id: id } })
      .then(async () => UpdatedResponse(true, "Team"))
      .catch((err: any) =>
        ServerErrorResponse(
          sequelizeErrorHandler(err),
          "Error while updating team"
        )
      );
  }
  async deleteTeam(id: number): Promise<SuccessResponse | ErrorResponse> {
    let team: Team | null = await Team.findByPk(id);
    if (team == null) return NotFoundResponse(id, "Team");

    return await Team.destroy({ where: { id: id } })
      .then(() => DeletedResponse(true, "Team"))
      .catch((err: any) =>
        ServerErrorResponse(
          sequelizeErrorHandler(err),
          `Error while deleting team with id:${id}`
        )
      );
  }
  async getTeamById(id: number): Promise<SuccessResponse | ErrorResponse> {
    const instance = Team.findByPk(id);
    if (instance == null) return NotFoundResponse(id, "Team");
    return FoundResponse(instance, "Team");
  }
}
