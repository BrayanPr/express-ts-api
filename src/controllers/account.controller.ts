import { AccountDTO, ErrorResponse, SuccessResponse } from "../../types";
import Account from "../models/Account.model";
import { BadRequestResponse, CreatedResponse, DeletedResponse, FoundResponse, NotFoundResponse, ServerErrorResponse, UpdatedResponse, sequelizeErrorHandler, toAccountDto, toAccountUpdateDto } from "../utils";
import TeamController from "./team.controller";

export default class AccountController {

  teamController = new TeamController();

  async getAllAccounts(): Promise<SuccessResponse | ErrorResponse> {
    return await Account.findAll()
      .then((accounts: Array<Account>)=>
        FoundResponse(accounts,"Accounts"))
      .catch((err: any)=> 
        ServerErrorResponse("Error while consulting accounts", sequelizeErrorHandler(err)));
  };
  async createAccount(body: any): Promise<SuccessResponse | ErrorResponse> {
    let accountDtoErrors = toAccountDto(body);

    if (Array.isArray(accountDtoErrors)) 
      return BadRequestResponse(accountDtoErrors.join(", "))
    
    let account: AccountDTO = accountDtoErrors;

    let teamQuery = await this.teamController.getTeamById(account.teamId);

    if (teamQuery.statusCode != 200) 
      if ("error" in teamQuery) 
        return teamQuery;
      else
        return ServerErrorResponse("Unknown error", "Error while creating account" + JSON.stringify(body));

    return Account.create(account)
      .then((instance: Account) =>
        CreatedResponse(instance, "Account"))
      .catch((err: any) => 
        ServerErrorResponse(sequelizeErrorHandler(err), "Error while creating account" + JSON.stringify(body)));
  };
  async updateAccount(body: any, id: number): Promise<SuccessResponse | ErrorResponse> {
    let old_account = await Account.findByPk(id);
    let accountDtoErrors;
    if (old_account == null)
      return NotFoundResponse(id, "Account")
    else 
      accountDtoErrors = toAccountUpdateDto(body);

    if (Array.isArray(accountDtoErrors))
      return BadRequestResponse(accountDtoErrors.join(", "))
    
    let account: AccountDTO = accountDtoErrors;

    let teamQuery = await this.teamController.getTeamById(account.teamId);

    if ((teamQuery.statusCode != 200) && (account.teamId != undefined && account.teamId != null))
      if ("error" in teamQuery) 
        return teamQuery;
      else
        return ServerErrorResponse("Unknown error.","Error while creating account: " + JSON.stringify(body))
    
    return await Account.update(account, { where: { id: id } })
        .then(async () => 
          UpdatedResponse(true,'Account'))
        .catch((err: any) => 
          ServerErrorResponse(sequelizeErrorHandler(err), "Error while updating account"));
  };
  async deleteAccount(id: number): Promise<SuccessResponse | ErrorResponse> {
    let account: Account | null = await Account.findByPk(id);
    if (account == null)
      return NotFoundResponse(id, "Account");

    return await Account.destroy({ where: { id: id } })
      .then(() =>
        DeletedResponse(true, "Account"))
      .catch((err: any) => 
        ServerErrorResponse(sequelizeErrorHandler(err),`Error while deleting account with id: ${id}`));
  };
  async getAccountById(id: number): Promise<SuccessResponse | ErrorResponse> {
    let instance = Account.findByPk(id);
    if (instance == null)
      return NotFoundResponse(id, "Account")
    return FoundResponse(instance,'Account')
  };
};