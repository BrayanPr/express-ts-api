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
const operation_controller_1 = __importDefault(require("../controllers/operation.controller"));
const jwt_middlewares_1 = require("../middlewares/jwt.middlewares");
const operationRoutes = express_1.default.Router();
const controller = new operation_controller_1.default();
operationRoutes.use(jwt_middlewares_1.verifyIsAdmin);
operationRoutes.post('/move', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield controller.moveUser(req.body);
    res.status(response.statusCode).send(response);
}));
operationRoutes.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield controller.getAllHistory();
    res.status(response.statusCode).send(response);
}));
operationRoutes.post('/dates', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield controller.getHistoryByDates(req.body);
    res.status(response.statusCode).send(response);
}));
exports.default = operationRoutes;
