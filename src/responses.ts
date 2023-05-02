import { ErrorResponse, SuccessResponse } from "../types";
import { LogError } from "./app";

export const UnahutorizedResponse = (
  message: string,
  error: string = "token"
): ErrorResponse => ({
  message,
  error,
  statusCode: 401,
});

export const NotFoundResponse = (
  id: number,
  modelName: string
): ErrorResponse => {
  let message: string = `${modelName} not found.`;
  let error: string = `${modelName} with id: ${id} could not be found.`;
  LogError(message + ": " + error);
  return {
    message,
    error,
    statusCode: 404,
  };
};

export const ServerErrorResponse = (
  error: string = "Unknown error.",
  message: string = "Server error."
): ErrorResponse => {
  LogError(message + ": " + error);
  return { message, error, statusCode: 500 };
};

export const BadRequestResponse = (
  error: string,
  message: string = `Request format is not valid.`
): ErrorResponse => ({
  message,
  error,
  statusCode: 400,
});

export const BadCredentialsResponse = (): ErrorResponse => ({
  message: "Error while trying to log in",
  error: "Invalid credentials",
  statusCode: 401,
});

export const FoundResponse = (
  instance: any,
  modelName: string
): SuccessResponse => ({
  message: `${modelName} consulted succesfully`,
  instance,
  statusCode: 200,
});

export const CreatedResponse = (
  instance: any,
  modelName: string
): SuccessResponse => ({
  message: `${modelName} created succesfully`,
  instance,
  statusCode: 201,
});

export const UpdatedResponse = (
  instance: any,
  modelName: string
): SuccessResponse => ({
  message: `${modelName} updated succesfully`,
  instance,
  statusCode: 200,
});

export const DeletedResponse = (
  instance: any,
  modelName: string
): SuccessResponse => ({
  message: `${modelName} deleted succesfully`,
  instance,
  statusCode: 200,
});
