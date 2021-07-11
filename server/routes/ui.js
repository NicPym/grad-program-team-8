const path = require("path");
const ui = require("express").Router();
const authenticate = require("../util/authenticate");

<<<<<<< HEAD
const appDir = path.resolve(__dirname, '../../') + '/app/views';
=======
const appDir = path.resolve(__dirname, "../../") + "/app/";
>>>>>>> ac8ee25a559241d32b75672fe77ebcd761a53338

ui.get("/", function( req, res ) {
  res.sendFile(path.join(appDir, "index.html"));
});

ui.get("/profile", function( req, res ) {
  res.sendFile(path.join(appDir, "pages", "profile",  "index.html"));
});

ui.get("/login", function( req, res ) {
  res.sendFile(path.join(appDir, "pages", "login",  "index.html"));
});

module.exports = ui;