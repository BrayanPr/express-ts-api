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
const user_controller_1 = __importDefault(require("./user.controller"));
const team_controller_1 = __importDefault(require("./team.controller"));
const History_model_1 = __importDefault(require("../models/History.model"));
const utils_1 = require("../utils");
const app_1 = require("../app");
const User_model_1 = __importDefault(require("../models/User.model"));
class OperationController {
    constructor() {
        this.teamController = new team_controller_1.default();
        this.userController = new user_controller_1.default();
    }
    moveUser(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let user;
            let hisotryDtoErrors = (0, utils_1.toHistoryDto)(body);
            if (Array.isArray(hisotryDtoErrors)) {
                const response = {
                    message: "Error while moving user",
                    error: hisotryDtoErrors.join(", "),
                    statusCode: 400,
                };
                return response;
            }
            let historyDto = hisotryDtoErrors;
            let teamQuery = yield this.teamController.getTeamById(historyDto.teamJoin);
            if (teamQuery.statusCode != 200) {
                let queryResponse;
                if ("error" in teamQuery) {
                    queryResponse = teamQuery;
                }
                else {
                    const message = "Error while moving user: " + JSON.stringify(body);
                    const response = {
                        message,
                        error: "Unknown error",
                        statusCode: 500,
                    };
                    queryResponse = response;
                    (0, app_1.LogError)(message + " " + response.error);
                }
                return queryResponse;
            }
            let userQuery = yield this.userController.getUserById(historyDto.user);
            if (userQuery.statusCode != 200) {
                let queryResponse;
                if ("error" in userQuery) {
                    queryResponse = userQuery;
                }
                else {
                    const message = "Error while moving user: " + JSON.stringify(body);
                    const response = {
                        message,
                        error: "Unknown error",
                        statusCode: 500,
                    };
                    queryResponse = response;
                    (0, app_1.LogError)(message + " " + response.error);
                }
                return queryResponse;
            }
            else {
                if ("instance" in userQuery) {
                    user = userQuery.instance;
                }
                else {
                    const message = "Error while consulting user: " + JSON.stringify(body);
                    const response = {
                        message,
                        error: "Unknown error",
                        statusCode: 500,
                    };
                    (0, app_1.LogError)(message + " " + response.error);
                    return response;
                }
            }
            if (user.teamId == historyDto.teamJoin) {
                let response = {
                    message: "Error while moving user",
                    error: "User: " + user.id + " is already on team:" + user.teamId,
                    statusCode: 400,
                };
                return response;
            }
            historyDto.teamLeft = user.teamId;
            let moveUserError;
            let userUpdated = yield User_model_1.default.update({ teamId: historyDto.teamJoin }, {
                where: { id: user.id },
            })
                .then(() => true)
                .catch((err) => {
                moveUserError = err;
                return false;
            });
            if (!userUpdated) {
                let response = {
                    message: "Error while trying to update user",
                    error: (0, utils_1.sequelizeErrorHandler)(moveUserError),
                    statusCode: 500,
                };
                return response;
            }
            return yield History_model_1.default.create(historyDto)
                .then((instance) => {
                let response = {
                    message: "User moved succesfully",
                    instance,
                    statusCode: 201,
                };
                return response;
            })
                .catch((err) => __awaiter(this, void 0, void 0, function* () {
                let message = "Error while moving user";
                let error = (0, utils_1.sequelizeErrorHandler)(err);
                let response = {
                    message,
                    error,
                    statusCode: 500,
                };
                (0, app_1.LogError)(message + ": " + error);
                user.teamId = historyDto.teamLeft;
                yield User_model_1.default.update((0, utils_1.toUserDto)(user), { where: { id: user.id } });
                return response;
            }));
        });
    }
    getAllHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield History_model_1.default.findAll()
                .then((instance) => {
                let response = {
                    message: "History consulted successully",
                    instance,
                    statusCode: 200,
                };
                return response;
            })
                .catch((err) => {
                let message = "Error while consulting users";
                let error = (0, utils_1.sequelizeErrorHandler)(err);
                let response = {
                    message,
                    error,
                    statusCode: 500,
                };
                return response;
            });
        });
    }
    getHistoryByDates(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let historyByDatesRequestErrors = (0, utils_1.toHistoryByDates)(body);
            if (Array.isArray(historyByDatesRequestErrors)) {
                const response = {
                    message: "Error while consulting dates",
                    error: historyByDatesRequestErrors.join(", "),
                    statusCode: 400,
                };
                return response;
            }
            let req = historyByDatesRequestErrors;
            return yield History_model_1.default.findAll({
                where: {
                    date: {
                        $between: [req.startDate, req.endDate],
                    },
                },
            })
                .then((instance) => {
                let response = {
                    message: "History consulted successully",
                    instance,
                    statusCode: 200,
                };
                return response;
            })
                .catch((err) => {
                let message = "Error while consulting users";
                let error = (0, utils_1.sequelizeErrorHandler)(err);
                let response = {
                    message,
                    error,
                    statusCode: 500,
                };
                return response;
            });
        });
    }
}
exports.default = OperationController;
