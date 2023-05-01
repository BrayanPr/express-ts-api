import chai from "chai";
import chaiHttp from "chai-http";
import App from "../app";
import { AuthRequest, TeamDTO } from "../../types";

const expect = chai.expect;

chai.use(chaiHttp);

let app = new App(802, true).app;


describe("Teams API", () => {
    let teamId: number;
    let token: string;
    describe("Authentication", () => {
      
      it("should log in", (done) => {
        let request:AuthRequest = {
          email: "t@t.t",
          password: "newPassword1.",
        }
        chai
          .request(app)
          .post("/api/login")
          .send(request)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("instance");
            token = res.body.instance;
            done();
          });
      });
    });
    describe("GET /api/teams", () => {
      it("should return a list of teams", (done) => {
        chai
          .request(app)
          .get("/api/teams")
          .set("Authorization", token)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body.instance).to.be.an("array");
            done();
          });
      });
    });
  
    describe("POST /api/teams", () => {
      const team:TeamDTO = {
        name: "demo",
        description:"demo"
      };
  
      it("should create a new team", (done) => {
        chai
          .request(app)
          .post("/api/teams")
          .set("Authorization", token)
          .send(team)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            expect(res.body.instance).to.have.property("id");
            teamId = res.body.instance.id;
            done();
          });
      });
  
      it("should return an error if name already exists", (done) => {
        chai
          .request(app)
          .post("/api/teams")
          .set("Authorization", token)
          .send(team)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(500);
            done();
          });
      });
    });
  
    describe("GET /api/teams/:id", () => {
      it("should return a single team", (done) => {
        chai
          .request(app)
          .get(`/api/teams/${teamId}`)
          .set("Authorization", token)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body.instance).to.have.property("id").that.equals(teamId);
            done();
          });
      });
  
      it("should return an error if team does not exist", (done) => {
        const fakeId = 100 == teamId ? 101 : 100;
  
        chai
          .request(app)
          .get(`/api/teams/${fakeId}`)
          .set("Authorization", token)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(404);
            done();
          });
      });
    });
    describe("PUT /api/teams/:id", () => {
      it("should update an existing team", (done) => {
        const updatedTeam:TeamDTO = {
            name: "Test1 Updated",
            description:"Test 1 updated"
        };
  
        chai
          .request(app)
          .put(`/api/teams/${teamId}`)
          .set("Authorization", token)
          .send(updatedTeam)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body.instance).to.have.property("name").that.equals(updatedTeam.name);
            expect(res.body.instance).to.have.property("description").that.equals(updatedTeam.description);
            done();
          });
      });
  
      it("should return an error if team does not exist", (done) => {
        const fakeId = 100 == teamId ? 101 : 100;
        const updatedteam = {
          name: "Test1 Updated",
        };
  
        chai
          .request(app)
          .put(`/api/teams/${fakeId}`)
          .set("Authorization", token)
          .send(updatedteam)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(404);
            done();
          });
      });
    });
  
    describe("DELETE /api/teams/:id", () => {
      it("should delete an existing team", (done) => {
        chai
          .request(app)
          .delete(`/api/teams/${teamId}`)
          .set("Authorization", token)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
          });
      });
  
      it("should return an error if team does not exist", (done) => {
        const fakeId = 100 == teamId ? 101 : 100;
  
        chai
          .request(app)
          .delete(`/api/teams/${fakeId}`)
          .set("Authorization", token)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(404);
            done();
          });
      });
    });
  });
  