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
let app = new app_1.default(804, true).app;
let token;
describe("Transaction API", () => {
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
    describe("POST /api/operations/move", () => {
        it("should move user 1 to team 1", (done) => {
            chai_1.default
                .request(app)
                .post("/api/operations/move")
                .set("Authorization", token)
                .send({
                "user": 1,
                "teamJoin": 1
            })
                .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                expect(res.body.instance.user).to.be.equal(1);
                expect(res.body.instance.teamJoin).to.be.equal(1);
                expect(res.body.instance).to.have.property("id");
                expect(res.body.instance).to.have.property("date");
                done();
            });
        });
        it("should give an error of the user already on that team", (done) => {
            chai_1.default
                .request(app)
                .post("/api/operations/move")
                .set("Authorization", token)
                .send({
                "user": 1,
                "teamJoin": 1
            })
                .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                expect(res.body.error).to.be.equal("User: 1 is already on team:1");
                done();
            });
        });
        it("should move user 1 to team 2, and leave team 1 as left team", (done) => {
            chai_1.default
                .request(app)
                .post("/api/operations/move")
                .set("Authorization", token)
                .send({
                "user": 1,
                "teamJoin": 2
            })
                .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                expect(res.body.instance.user).to.be.equal(1);
                expect(res.body.instance.teamJoin).to.be.equal(2);
                expect(res.body.instance.teamLeft).to.be.equal(1);
                expect(res.body.instance).to.have.property("id");
                expect(res.body.instance).to.have.property("date");
                done();
            });
        });
        it("should give an error of user not found", (done) => {
            chai_1.default
                .request(app)
                .post("/api/operations/move")
                .set("Authorization", token)
                .send({
                "user": 12121112121,
                "teamJoin": 1
            })
                .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(404);
                expect(res.body.message).to.be.equal("User not fouded");
                done();
            });
        });
        it("should give an error of team not found", (done) => {
            chai_1.default
                .request(app)
                .post("/api/operations/move")
                .set("Authorization", token)
                .send({
                "user": 1,
                "teamJoin": 123131211213
            })
                .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(404);
                expect(res.body.message).to.be.equal("Team not found");
                done();
            });
        });
        it("should bring all history", (done) => {
            chai_1.default
                .request(app)
                .get("/api/operations/")
                .set("Authorization", token)
                .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body.instance).to.be.an("array");
                done();
            });
        });
    });
});
