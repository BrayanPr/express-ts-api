"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Team_model_1 = __importDefault(require("./Team.model"));
const User_model_1 = __importDefault(require("./User.model"));
let History = class History extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        allowNull: true,
        autoIncrement: true,
        primaryKey: true
    }),
    __metadata("design:type", Number)
], History.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_model_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        allowNull: false
    }),
    __metadata("design:type", Number)
], History.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_model_1.default, { foreignKey: 'user' }),
    __metadata("design:type", Object)
], History.prototype, "userRef", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Team_model_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        allowNull: true
    }),
    __metadata("design:type", Object)
], History.prototype, "teamLeft", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Team_model_1.default, { foreignKey: 'teamLeft' }),
    __metadata("design:type", Object)
], History.prototype, "teamLeftRef", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Team_model_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        allowNull: false
    }),
    __metadata("design:type", Number)
], History.prototype, "teamJoin", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Team_model_1.default, { foreignKey: 'teamJoin' }),
    __metadata("design:type", Object)
], History.prototype, "teamJoinRef", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW
    }),
    __metadata("design:type", Date)
], History.prototype, "date", void 0);
History = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: false,
        tableName: 'history'
    })
], History);
exports.default = History;
