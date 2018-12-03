let app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");

const env = require("../env.js");
const mongoose = require("mongoose");

const UserModel = require("../schema/userScheme");
const TaskModel = require("../schema/taskScheme");

mongoose.connect(
  env.MONGO_DB_ADR,
  { useNewUrlParser: true },
  function(err) {
    if (err) return console.log(err);
  }
);

const should = chai.should();
chai.use(chaiHttp);

process.env.NODE_ENV = "test";

// const newUserForTask = new UserModel({ name: "UserForTask" });
// newUserForTask.save((err, dbUser) => {
//   task = {
//     name: "Task",
//     description: "task for test",
//     importance: 1,
//     id: 0000,
//     done: true,
//     errorField: "",
//     userId: dbUser._id
//   };
// });

describe("GFL", function() {
  let newUserForTask;

  describe("Operation tests", () => {
    // it("Test main route", done => {
    //   chai
    //     .request(app)
    //     .get("/test")
    //     .end((err, res) => {
    //       res.should.have.status(200);
    //       res.text.should.be.a("string").eql("Test");
    //       done();
    //     });
    // });
    it("Test users route", done => {
      chai
        .request(app)
        .get("/api/users/test")
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.a("string").eql("Test");
          done();
        });
    });
    it("Test tasks route", done => {
      chai
        .request(app)
        .get("/api/tasks/test")
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.a("string").eql("Test");
          done();
        });
    });
  });

  describe("Users", () => {
    const user = { name: "John" };

    it("Add new user", done => {
      chai
        .request(app)
        .post("/api/users")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("OK");
          res.body.should.have.property("res");
          res.body.res.should.be.a("object");
          res.body.res.should.have.property("name").eql("John");
          done();
        });
    });

    it("Re-add new user", done => {
      chai
        .request(app)
        .post("/api/users")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("User already exist");
          res.body.should.have.property("res");
          res.body.res.should.be.a("object");
          res.body.res.should.have.property("name").eql("John");
          done();
        });
    });

    it("Update user", done => {
      newUser = new UserModel({ name: "John555" });
      newUser.save((err, dbUser) => {
        chai
          .request(app)
          .put(`/api/users?id=${dbUser._id}`)
          .send({ name: "Ivan" })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message").eql("OK");
            res.body.should.have.property("res");
            res.body.res.should.be.a("object");
            res.body.res.should.have.property("name").eql("Ivan");
            done();
          });
      });
    });

    it("Delete user", done => {
      newUser = new UserModel({ name: "John555" });
      newUser.save((err, dbUser) => {
        chai
          .request(app)
          .delete(`/api/users?id=${dbUser._id}`)
          .send({ id: user.id })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message").eql("OK");
            done();
          });
      });
    });

    it("GET users", done => {
      chai
        .request(app)
        .get("/api/users")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("OK");
          res.body.should.have.property("res");
          res.body.res.should.be.a("array");
          done();
        });
    });

    it("GET user", done => {
      newUser = new UserModel({ name: "John for GET" });
      newUser.save((err, dbUser) => {
        chai
          .request(app)
          .get(`/api/users?id=${dbUser._id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message").eql("OK");
            res.body.should.have.property("res");
            res.body.res.should.be.a("object");
            res.body.res.should.have.property("name").eql("John for GET");
            done();
          });
      });
    });
  });

  describe("Tasks", () => {
    const task = {
      name: "Task for add",
      description: "task for add",
      importance: 1,
      id: 0000,
      done: true,
      errorField: "",
      userId: "userId" // newUserForTask._id
    };

    it("Add new task", done => {
      newUserModel = new UserModel({ name: "John for TASK" });
      newUserModel.save((err, dbUser) => {
        task.userId = dbUser._id;
        chai
          .request(app)
          .post("/api/tasks")
          .send(task)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message").eql("OK");
            res.body.should.have.property("res");
            res.body.res.should.be.a("object");
            res.body.res.should.have.property("name").eql("Task for add");
            done();
          });
      });
    });

    it("Re-add new task", done => {
      chai
        .request(app)
        .post("/api/tasks")
        .send(task)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Task already exist");
          res.body.should.have.property("res");
          res.body.res.should.be.a("object");
          res.body.res.should.have.property("name").eql("Task for add");
          done();
        });
    });

    it("Update task", done => {
      newUserModel = new UserModel({ name: "John for TASK 2" });
      newUserModel.save((err, dbUser) => {
        const newTask = TaskModel({
          name: "Task for update",
          description: "task for update",
          importance: 1,
          id: 0000,
          done: false,
          errorField: "",
          userId: dbUser._id
        });
        newTask.save((err, dbTask) => {
          chai
            .request(app)
            .put(`/api/tasks?id=${dbTask._id}`)
            .send(newTask)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.should.have.property("message").eql("OK");
              res.body.should.have.property("res");
              res.body.res.should.be.a("object");
              res.body.res.should.have.property("name").eql("Task for update");
              done();
            });
        });
      });
    });

    it("Delete task", done => {
      newUserModel = new UserModel({ name: "John for TASK 3" });
      newUserModel.save((err, dbUser) => {
        const newTask = TaskModel({
          name: "Task for delete",
          description: "task for delete",
          importance: 1,
          id: 0000,
          done: true,
          errorField: "",
          userId: dbUser._id
        });

        newTask.save((err, dbTask) => {
          chai
            .request(app)
            .delete(`/api/tasks?id=${dbTask._id}`)
            .send({ id: task.id })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.should.have.property("message").eql("OK");
              done();
            });
        });
      });
    });

    it("GET tasks", done => {
      chai
        .request(app)
        .get("/api/tasks")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("OK");
          res.body.should.have.property("res");
          res.body.res.should.be.a("array");
          done();
        });
    });

    it("GET task", done => {

      newUserModel = new UserModel({ name: "John for TASK 4" });
      newUserModel.save((err, dbUser) => {
        const newTask = TaskModel({
          name: "Task for GET",
          description: "task for GET",
          importance: 1,
          id: 0000,
          done: true,
          errorField: "",
          userId: dbUser._id
        });

        newTask.save((err, dbTask) => {
          chai
            .request(app)
            .get(`/api/tasks?id=${dbTask._id}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.should.have.property("message").eql("OK");
              res.body.should.have.property("res");
              res.body.res.should.be.a("object");
              res.body.res.should.have.property("name").eql("Task for GET");
              done();
            });
        });
      });
    });
  });

  before(async () => {
    await UserModel.deleteMany();
    await TaskModel.deleteMany();
  });

  after(() => {
    mongoose.disconnect();
  });
});
