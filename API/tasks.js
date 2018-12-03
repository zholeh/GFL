const express = require("express");
const router = express.Router();
const TaskModel = require("../schema/taskScheme");

const optionPopulate = {
  path: "userId",
  select: "_id name"
};

router.use("/^(?!test).*$", (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
});

router.get("/test", function(req, res) {
  res.send("Test");
});

const getTasks = async function(req, res, param) {
  try {
    let query = await TaskModel.find().populate(optionPopulate);
    res.send({ message: "OK", res: query });
  } catch (err) {
    res.send({ message: "DB error", res: err });
  }
};

const getTask = async function(req, res, id) {
  try {
    let query = await TaskModel.findById(id).populate(optionPopulate);
    if (query !== null) {
      res.send({ message: "OK", res: query });
    } else {
      res.send({ message: "Task not found", res: id });
    }
  } catch (err) {
    res.send({ message: "DB error", res: err });
  }
};

router.get("/", (req, res) => {
  if (!req.query || !req.query.id) getTasks(req, res, req.query);
  else getTask(req, res, req.query.id);
});

router.post("/", async (req, res, next) => {
  const condition = { name: req.body.name };
  const newTask = new TaskModel(req.body);

  try {
    let query = await TaskModel.findOne(condition);
    if (query === null) {
      query = await newTask.save();
      res.send({ message: "OK", res: query });
    } else {
      res.send({ message: "Task already exist", res: query });
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
    let query = await TaskModel.findByIdAndDelete(id);
    if (query !== null) {
      res.send({ message: "OK", res: id });
    } else {
      res.send({ message: "Task not found", res: id });
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
    let query = await TaskModel.findByIdAndUpdate(id, req.body, {
      new: true
    }).populate(optionPopulate);
    if (query !== null) {
      res.send({ message: "OK", res: query._doc });
    } else {
      res.send({ message: "Task not found", res: id });
    }
  } catch (err) {
    res.send({ message: "DB error", res: err });
  }
});

router.get("/", function(req, res, next) {});

module.exports = router;
