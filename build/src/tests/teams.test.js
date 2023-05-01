"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const app_1 = __importDefault(require("../app"));
const expect = chai_1.default.expect;
chai_1.default.use(chai_http_1.default);
let app = new app_1.default(802, true).app;
describe("Teams API", () => {
    let teamId;
    let token;
    describe("Authentication", () => {
        it("should log in", (done) => {
            let request = {
                email: "t@t.t",
                password: "newPassword1.",
            };
            chai_1.default
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
            chai_1.default
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
        const team = {
            name: "demo",
            description: "demo"
        };
        it("should create a new team", (done) => {
            chai_1.default
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
            chai_1.default
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
            chai_1.default
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
            chai_1.default
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
            const updatedTeam = {
                name: "Test1 Updated",
                description: "Test 1 updated"
            };
            chai_1.default
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
            chai_1.default
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
            chai_1.default
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
            chai_1.default
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
