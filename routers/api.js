const express = require("express");
const userRouter = require("./auth");
const assessmentRouter = require("./assessment");


const app = express();

app.use("/auth/", userRouter);
app.use("/assessment/", assessmentRouter);

module.exports = app;