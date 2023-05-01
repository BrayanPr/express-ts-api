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
const team_controller_1 = __importDefault(require("../controllers/team.controller"));
const jwt_middlewares_1 = require("../middlewares/jwt.middlewares");
const teamRoutes = express_1.default.Router();
const controller = new team_controller_1.default();
teamRoutes.use(jwt_middlewares_1.verifyIsAdmin);
teamRoutes.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield controller.getAllTeams();
    res.status(response.statusCode).send(response);
}));
teamRoutes.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id;
    try {
        id = parseInt(req.params.id);
    }
    catch (err) {
        let response = {
            message: "team id is not valid",
            error: "team id must be number",
            statusCode: 400,
        };
        res.status(response.statusCode).send(response);
        return;
    }
    let response = yield controller.getTeamById(id);
    res.status(response.statusCode).send(response);
}));
teamRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield controller.createTeam(req.body);
    res.status(response.statusCode).send(response);
}));
teamRoutes.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id;
    try {
        id = parseInt(req.params.id);
    }
    catch (err) {
        let response = {
            message: "team id is not valid",
            error: "team id must be number",
            statusCode: 400,
        };
        res.status(response.statusCode).send(response);
        return;
    }
    let response = yield controller.updateTeam(req.body, id);
    res.status(response.statusCode).send(response);
}));
teamRoutes.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id;
    try {
        id = parseInt(req.params.id);
    }
    catch (err) {
        let response = {
            message: "team id is not valid",
            error: "team id must be number",
            statusCode: 400,
        };
        res.status(response.statusCode).send(response);
        return;
    }
    let response = yield controller.deleteTeam(id);
    res.status(response.statusCode).send(response);
}));
exports.default = teamRoutes;
