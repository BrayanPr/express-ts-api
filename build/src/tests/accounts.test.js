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
let app = new app_1.default(801, true).app;
describe("accounts API", () => {
    let accountId;
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
    describe("GET /api/accounts", () => {
        it("should return a list of accounts", (done) => {
            chai_1.default
                .request(app)
                .get("/api/accounts")
                .set("Authorization", token)
                .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body.instance).to.be.an("array");
                done();
            });
        });
    });
    describe("POST /api/accounts", () => {
        const account = {
            name: "Test1",
            client: "Test client 1",
            manager: "Test manager 1",
            teamId: 1,
        };
        it("should create a new account", (done) => {
            chai_1.default
                .request(app)
                .post("/api/accounts")
                .set("Authorization", token)
                .send(account)
                .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                expect(res.body.instance).to.have.property("id");
                accountId = res.body.instance.id;
                done();
            });
        });
        it("should return an error if name already exists", (done) => {
            chai_1.default
                .request(app)
                .post("/api/accounts")
                .set("Authorization", token)
                .send(account)
                .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(500);
                done();
            });
        });
    });
    describe("GET /api/accounts/:id", () => {
        it("should return a single account", (done) => {
            chai_1.default
                .request(app)
                .get(`/api/accounts/${accountId}`)
                .set("Authorization", token)
                .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body.instance).to.have.property("id").that.equals(accountId);
                done();
            });
        });
        it("should return an error if account does not exist", (done) => {
            const fakeId = 100 == accountId ? 101 : 100;
            chai_1.default
                .request(app)
                .get(`/api/accounts/${fakeId}`)
                .set("Authorization", token)
                .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(404);
                done();
            });
        });
    });
    describe("PUT /api/accounts/:id", () => {
        it("should update an existing account", (done) => {
            const updatedaccount = {
                name: "Test1 UPDATE",
                client: "Test client 1 UPDATE",
                manager: "Test manager 1 UPDATE",
                teamId: 2,
            };
            chai_1.default
                .request(app)
                .put(`/api/accounts/${accountId}`)
                .set("Authorization", token)
                .send(updatedaccount)
                .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body.instance).to.have.property("name").that.equals(updatedaccount.name);
                expect(res.body.instance).to.have.property("client").that.equals(updatedaccount.client);
                expect(res.body.instance).to.have.property("manager").that.equals(updatedaccount.manager);
                expect(res.body.instance).to.have.property("teamId").that.equals(updatedaccount.teamId);
                done();
            });
        });
        it("should return an error if account does not exist", (done) => {
            const fakeId = 100 == accountId ? 101 : 100;
            const updatedaccount = {
                name: "Test1 Updated",
            };
            chai_1.default
                .request(app)
                .put(`/api/accounts/${fakeId}`)
                .set("Authorization", token)
                .send(updatedaccount)
                .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(404);
                done();
            });
        });
    });
    describe("DELETE /api/accounts/:id", () => {
        it("should delete an existing account", (done) => {
            chai_1.default
                .request(app)
                .delete(`/api/accounts/${accountId}`)
                .set("Authorization", token)
                .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
        });
        it("should return an error if account does not exist", (done) => {
            const fakeId = 100 == accountId ? 101 : 100;
            chai_1.default
                .request(app)
                .delete(`/api/accounts/${fakeId}`)
                .set("Authorization", token)
                .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(404);
                done();
            });
        });
    });
});
