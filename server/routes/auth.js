const auth = require("express").Router();

auth.get("/", (req, res, next) => {
  res.send("Hello, World");
});

module.exports = auth;
