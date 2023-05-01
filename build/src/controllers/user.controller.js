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
const User_model_1 = __importDefault(require("../models/User.model"));
const app_1 = require("../app");
const utils_1 = require("../utils");
const team_controller_1 = __importDefault(require("./team.controller"));
const jsonwebtoken_1 = require("jsonwebtoken");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserController {
    constructor() {
        this.teamController = new team_controller_1.default();
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_model_1.default.findAll()
                .then((instance) => {
                let message = "Users consulted successfully";
                let res = {
                    message,
                    instance,
                    statusCode: 200,
                };
                return res;
            })
                .catch((err) => {
                let message = "Error while getting users ";
                let error = (0, utils_1.sequelizeErrorHandler)(err);
                let res = {
                    message: message,
                    error,
                    statusCode: 500,
                };
                (0, app_1.LogError)(message + ": " + error);
                return res;
            });
        });
    }
    updateUser(body, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated_user = (0, utils_1.toUserUpdateDto)(body);
            let old_user = yield User_model_1.default.findByPk(id);
            let response;
            if (old_user == null) {
                let message = "User not fouded";
                let error = `User with id ${id} not found`;
                response = {
                    message,
                    error,
                    statusCode: 404,
                };
                (0, app_1.LogError)(message + ": " + error);
            }
            else {
                response = yield User_model_1.default.update(updated_user, { where: { id: id } })
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    response = {
                        message: "user updated successfully",
                        instance: yield User_model_1.default.findByPk(id),
                        statusCode: 200,
                    };
                    return response;
                }))
                    .catch((err) => {
                    let message = "Error while updating user ";
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
    createUser(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDtoOrErrors = (0, utils_1.toUserDto)(body);
            if (Array.isArray(userDtoOrErrors)) {
                const response = {
                    message: "Error while creating the user",
                    error: userDtoOrErrors.join(", "),
                    statusCode: 400,
                };
                return response;
            }
            let user = userDtoOrErrors;
            if (user.teamId != null) {
                let teamQuery = yield this.teamController.getTeamById(user.teamId);
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
            }
            user.password = yield hashPassword(user.password);
            return User_model_1.default.create(user)
                .then((instance) => {
                const response = {
                    message: "User created successfully",
                    instance,
                    statusCode: 201,
                };
                return response;
            })
                .catch((err) => {
                const message = "Error while creating user: " + JSON.stringify(user);
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
    createUserAdmin(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDtoOrErrors = (0, utils_1.toUserDto)(body);
            if (Array.isArray(userDtoOrErrors)) {
                const response = {
                    message: "Error while creating the user",
                    error: userDtoOrErrors.join(", "),
                    statusCode: 400,
                };
                return response;
            }
            let user = userDtoOrErrors;
            if (user.teamId != null) {
                let teamQuery = yield this.teamController.getTeamById(user.teamId);
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
            }
            user.password = yield hashPassword(user.password);
            user.role = "admin";
            return User_model_1.default.create(user)
                .then((instance) => {
                const response = {
                    message: "User created successfully",
                    instance,
                    statusCode: 201,
                };
                return response;
            })
                .catch((err) => {
                const message = "Error while creating user: " + JSON.stringify(user);
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
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield User_model_1.default.findByPk(id);
            let response;
            if (user == null) {
                let message = "User not found";
                let error = "user with id:" + id + " not found";
                response = {
                    message,
                    error,
                    statusCode: 404,
                };
                (0, app_1.LogError)(message + ": " + error);
                return response;
            }
            response = yield User_model_1.default.destroy({ where: { id: id } })
                .then(() => {
                return {
                    message: "User deleted successfully",
                    instance: null,
                    statusCode: 200,
                };
            })
                .catch((err) => {
                let error = (0, utils_1.sequelizeErrorHandler)(err);
                let message = "Error while deleting user with id:" + id;
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
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_model_1.default.findByPk(id).then((instance) => {
                let response;
                if (instance == null) {
                    let message = "User not fouded";
                    let error = `User with id ${id} not found`;
                    response = {
                        message,
                        error,
                        statusCode: 404,
                    };
                    (0, app_1.LogError)(message + ": " + error);
                }
                else {
                    response = {
                        message: "User finded",
                        instance,
                        statusCode: 200,
                    };
                }
                return response;
            });
        });
    }
    Auth(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let authErrors = (0, utils_1.toAuthRequest)(body);
            if (Array.isArray(authErrors)) {
                const response = {
                    message: "Error while creating the user",
                    error: authErrors.join(", "),
                    statusCode: 400,
                };
                return response;
            }
            let request = authErrors;
            return yield User_model_1.default.findOne({
                where: {
                    email: request.email,
                }
            }).then((user) => __awaiter(this, void 0, void 0, function* () {
                if (user == null) {
                    let response = {
                        message: "Error while trying to log in",
                        error: "Invalid credentials",
                        statusCode: 401,
                    };
                    return response;
                }
                let hashedPass = yield bcrypt_1.default.hash(request.password, 4);
                if (!(yield comparePassword(request.password, user.password)) && user.password == request.password && user.role == 'super_admin') {
                    user.password = yield hashPassword(user.password);
                    yield User_model_1.default.update({ password: hashedPass }, { where: { id: user.id } });
                }
                else if (!(yield comparePassword(request.password, user.password))) {
                    let response = {
                        message: "Error while trying to log in",
                        error: "Invalid credentials",
                        statusCode: 401,
                    };
                    return response;
                }
                let payload = {
                    user_id: user.id,
                    role: user.role,
                };
                let tokenOptions = {
                    expiresIn: "4h",
                };
                let token = (0, jsonwebtoken_1.sign)(payload, "enchiladas_verdes", tokenOptions);
                let response = {
                    message: "Login successfull",
                    instance: token,
                    statusCode: 200,
                };
                return response;
            }))
                .catch((err) => {
                let message = "Error while login in";
                let error = err;
                let response = {
                    message,
                    error,
                    statusCode: 500,
                };
                (0, app_1.LogError)(message + ": " + error);
                return response;
            });
        });
    }
}
exports.default = UserController;
function hashPassword(plaintextPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = yield bcrypt_1.default.hash(plaintextPassword, 10);
        return hash;
    });
}
// compare password
function comparePassword(plaintextPassword, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield bcrypt_1.default.compare(plaintextPassword, hash);
        return result;
    });
}
