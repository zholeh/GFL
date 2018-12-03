const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");

const indexRouter = require("./routes/index");
const usersRouter = require("./API/users");
const tasksRouter = require("./API/tasks");

const env = require('./env.js');

const app = express();

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', ['GET', 'POST, PUT, DELETE']);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method !== 'OPTIONS') {
    next();
  }
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(logger("dev"));
app.use(express.static('public'));

// app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/tasks", tasksRouter);

// in any cases redirect to main page
app.use('*', express.static('public'));
// app.use(function(req, res, next) {
//   res.redirect('/');
//   const a = app
//   console.log(404);
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render("error");
});

module.exports = app;