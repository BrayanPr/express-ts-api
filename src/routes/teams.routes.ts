import express from "express";
import TeamController from "../controllers/team.controller";
import { ErrorResponse } from "../../types";
import { verifyIsAdmin } from "../middlewares/jwt.middlewares";

const teamRoutes = express.Router();
const controller = new TeamController()
teamRoutes.use(verifyIsAdmin)

teamRoutes.get("/", async (_req, res) => {
  let response = await controller.getAllTeams();
  res.status(response.statusCode).send(response);
});

teamRoutes.get("/:id", async (req, res) => {
  let id: number;
  try {
    id = parseInt(req.params.id);
  } catch (err: any) {
    let response: ErrorResponse = {
      message: "team id is not valid",
      error: "team id must be number",
      statusCode: 400,
    };
    res.status(response.statusCode).send(response);
    return;
  }
  let response = await controller.getTeamById(id);
  res.status(response.statusCode).send(response);
});

teamRoutes.post("/", async (req, res) => {
  let response = await controller.createTeam(req.body);
  res.status(response.statusCode).send(response);
});

teamRoutes.put("/:id", async (req, res) => {
  let id: number;
  try {
    id = parseInt(req.params.id);
  } catch (err: any) {
    let response: ErrorResponse = {
      message: "team id is not valid",
      error: "team id must be number",
      statusCode: 400,
    };
    res.status(response.statusCode).send(response);
    return;
  }
  let response = await controller.updateTeam(req.body, id);
  res.status(response.statusCode).send(response);
});

teamRoutes.delete("/:id", async (req, res) => {
  let id: number;
  try {
    id = parseInt(req.params.id);
  } catch (err: any) {
    let response: ErrorResponse = {
      message: "team id is not valid",
      error: "team id must be number",
      statusCode: 400,
    };
    res.status(response.statusCode).send(response);
    return;
  }
  let response = await controller.deleteTeam(id);
  res.status(response.statusCode).send(response);
});

export default teamRoutes;
