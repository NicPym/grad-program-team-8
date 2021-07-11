const posts = require("express").Router();
const models = require("../models").sequelize.models;
const { dataCleaner, formatDate } = require("../util/helpers");

module.exports = posts;
