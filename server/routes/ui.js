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

ui.get("/blogs", function (req, res) {
  res.sendFile(path.join(appDir, "pages", "blogs", "index.html"));
});

ui.get("/subscriptions", function (req, res) {
  res.sendFile(path.join(appDir, "pages", "subscriptions", "index.html"));
});

ui.get("/posts", function (req, res) {
  res.sendFile(path.join(appDir, "pages", "posts", "index.html"));
});

ui.get("/blog-post", function (req, res) {
  res.sendFile(path.join(appDir, "pages", "blog-post", "index.html"));
});

ui.get("/not-found", function (req, res) {
  res.sendFile(path.join(appDir, "pages", "not-found", "index.html"));
});

module.exports = ui;
