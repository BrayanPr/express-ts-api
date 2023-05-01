import { Request } from "express";
import { JwtPayload } from "jsonwebtoken"
export type EnglishLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type UserRoles = "user" | "admin" | "super_admin";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  experience: string;
  cv: string;
  englishLevel: EnglishLevel;
  role: UserRoles;
  teamId: number | null;
  team: Team | null;
}

export type UserDTO = Omit<User, "id" | "team">;

export type UserUpdateDTO = {
  name: string | null;
  experience: string | null;
  cv: string | null;
  englishLevel: EnglishLevel | null;
};
export interface Team {
  id: number;
  name: string;
  description: string | null;
}

export type TeamDTO = Omit<Team, "id">;

export interface Account {
  id: number;
  name: string;
  client: string;
  manager: string;
  team: team;
  teamId: number;
}

export type AccountDTO = Omit<Account, "id" | "team">

export interface History {
  id:number;
  user:number;
  teamJoin:number;
  teamLeft:number | null;
  date:Date
}

export type HistoryDTO = Omit<History, "id" | "date">

export interface HistoyByDatesRequest{
  startDate:Date;
  endDate:Date;
}

export interface AuthRequest {
  email:string;
  password:string;
}

export interface ErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

export interface SuccessResponse {
  message: string;
  instance: any;
  statusCode: number;
}

export interface JWTPayload{
  user_id:number,
  role:string
}

export interface VerifiedRequest extends Request{
  user:User
}