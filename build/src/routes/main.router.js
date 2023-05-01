"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_routes_1 = __importDefault(require("./users.routes"));
const teams_routes_1 = __importDefault(require("./teams.routes"));
const account_routes_1 = __importDefault(require("./account.routes"));
const operation_routes_1 = __importDefault(require("./operation.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const jwt_middlewares_1 = require("../middlewares/jwt.middlewares");
const router = express_1.default.Router();
router.use('/accounts/', jwt_middlewares_1.verifyIsAdmin, account_routes_1.default);
router.use('/teams/', jwt_middlewares_1.verifyIsAdmin, teams_routes_1.default);
router.use('/users/', users_routes_1.default);
router.use('/operations/', jwt_middlewares_1.verifyIsAdmin, operation_routes_1.default);
router.use('/', auth_routes_1.default);
exports.default = router;
