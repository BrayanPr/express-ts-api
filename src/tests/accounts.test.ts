import chai from "chai";
import chaiHttp from "chai-http";
import App from "../app";
import { AuthRequest, AccountDTO } from "../../types";

const expect = chai.expect;

chai.use(chaiHttp);

let app = new App(801, true).app;


describe("accounts API", () => {
    let accountId: number;
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
    describe("GET /api/accounts", () => {
      it("should return a list of accounts", (done) => {
        chai
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
      const account:AccountDTO = {
        name: "Test1",
        client: "Test client 1",
        manager: "Test manager 1",
        teamId:1,
      };
  
      it("should create a new account", (done) => {
        chai
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
        chai
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
        chai
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
  
        chai
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
        const updatedaccount:AccountDTO = {
            name: "Test1 UPDATE",
            client: "Test client 1 UPDATE",
            manager: "Test manager 1 UPDATE",
            teamId:2,
        };
  
        chai
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
  
        chai
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
        chai
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
  
        chai
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
  