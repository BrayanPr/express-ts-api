import chai from "chai";
import chaiHttp from "chai-http";
import App from "../app";
import { AuthRequest, UserDTO, UserUpdateDTO } from "../../types";

const expect = chai.expect;

chai.use(chaiHttp);

let app = new App(800, true).app;

describe("Users API", () => {
  let userId: number;
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
  describe("GET /api/users", () => {
    it("should return a list of users", (done) => {
      chai
        .request(app)
        .get("/api/users")
        .set("Authorization", token)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.instance).to.be.an("array");
          done();
        });
    });
  });

  describe("POST /api/users", () => {
    const user:UserDTO = {
      name: "Test1",
      email: "test.user@example.com",
      password: "newPassword1.",
      englishLevel:"A1",
      experience:"",
      cv:"",
      role:"user",
      teamId:null
    };

    it("should create a new user", (done) => {
      chai
        .request(app)
        .post("/api/users")
        .set("Authorization", token)
        .send(user)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res.body.instance).to.have.property("id");
          userId = res.body.instance.id;
          done();
        });
    });

    it("should return an error if name/email already exists", (done) => {
      chai
        .request(app)
        .post("/api/users")
        .set("Authorization", token)
        .send(user)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(500);
          done();
        });
    });
  });

  describe("GET /api/users/:id", () => {
    it("should return a single user", (done) => {
      chai
        .request(app)
        .get(`/api/users/${userId}`)
        .set("Authorization", token)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.instance).to.have.property("id").that.equals(userId);
          done();
        });
    });

    it("should return an error if user does not exist", (done) => {
      const fakeId = 100 == userId ? 101 : 100;

      chai
        .request(app)
        .get(`/api/users/${fakeId}`)
        .set("Authorization", token)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          done();
        });
    });
  });
  describe("PUT /api/users/:id", () => {
    it("should update an existing user", (done) => {
      const updatedUser:UserUpdateDTO = {
        name: "Test1 Updated",
        englishLevel:"C2",
        experience:"He has a lot of experience",
        cv:"http://demo.com"
      };

      chai
        .request(app)
        .put(`/api/users/${userId}`)
        .set("Authorization", token)
        .send(updatedUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.instance).to.have.property("name").that.equals(updatedUser.name);
          expect(res.body.instance).to.have.property("englishLevel").that.equals(updatedUser.englishLevel);
          expect(res.body.instance).to.have.property("experience").that.equals(updatedUser.experience);
          expect(res.body.instance).to.have.property("cv").that.equals(updatedUser.cv);
          done();
        });
    });

    it("should return an error if user does not exist", (done) => {
      const fakeId = 100 == userId ? 101 : 100;
      const updatedUser = {
        name: "Test1 Updated",
      };

      chai
        .request(app)
        .put(`/api/users/${fakeId}`)
        .set("Authorization", token)
        .send(updatedUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          done();
        });
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("should delete an existing user", (done) => {
      chai
        .request(app)
        .delete(`/api/users/${userId}`)
        .set("Authorization", token)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
    });

    it("should return an error if user does not exist", (done) => {
      const fakeId = 100 == userId ? 101 : 100;

      chai
        .request(app)
        .delete(`/api/users/${fakeId}`)
        .set("Authorization", token)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          done();
        });
    });
  });
});
