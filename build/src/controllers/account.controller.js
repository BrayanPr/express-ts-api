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
const Account_model_1 = __importDefault(require("../models/Account.model"));
const app_1 = require("../app");
const utils_1 = require("../utils");
const team_controller_1 = __importDefault(require("./team.controller"));
// import { Route, Get, Post, Put, Delete } from "tsoa";
class AccountController {
    constructor() {
        this.teamController = new team_controller_1.default();
    }
    getAllAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            response = yield Account_model_1.default.findAll()
                .then((accounts) => {
                return {
                    message: "Accounts consulted successfully",
                    instance: accounts,
                    statusCode: 200,
                };
            })
                .catch((err) => {
                let message = "Error while consulting accounts";
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
    createAccount(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let accountDtoErrors = (0, utils_1.toAccountDto)(body);
            if (Array.isArray(accountDtoErrors)) {
                const response = {
                    message: "Error while creating the team",
                    error: accountDtoErrors.join(", "),
                    statusCode: 400,
                };
                return response;
            }
            let account = accountDtoErrors;
            let teamQuery = yield this.teamController.getTeamById(account.teamId);
            if (teamQuery.statusCode != 200) {
                let queryResponse;
                if ("error" in teamQuery) {
                    queryResponse = teamQuery;
                }
                else {
                    const message = "Error while creating account: " + JSON.stringify(body);
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
            return Account_model_1.default.create(account)
                .then((instance) => {
                const response = {
                    message: "Account created successfully",
                    instance,
                    statusCode: 201,
                };
                return response;
            })
                .catch((err) => {
                const message = "Error while creating account: " + JSON.stringify(body);
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
    updateAccount(body, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let old_account = yield Account_model_1.default.findByPk(id);
            let response;
            if (old_account == null) {
                let message = "Account not found";
                let error = `Account with id ${id} not found`;
                response = {
                    message,
                    error,
                    statusCode: 404,
                };
                (0, app_1.LogError)(message + ": " + error);
            }
            else {
                let accountDtoErrors = (0, utils_1.toAccountUpdateDto)(body);
                if (Array.isArray(accountDtoErrors)) {
                    const response = {
                        message: "Error while updating the team",
                        error: accountDtoErrors.join(", "),
                        statusCode: 400,
                    };
                    return response;
                }
                let account = accountDtoErrors;
                let teamQuery = yield this.teamController.getTeamById(account.teamId);
                if ((teamQuery.statusCode != 200) && (account.teamId != undefined && account.teamId != null)) {
                    let queryResponse;
                    if ("error" in teamQuery) {
                        queryResponse = teamQuery;
                    }
                    else {
                        const message = "Error while creating account: " + JSON.stringify(body);
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
                response = yield Account_model_1.default.update(account, { where: { id: id } })
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    response = {
                        message: "Account updated successfully",
                        instance: yield Account_model_1.default.findByPk(id),
                        statusCode: 200,
                    };
                    return response;
                }))
                    .catch((err) => {
                    let message = "Error while updating account ";
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
    deleteAccount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let account = yield Account_model_1.default.findByPk(id);
            let response;
            if (account == null) {
                let message = "Account not found";
                let error = "Account with id:" + id + " not found";
                response = {
                    message,
                    error,
                    statusCode: 404,
                };
                (0, app_1.LogError)(message + ": " + error);
                return response;
            }
            response = yield Account_model_1.default.destroy({ where: { id: id } })
                .then(() => {
                return {
                    message: "Account deleted successfully",
                    instance: null,
                    statusCode: 200,
                };
            })
                .catch((err) => {
                let error = (0, utils_1.sequelizeErrorHandler)(err);
                let message = "Error while deleting account with id:" + id;
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
    getAccountById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return Account_model_1.default.findByPk(id).then((instance) => {
                let response;
                if (instance == null) {
                    let message = "Account not found";
                    let error = `Account with id ${id} not found`;
                    response = {
                        message,
                        error,
                        statusCode: 404,
                    };
                    (0, app_1.LogError)(message + ": " + error);
                }
                else {
                    response = {
                        message: "Account found",
                        instance,
                        statusCode: 200,
                    };
                }
                return response;
            });
        });
    }
}
exports.default = AccountController;
