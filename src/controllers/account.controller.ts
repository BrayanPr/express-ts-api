import { AccountDTO, ErrorResponse, SuccessResponse } from "../../types";
import Account from "../models/Account.model";
import { LogError } from "../app";
import { sequelizeErrorHandler, toAccountDto, toAccountUpdateDto } from "../utils";
import TeamController from "./team.controller";
// import { Route, Get, Post, Put, Delete } from "tsoa";

export default class AccountController {

  teamController = new TeamController()

  async getAllAccounts(): Promise<SuccessResponse | ErrorResponse> {
    let response: SuccessResponse | ErrorResponse;

    response = await Account.findAll()
      .then((accounts: Array<Account>) => {
        return {
          message: "Accounts consulted successfully",
          instance: accounts,
          statusCode: 200,
        };
      })
      .catch((err: any) => {
        let message = "Error while consulting accounts";
        let error = sequelizeErrorHandler(err);
        LogError(message + ": " + error);
        return {
          message,
          error,
          statusCode: 500,
        };
      });
    return response;
  }
  async createAccount(body: any): Promise<SuccessResponse | ErrorResponse> {
    let accountDtoErrors = toAccountDto(body);

    if (Array.isArray(accountDtoErrors)) {
      const response: ErrorResponse = {
        message: "Error while creating the team",
        error: accountDtoErrors.join(", "),
        statusCode: 400,
      };
      return response;
    }
    let account: AccountDTO = accountDtoErrors;

    let teamQuery = await this.teamController.getTeamById(account.teamId);

    if (teamQuery.statusCode != 200) {
      let queryResponse: ErrorResponse;
      if ("error" in teamQuery) {
        queryResponse = teamQuery;
      } else {
        const message = "Error while creating account: " + JSON.stringify(body);
        const response: ErrorResponse = {
          message,
          error: "Unknown error",
          statusCode: 500,
        };
        queryResponse = response;
        LogError(message + " " + response.error);
      }
      return queryResponse;
    }

    return Account.create(account)
      .then((instance: Account) => {
        const response: SuccessResponse = {
          message: "Account created successfully",
          instance,
          statusCode: 201,
        };
        return response;
      })
      .catch((err: any) => {
        const message = "Error while creating account: " + JSON.stringify(body);
        const error = sequelizeErrorHandler(err);
        const response: ErrorResponse = {
          message,
          error,
          statusCode: 500,
        };
        LogError(message + " " + error);
        return response;
      });
  }
  async updateAccount(
    body: any,
    id: number
  ): Promise<SuccessResponse | ErrorResponse> {
    let old_account = await Account.findByPk(id);
    let response: SuccessResponse | ErrorResponse;
    if (old_account == null) {
      let message = "Account not found";
      let error = `Account with id ${id} not found`;
      response = {
        message,
        error,
        statusCode: 404,
      };
      LogError(message + ": " + error);
    } else {
      let accountDtoErrors = toAccountUpdateDto(body);

    if (Array.isArray(accountDtoErrors)) {
      const response: ErrorResponse = {
        message: "Error while updating the team",
        error: accountDtoErrors.join(", "),
        statusCode: 400,
      };
      return response;
    }
    let account: AccountDTO = accountDtoErrors;


    let teamQuery = await this.teamController.getTeamById(account.teamId);

    if ((teamQuery.statusCode != 200) && (account.teamId != undefined && account.teamId != null)) {
      let queryResponse: ErrorResponse;
      if ("error" in teamQuery) {
        queryResponse = teamQuery;
      } else {
        const message = "Error while creating account: " + JSON.stringify(body);
        const response: ErrorResponse = {
          message,
          error: "Unknown error",
          statusCode: 500,
        };
        queryResponse = response;
        LogError(message + " " + response.error);
      }
      return queryResponse;
    }
      response = await Account.update(account, { where: { id: id } })
        .then(async () => {
          response = {
            message: "Account updated successfully",
            instance: await Account.findByPk(id),
            statusCode: 200,
          };
          return response;
        })
        .catch((err: any) => {
          let message = "Error while updating account ";
          let error = sequelizeErrorHandler(err);
          let response: ErrorResponse = {
            message,
            error,
            statusCode: 500,
          };
          LogError(message + ": " + error);
          return response;
        });
    }
    return response;
  }
  async deleteAccount(id: number): Promise<SuccessResponse | ErrorResponse> {
    let account: Account | null = await Account.findByPk(id);
    let response: SuccessResponse | ErrorResponse;
    if (account == null) {
      let message: string = "Account not found";
      let error: string = "Account with id:" + id + " not found";
      response = {
        message,
        error,
        statusCode: 404,
      };

      LogError(message + ": " + error);

      return response;
    }

    response = await Account.destroy({ where: { id: id } })
      .then(() => {
        return {
          message: "Account deleted successfully",
          instance: null,
          statusCode: 200,
        };
      })
      .catch((err: any) => {
        let error = sequelizeErrorHandler(err);
        let message = "Error while deleting account with id:" + id;

        LogError(message + ": " + error);
        return {
          message,
          error,
          statusCode: 500,
        };
      });
    return response;
  }
  async getAccountById(id: number): Promise<SuccessResponse | ErrorResponse> {
    return Account.findByPk(id).then((instance: Account | null) => {
      let response: SuccessResponse | ErrorResponse;
      if (instance == null) {
        let message = "Account not found";
        let error = `Account with id ${id} not found`;
        response = {
          message,
          error,
          statusCode: 404,
        };
        LogError(message + ": " + error);
      } else {
        response = {
          message: "Account found",
          instance,
          statusCode: 200,
        };
      }
      return response;
    });
  }
}
