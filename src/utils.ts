import { Sequelize } from "sequelize-typescript";
import User from "./models/User.model";
import Team from "./models/Team.model";
import History from "./models/History.model"
import { AccountDTO, AuthRequest, HistoryDTO, HistoyByDatesRequest, TeamDTO, UserDTO, UserUpdateDTO } from "../types";
import Account from "./models/Account.model";

const validateString = (value: string | null | undefined, name: string): string | null => {
    if (!value || value.trim().length === 0) {
      return (`${name} is required`);
    }
    return null
};

function validatePassword(password: string | undefined | null): string | null {
    const minLength = 8;
    const minUppercase = 1;
    const minSpecialChars = 1;
    const uppercaseRegex = /[A-Z]/;
    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if(!password){
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
  
const validateEmail = (email: string | null | undefined): string | null => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email){
        return ('email is required')
    }
    if (!regex.test(email)) {
      return ("email is not valid")
    }
    return null
};

const validateEnglishLevel = (englishLevel:string | null | undefined):string | null =>{
    if(englishLevel && (englishLevel !='A1' && englishLevel!='A2' && englishLevel != 'B1' && englishLevel != 'B2' && englishLevel != 'C1' && englishLevel != 'C2')){
        return "englishLevel is not valid"
    }
    return null
}

export function toUserUpdateDto(body:any):Array<string> | UserUpdateDTO{
    const { name, cv, experience, englishLevel } = body;
    let errors:Array<string> = []
    if(name != undefined && name != null){
        let verifName = validateString(name, 'name');
        if(verifName != null)
            errors.push(verifName)

    }
    
    let verifyEnglishLevel = validateEnglishLevel(englishLevel)
    if(verifyEnglishLevel != null)
        errors.push(verifyEnglishLevel)

    if(cv != undefined && cv != null && typeof cv !== 'string')
        errors.push('cv must be string')
    
    if(experience != undefined && experience != null && typeof experience !== 'string')
        errors.push('experience must be string')
    
    if(errors.length == 0){
        let user:UserUpdateDTO = { name, cv, experience, englishLevel }
        return user;

    }else{
        return errors;
    }
}

export function toHistoryDto(body:any):Array<string> | HistoryDTO{
    const { user, teamJoin } = body 
    let errors:Array<string> = []

    if(user == null || user == undefined)
        errors.push("user is required")
    else if(typeof user != "number")
        errors.push("user must be integer")
    if(teamJoin == null || teamJoin == undefined)
        errors.push("teamJoin is required")
    else if(typeof teamJoin != "number")
        errors.push("teamJoin must be number")

    if(errors.length > 0)
        return errors
    
    let history:HistoryDTO = {
        user, teamJoin, teamLeft:null
    }
    return history
}

export function toAccountUpdateDto(body:any):Array<string> | AccountDTO{
    const { name, client, manager, teamId } = body
    let errors:Array<string> = [];

    if(name != null && name != undefined && typeof name != "string")
        errors.push("name must be string")
    
    if(client != null && client != undefined && typeof client != "string")
        errors.push("client must be string")

    if(manager != null && manager != undefined && typeof manager != "string")
        errors.push("manager must be string")
    if(name != null && name != undefined && typeof name != "string")
    
    if(teamId != null && teamId != undefined && typeof teamId != 'number')
        errors.push('teamId must be numeric')

    if(errors.length > 0)
        return errors

    let accountDto:AccountDTO = {
        name,
        client,
        manager,
        teamId,
    } 
    return accountDto
}


export function toAccountDto(body:any):Array<string> | AccountDTO{
    const { name, client, manager, teamId } = body
    let errors:Array<string> = [];

    let verifName = validateString(name, 'name')
    if (verifName != null)
        errors.push(verifName)
    let verifyCustomer = validateString(client, 'client')
    if(verifyCustomer != null)
        errors.push(verifyCustomer)
    let verifyManager = validateString(manager, 'manager')
    if(verifyManager != null){
        errors.push(verifyManager)
    }
    if(teamId == null || teamId == undefined )
        errors.push("teamId is required")
    
    if(teamId != null && teamId != undefined && typeof teamId != 'number')
        errors.push('teamId must be numeric')

    if(errors.length > 0)
        return errors

    let accountDto:AccountDTO = {
        name,
        client,
        manager,
        teamId,
    } 
    return accountDto
}

