const path = require('path');
const ui = require("express").Router();
const authenticate = require("../util/authenticate");

const appDir = path.resolve(__dirname, '../../') + '/app/';

ui.get("/", function( req, res ) {
  res.sendFile(path.join(appDir, 'index.html'));
});

ui.get("/profile", authenticate, function( req, res ) {
  res.sendFile(path.join(appDir, 'profile.html'));
});

module.exports = ui;