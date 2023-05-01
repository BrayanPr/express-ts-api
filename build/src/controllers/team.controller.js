"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Team_model_1 = __importDefault(require("../models/Team.model"));
const app_1 = require("../app");
const utils_1 = require("../utils");
class TeamController {
    getAllTeams() {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            response = yield Team_model_1.default.findAll()
                .then((teams) => {
                return {
                    message: "Teams consulted successfully",
                    instance: teams,
                    statusCode: 200,
                };
            })
                .catch((err) => {
                let message = "Error while consulting teams";
                let error = (0, utils_1.sequelizeErrorHandler)(err);
                (0, app_1.LogError)(message + ": " + error);
                return {
                    message,
                    error,
                    statusCode: 500,
                };
            });
            return response;
        });
    }
    createTeam(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let teamDtoErrors = (0, utils_1.toTeamDto)(body);
            if (Array.isArray(teamDtoErrors)) {
                const response = {
                    message: "Error while creating the team",
                    error: teamDtoErrors.join(", "),
                    statusCode: 400,
                };
                return response;
            }
            let team = teamDtoErrors;
            return Team_model_1.default.create(team)
                .then((instance) => {
                const response = {
                    message: "Team created successfully",
                    instance,
                    statusCode: 201,
                };
                return response;
            })
                .catch((err) => {
                const message = "Error while creating team: " + JSON.stringify(team);
                const error = (0, utils_1.sequelizeErrorHandler)(err);
                const response = {
                    message,
                    error,
                    statusCode: 500,
                };
                (0, app_1.LogError)(message + " " + error);
                return response;
            });
        });
    }
    updateTeam(body, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated_team = (0, utils_1.toTeamDto)(body);
            let old_team = yield Team_model_1.default.findByPk(id);
            let response;
            if (old_team == null) {
                let message = "Team not found";
                let error = `Team with id ${id} not found`;
                response = {
                    message,
                    error,
                    statusCode: 404,
                };
                (0, app_1.LogError)(message + ": " + error);
            }
            else {
                response = yield Team_model_1.default.update(updated_team, { where: { id: id } })
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    response = {
                        message: "Team updated successfully",
                        instance: yield Team_model_1.default.findByPk(id),
                        statusCode: 200,
                    };
                    return response;
                }))
                    .catch((err) => {
                    let message = "Error while updating team ";
                    let error = (0, utils_1.sequelizeErrorHandler)(err);
                    let response = {
                        message,
                        error,
                        statusCode: 500,
                    };
                    (0, app_1.LogError)(message + ": " + error);
                    return response;
                });
            }
            return response;
        });
    }
    deleteTeam(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let team = yield Team_model_1.default.findByPk(id);
            let response;
            if (team == null) {
                let message = "Team not found";
                let error = "Team with id:" + id + " not found";
                response = {
                    message,
                    error,
                    statusCode: 404,
                };
                (0, app_1.LogError)(message + ": " + error);
                return response;
            }
            response = yield Team_model_1.default.destroy({ where: { id: id } })
                .then(() => {
                return {
                    message: "Team deleted successfully",
                    instance: null,
                    statusCode: 200,
                };
            })
                .catch((err) => {
                let error = (0, utils_1.sequelizeErrorHandler)(err);
                let message = "Error while deleting team with id:" + id;
                (0, app_1.LogError)(message + ": " + error);
                return {
                    message,
                    error,
                    statusCode: 500,
                };
            });
            return response;
        });
    }
    getTeamById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return Team_model_1.default.findByPk(id).then((instance) => {
                let response;
                if (instance == null) {
                    let message = "Team not found";
                    let error = `Team with id ${id} not found`;
                    response = {
                        message,
                        error,
                        statusCode: 404,
                    };
                    (0, app_1.LogError)(message + ": " + error);
                }
                else {
                    response = {
                        message: "Team found",
                        instance,
                        statusCode: 200,
                    };
                }
                return response;
            });
        });
    }
}
exports.default = TeamController;
