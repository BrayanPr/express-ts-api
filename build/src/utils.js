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
exports.sequelizeErrorHandler = exports.toUserDto = exports.toAuthRequest = exports.toHistoryByDates = exports.toTeamDto = exports.toAccountDto = exports.toAccountUpdateDto = exports.toHistoryDto = exports.toUserUpdateDto = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const User_model_1 = __importDefault(require("./models/User.model"));
const Team_model_1 = __importDefault(require("./models/Team.model"));
const History_model_1 = __importDefault(require("./models/History.model"));
const Account_model_1 = __importDefault(require("./models/Account.model"));
const validateString = (value, name) => {
    if (!value || value.trim().length === 0) {
        return (`${name} is required`);
    }
    return null;
};
function validatePassword(password) {
    const minLength = 8;
    const minUppercase = 1;
    const minSpecialChars = 1;
    const uppercaseRegex = /[A-Z]/;
    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (!password) {
        return "password is required";
    }
    // Check password length
    if (password.length < minLength) {
        return `Password must be at least ${minLength} characters long.`;
    }
    // Check uppercase letters
    const uppercaseMatches = password.match(uppercaseRegex);
    if (!uppercaseMatches || uppercaseMatches.length < minUppercase) {
        return `password must contain at least ${minUppercase} uppercase letter(s).`;
    }
    // Check special characters
    const specialCharsMatches = password.match(specialCharsRegex);
    if (!specialCharsMatches || specialCharsMatches.length < minSpecialChars) {
        return `password must contain at least ${minSpecialChars} special character(s).`;
    }
    // Password passes all checks
    return null;
}
const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        return ('email is required');
    }
    if (!regex.test(email)) {
        return ("email is not valid");
    }
    return null;
};
const validateEnglishLevel = (englishLevel) => {
    if (englishLevel && (englishLevel != 'A1' && englishLevel != 'A2' && englishLevel != 'B1' && englishLevel != 'B2' && englishLevel != 'C1' && englishLevel != 'C2')) {
        return "englishLevel is not valid";
    }
    return null;
};
function toUserUpdateDto(body) {
    const { name, cv, experience, englishLevel } = body;
    let errors = [];
    if (name != undefined && name != null) {
        let verifName = validateString(name, 'name');
        if (verifName != null)
            errors.push(verifName);
    }
    let verifyEnglishLevel = validateEnglishLevel(englishLevel);
    if (verifyEnglishLevel != null)
        errors.push(verifyEnglishLevel);
    if (cv != undefined && cv != null && typeof cv !== 'string')
        errors.push('cv must be string');
    if (experience != undefined && experience != null && typeof experience !== 'string')
        errors.push('experience must be string');
    if (errors.length == 0) {
        let user = { name, cv, experience, englishLevel };
        return user;
    }
    else {
        return errors;
    }
}
exports.toUserUpdateDto = toUserUpdateDto;
function toHistoryDto(body) {
    const { user, teamJoin } = body;
    let errors = [];
    if (user == null || user == undefined)
        errors.push("user is required");
    else if (typeof user != "number")
        errors.push("user must be integer");
    if (teamJoin == null || teamJoin == undefined)
        errors.push("teamJoin is required");
    else if (typeof teamJoin != "number")
        errors.push("teamJoin must be number");
    if (errors.length > 0)
        return errors;
    let history = {
        user, teamJoin, teamLeft: null
    };
    return history;
}
exports.toHistoryDto = toHistoryDto;
function toAccountUpdateDto(body) {
    const { name, client, manager, teamId } = body;
    let errors = [];
    if (name != null && name != undefined && typeof name != "string")
        errors.push("name must be string");
    if (client != null && client != undefined && typeof client != "string")
        errors.push("client must be string");
    if (manager != null && manager != undefined && typeof manager != "string")
        errors.push("manager must be string");
    if (name != null && name != undefined && typeof name != "string")
        if (teamId != null && teamId != undefined && typeof teamId != 'number')
            errors.push('teamId must be numeric');
    if (errors.length > 0)
        return errors;
    let accountDto = {
        name,
        client,
        manager,
        teamId,
    };
    return accountDto;
}
exports.toAccountUpdateDto = toAccountUpdateDto;
function toAccountDto(body) {
    const { name, client, manager, teamId } = body;
    let errors = [];
    let verifName = validateString(name, 'name');
    if (verifName != null)
        errors.push(verifName);
    let verifyCustomer = validateString(client, 'client');
    if (verifyCustomer != null)
        errors.push(verifyCustomer);
    let verifyManager = validateString(manager, 'manager');
    if (verifyManager != null) {
        errors.push(verifyManager);
    }
    if (teamId == null || teamId == undefined)
        errors.push("teamId is required");
    if (teamId != null && teamId != undefined && typeof teamId != 'number')
        errors.push('teamId must be numeric');
    if (errors.length > 0)
        return errors;
    let accountDto = {
        name,
        client,
        manager,
        teamId,
    };
    return accountDto;
}
exports.toAccountDto = toAccountDto;
function toTeamDto(body) {
    const { name, description } = body;
    let errors = [];
    let verifName = validateString(name, 'name');
    if (verifName != null)
        errors.push(verifName);
    if ((description != undefined && description != null) && typeof description != 'string')
        errors.push("description must be string");
    if (errors.length == 0)
        return { name, description };
    return errors;
}
exports.toTeamDto = toTeamDto;
function toHistoryByDates(body) {
    let { startDate, endDate } = body;
    const _startDate = Date.parse(startDate);
    const _endDate = Date.parse(endDate);
    let errors = [];
    if (startDate == null || startDate == undefined)
        errors.push("startDate is required");
    else if (isNaN(_startDate))
        errors.push("startDate must be date type");
    if (endDate == null || endDate == undefined)
        errors.push("endDate is required");
    else if (isNaN(_endDate))
        errors.push("end must be date type");
    if (errors.length > 0)
        return errors;
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    let response = {
        startDate,
        endDate
    };
    return response;
}
exports.toHistoryByDates = toHistoryByDates;
function toAuthRequest(body) {
    const { email, password } = body;
    let errors = [];
    let verifyEmail = validateEmail(email);
    if (verifyEmail != null)
        errors.push(verifyEmail);
    let verifyPassword = validatePassword(password);
    if (verifyPassword != null)
        errors.push(verifyPassword);
    if (errors.length > 0)
        return errors;
    let response = {
        email, password
    };
    return response;
}
exports.toAuthRequest = toAuthRequest;
function toUserDto(body) {
    const { name, email, password, cv, experience, englishLevel, teamId, role } = body;
    let errors = [];
    let verifName = validateString(name, 'name');
    if (verifName != null)
        errors.push(verifName);
    let verifyEmail = validateEmail(email);
    if (verifyEmail != null)
        errors.push(verifyEmail);
    let verifyPassword = validatePassword(password);
    if (verifyPassword != null)
        errors.push(verifyPassword);
    let verifyEnglishLevel = validateEnglishLevel(englishLevel);
    if (verifyEnglishLevel != null)
        errors.push(verifyEnglishLevel);
    if (cv != undefined && cv != null && typeof cv !== 'string')
        errors.push('cv must be string');
    if (experience != undefined && experience != null && typeof experience !== 'string')
        errors.push('experience must be string');
    if ((role != undefined && role != null) && (role != 'user' && role != 'admin'))
        errors.push("user role is not valid");
    if (teamId != null && teamId != undefined && typeof teamId != 'number') {
        errors.push("teamId must be integer");
    }
    if (errors.length == 0)
        return { name, email, password, cv, experience, englishLevel, teamId, role };
    return errors;
}
exports.toUserDto = toUserDto;
function connect_db(test = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const host = "db";
        const connection = new sequelize_typescript_1.Sequelize({
            dialect: "mysql",
            host: host,
            username: "root",
            password: "root",
            database: !test ? "demo" : "demo_test",
            models: [Team_model_1.default, User_model_1.default, Account_model_1.default, History_model_1.default],
            logging: false,
        });
        console.log(`Connecting to ${host}`);
        yield connection.sync()
            .catch((err) => {
            console.log(err);
        });
    });
}
exports.default = connect_db;
function sequelizeErrorHandler(err) {
    let errors = err.errors;
    let errorMessages = [];
    errors.forEach((element) => {
        errorMessages.push(element.message);
    });
    let error = errorMessages.join(', ');
    return error;
}
exports.sequelizeErrorHandler = sequelizeErrorHandler;