export function toTeamDto(body:any):Array<string> | TeamDTO{
    const { name, description } = body
    let errors:Array<string> = []

    let verifName = validateString(name, 'name');
    if(verifName != null)
        errors.push(verifName)

    if( (description != undefined && description != null) && typeof description != 'string')
        errors.push("description must be string")

    if(errors.length == 0)
        return { name, description }    
    
    return errors;
    
}
export function toHistoryByDates(body:any):Array<string> | HistoyByDatesRequest{
    let { startDate, endDate } = body
    const _startDate = Date.parse(startDate);
    const _endDate = Date.parse(endDate);
    
    let errors:Array<string> = []
    if(startDate == null || startDate == undefined)
        errors.push("startDate is required")
    else if(isNaN(_startDate))
        errors.push("startDate must be date type")
    if(endDate == null || endDate == undefined)
        errors.push("endDate is required")
    else if(isNaN(_endDate))
        errors.push("end must be date type")

    if(errors.length > 0)
        return errors
    startDate = new Date(startDate)
    endDate = new Date(endDate)
    let response:HistoyByDatesRequest = {
        startDate,
        endDate
    }
    return response
}

export function toAuthRequest(body:any):Array<string> | AuthRequest{
    const { email, password } = body
    let errors:Array<string> = []
    let verifyEmail = validateEmail(email);
    if(verifyEmail != null)
        errors.push(verifyEmail)
    
    let verifyPassword = validatePassword(password);
    if(verifyPassword != null)
        errors.push(verifyPassword)

    if (errors.length > 0)
        return errors
    
    let response:AuthRequest = {
        email,password
    }

    return response
}

export function toUserDto(body:any):Array<string> | UserDTO{
    const { name, email, password, cv, experience, englishLevel, teamId, role } = body;
    let errors:Array<string> = []

    let verifName = validateString(name, 'name');
    if(verifName != null)
        errors.push(verifName)
    
    let verifyEmail = validateEmail(email);
    if(verifyEmail != null)
        errors.push(verifyEmail)
    
    let verifyPassword = validatePassword(password);
    if(verifyPassword != null)
        errors.push(verifyPassword)
    
    let verifyEnglishLevel = validateEnglishLevel(englishLevel)
    if(verifyEnglishLevel != null)
        errors.push(verifyEnglishLevel)

    if(cv != undefined && cv != null && typeof cv !== 'string')
        errors.push('cv must be string')
    
    if(experience != undefined && experience != null && typeof experience !== 'string')
        errors.push('experience must be string')

    if((role != undefined && role != null) && (role != 'user' && role!='admin'))
        errors.push("user role is not valid")

    if(teamId != null && teamId != undefined && typeof teamId != 'number'){
        errors.push("teamId must be integer")
    }
        
    if(errors.length == 0)
        return { name, email, password, cv, experience, englishLevel, teamId, role }
    
    return errors;
    
}

export default async function connect_db(test:boolean=false){
    const host = "db"

    const connection = new Sequelize(
    {
        dialect:"mysql",
        host:host,
        username:"root",
        password:"root",
        database:!test ? "demo" : "demo_test",
        models:[Team, User , Account, History],
        logging:false,
    });

    console.log(`Connecting to ${host}`)

    await connection.sync()
    .catch(
        (err:any) => {
            console.log(err)
        }
    )
   
}


export function sequelizeErrorHandler(err:any):string{
    let errors = err.errors
            let errorMessages:Array<string> = []
            errors.forEach((element:any) => {
                errorMessages.push(element.message)
            });
    let error = errorMessages.join(', ')

    return error
}