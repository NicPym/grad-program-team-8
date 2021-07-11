const path = require("path");
const ui = require("express").Router();
const authenticate = require("../util/authenticate");

const appDir = path.resolve(__dirname, "../../") + "/app/";

ui.get("/", function (req, res) {
  res.sendFile(path.join(appDir, "pages", "profile", "index.html"));
});

ui.get("/profile", function (req, res) {
  res.sendFile(path.join(appDir, "pages", "profile", "index.html"));
});

ui.get("/login", function (req, res) {
  res.sendFile(path.join(appDir, "pages", "login", "index.html"));
});

module.exports = ui;
