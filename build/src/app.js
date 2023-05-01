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
exports.LogError = void 0;
const express_1 = __importDefault(require("express"));
const utils_1 = __importDefault(require("./utils"));
const winston_1 = require("winston");
const main_router_1 = __importDefault(require("./routes/main.router"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_configuration_1 = __importDefault(require("../swagger.configuration"));
var logger = (0, winston_1.createLogger)({
    transports: [new winston_1.transports.Console()],
    format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp(), winston_1.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
    })),
});
function LogError(error) {
    logger.error(error);
}
exports.LogError = LogError;
class App {
    constructor(port, test = false) {
        this.port = port;
        this.specs = (0, swagger_jsdoc_1.default)(swagger_configuration_1.default);
        this.configure = (test) => __awaiter(this, void 0, void 0, function* () {
            this.app.use(express_1.default.json()); //Hace parce del body para que sea un json
            yield (0, utils_1.default)(test);
        });
        this.routes = () => {
            this.app.use('/docs/', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(this.specs));
            this.app.use('/api/', main_router_1.default);
        };
        this.app = (0, express_1.default)();
        this.configure(test);
        this.routes();
        this.listen();
    }
    listen() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.app.listen(this.port);
            logger.info("listening app at http://localhost:" + this.port);
        });
    }
}
exports.default = App;
