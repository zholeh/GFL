const express = require("express");
const router = express.Router();
const UserModel = require("../schema/userScheme");

router.use("/^(?!test).*$", (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
});

router.get("/test", function(req, res) {
  res.send("Test");
});

async function getUsers(req, res, param) {
  try {
    let query = await UserModel.find();
    res.send({ message: "OK", res: query });
  } catch (err) {
    res.send({ message: "DB error", res: err });
  }
}

async function getUser(req, res, id) {
  try {
    let query = await UserModel.findById(id);
    if (query !== null) {
      res.send({ message: "OK", res: query });
    } else {
      res.send({ message: "User not found", res: id });
    }
  } catch (err) {
    res.send({ message: "DB error", res: err });
  }
}

router.get("/", (req, res) => {
  if (!req.query || !req.query.id) getUsers(req, res, req.query);
  else getUser(req, res, req.query.id);
});

router.post("/", async (req, res, next) => {
  const condition = { name: req.body.name };
  const newUser = new UserModel(condition);

  try {
    let query = await UserModel.findOne(condition);
    if (query === null) {
      query = await newUser.save();
      res.send({ message: "OK", res: query._doc });
    } else {
      res.send({ message: "User already exist", res: query });
    }
  } catch (err) {
    res.send({ message: "DB error", res: err });
  }
});

router.delete("/", async (req, res, next) => {
  const id = req.query.id;
  if (!id) {
    next();
    return;
  }

  try {
    let query = await UserModel.findByIdAndDelete(id);
    if (query !== null) {
      res.send({ message: "OK", res: id });
    } else {
      res.send({ message: "User not found", res: id });
    }
  } catch (err) {
    res.send({ message: "DB error", res: err });
  }
});

router.put("/", async (req, res, next) => {
  const id = req.query.id;
  if (!id) {
    next();
    return;
  }

  try {
    let query = await UserModel.findByIdAndUpdate(id, req.body, {
      new: true
    });
    if (query !== null) {
      res.send({ message: "OK", res: query._doc });
    } else {
      res.send({ message: "User not found", res: id });
    }
  } catch (err) {
    res.send({ message: "DB error", res: err });
  }
});

router.get("/", function(req, res, next) {});

module.exports = router;
