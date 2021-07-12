const path = require("path");
const ui = require("express").Router();
const authenticate = require("../util/authenticate");

const appDir = path.resolve(__dirname, "../../") + "/app/";

ui.get("/", (req, res) => {
  res.sendFile(path.join(appDir, "pages", "blogs", "index.html"));
});

ui.get("/login", (req, res) => {
  res.sendFile(path.join(appDir, "pages", "login", "index.html"));
});

ui.get("/blogs", (req, res) => {
  res.sendFile(path.join(appDir, "pages", "blogs", "index.html"));
});

ui.get("/subscriptions", (req, res) => {
  res.sendFile(path.join(appDir, "pages", "subscriptions", "index.html"));
});

ui.get("/posts", (req, res) => {
  res.sendFile(path.join(appDir, "pages", "posts", "index.html"));
});

ui.get("/post/add", (req, res) => {
  res.sendFile(path.join(appDir, "pages", "post", "index.html"));
});

ui.get("/post/edit", (req, res) => {
  res.sendFile(path.join(appDir, "pages", "post", "index.html"));
});

ui.get("/blog-post", (req, res) => {
  res.sendFile(path.join(appDir, "pages", "blog-post", "index.html"));
});

ui.get("/not-found", (req, res) => {
  res.sendFile(path.join(appDir, "pages", "not-found", "index.html"));
});

ui.get("/my-blogs", (req, res) => {
  res.sendFile(path.join(appDir, "pages", "my-blogs", "index.html"));
});

ui.get("/my-posts", (req, res) => {
  res.sendFile(path.join(appDir, "pages", "my-posts", "index.html"));
});

module.exports = ui;
