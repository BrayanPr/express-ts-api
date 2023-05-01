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
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const jwt_middlewares_1 = require("../middlewares/jwt.middlewares");
const userRoutes = express_1.default.Router();
const controller = new user_controller_1.default();
userRoutes.get('/', jwt_middlewares_1.verifyIsAdmin, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield controller.getAllUsers();
    res.status(response.statusCode).send(response);
}));
userRoutes.get('/getProfile', jwt_middlewares_1.verifyIsUser, (_req, res) => {
    res.send("My profile");
});
userRoutes.put('/:id', jwt_middlewares_1.verifyIsAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id;
    try {
        id = parseInt(req.params.id);
    }
    catch (err) {
        let response = {
            message: "user id is not valid",
            error: "user id must be number",
            statusCode: 400
        };
        res.status(response.statusCode).send(response);
        return;
    }
    let response = yield controller.updateUser(req.body, id);
    res.status(response.statusCode).send(response);
}));
userRoutes.delete('/:id', jwt_middlewares_1.verifyIsAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id;
    try {
        id = parseInt(req.params.id);
    }
    catch (err) {
        let response = {
            message: "user id is not valid",
            error: "user id must be number",
            statusCode: 400
        };
        res.status(response.statusCode).send(response);
        return;
    }
    let response;
    // if(req.user.id == id)
    //     response = {
    //         message:"you cannot delete yout own user",
    //         error:"trying to delete self-user",
    //         statusCode:400
    //     }
    // else
    response = yield controller.deleteUser(id);
    res.status(response.statusCode).send(response);
}));
userRoutes.get('/:id', jwt_middlewares_1.verifyIsAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id;
    try {
        id = parseInt(req.params.id);
    }
    catch (err) {
        let response = {
            message: "user id is not valid",
            error: "user id must be number",
            statusCode: 400
        };
        res.status(response.statusCode).send(response);
        return;
    }
    let response = yield controller.getUserById(id);
    res.status(response.statusCode).send(response);
}));
userRoutes.post('/', jwt_middlewares_1.verifyIsAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield controller.createUser(req.body);
    res.status(response.statusCode).send(response);
}));
userRoutes.post('/admin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield controller.createUserAdmin(req.body);
    res.status(response.statusCode).send(response);
}));
exports.default = userRoutes;
