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
exports.verifyIsSuperAdmin = exports.verifyIsAdmin = exports.verifyIsUser = exports.isTokenExpired = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const userController = new user_controller_1.default();
function getToken(headers) {
    let token = headers.authorization;
    if (token == undefined || token == null)
        return null;
    else
        return token;
}
const isTokenExpired = (token) => {
    try {
        const { exp } = (0, jsonwebtoken_1.decode)(token);
        const expirationDatetimeInSeconds = exp * 1000;
        return Date.now() >= expirationDatetimeInSeconds;
    }
    catch (_a) {
        return true;
    }
};
exports.isTokenExpired = isTokenExpired;
const UnahutorizedResponse = (message, error = "token") => {
    let response = {
        message,
        error,
        statusCode: 401
    };
    return response;
};
function verifyToken(req, res, next, user_type) {
    return __awaiter(this, void 0, void 0, function* () {
        let token = getToken(req.headers);
        if (token == null) {
            let response = UnahutorizedResponse("Token were not provided");
            res.status(response.statusCode).send(response);
            return;
        }
        if ((0, exports.isTokenExpired)(token)) {
            let response = UnahutorizedResponse("Token is expired");
            res.status(response.statusCode).send(response);
            return;
        }
        let aux = (0, jsonwebtoken_1.verify)(token, "enchiladas_verdes");
        if (typeof aux == "string") {
            let response = UnahutorizedResponse("Token is not valid");
            res.status(response.statusCode).send(response);
            return;
        }
        let payload = aux;
        if (typeof payload.user_id != "number") {
            let response = UnahutorizedResponse("Token is not valid");
            res.status(response.statusCode).send(response);
            return;
        }
        let user_id = payload.user_id;
        let user_role = payload.role;
        let queryUser = yield userController.getUserById(user_id);
        let user = queryUser.instance;
        if (user == undefined) {
            let response = UnahutorizedResponse("Token is not valid");
            res.status(response.statusCode).send(response);
            return;
        }
        if (user.role != user_role) {
            let response = UnahutorizedResponse("Token is not valid");
            res.status(response.statusCode).send(response);
            return;
        }
        if ((user_type == 1) && (user_role == "user" || user_role == "admin" || user_role == "super_admin"))
            next();
        else if ((user_type == 2) && (user_role == "admin" || user_role == "super_admin"))
            next();
        else if (user_type == 3 && user_role == "super_admin")
            next();
        else {
            let response = UnahutorizedResponse("You have not permissions to perform this action", "Not enougth permissions");
            res.status(response.statusCode).send(response);
            return;
        }
    });
}
// Your custom "middleware" function:
const verifyIsUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    verifyToken(req, res, next, 1);
});
exports.verifyIsUser = verifyIsUser;
// Your custom "middleware" function:
const verifyIsAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    verifyToken(req, res, next, 2);
});
exports.verifyIsAdmin = verifyIsAdmin;
// Your custom "middleware" function:
const verifyIsSuperAdmin = (req, res, next) => {
    verifyToken(req, res, next, 3);
};
exports.verifyIsSuperAdmin = verifyIsSuperAdmin;
