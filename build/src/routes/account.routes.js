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
const account_controller_1 = __importDefault(require("../controllers/account.controller"));
const accountRoutes = express_1.default.Router();
const controller = new account_controller_1.default();
accountRoutes.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield controller.getAllAccounts();
    res.status(response.statusCode).send(response);
}));
accountRoutes.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id;
    try {
        id = parseInt(req.params.id);
    }
    catch (err) {
        let response = {
            message: "account id is not valid",
            error: "account id must be number",
            statusCode: 400
        };
        res.status(response.statusCode).send(response);
        return;
    }
    let response = yield controller.updateAccount(req.body, id);
    res.status(response.statusCode).send(response);
}));
accountRoutes.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id;
    try {
        id = parseInt(req.params.id);
    }
    catch (err) {
        let response = {
            message: "account id is not valid",
            error: "account id must be number",
            statusCode: 400
        };
        res.status(response.statusCode).send(response);
        return;
    }
    let response = yield controller.deleteAccount(id);
    res.status(response.statusCode).send(response);
}));
accountRoutes.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id;
    try {
        id = parseInt(req.params.id);
    }
    catch (err) {
        let response = {
            message: "account id is not valid",
            error: "account id must be number",
            statusCode: 400
        };
        res.status(response.statusCode).send(response);
        return;
    }
    let response = yield controller.getAccountById(id);
    res.status(response.statusCode).send(response);
}));
accountRoutes.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield controller.createAccount(req.body);
    res.status(response.statusCode).send(response);
}));
exports.default = accountRoutes;
