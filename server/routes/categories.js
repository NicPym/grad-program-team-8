const categories = require("express").Router();
const models = require("../models").sequelize.models;
const { sequelize } = require("../models");
const { dataCleaner, formatDate } = require("../util/helpers");

categories.get("/", (req, res, next) => {
  models.Category.findAll({}).then((categories) => {
    const { rows } = dataCleaner(categories);

    res.json(
      rows.map((row) => {
        return {
          id: row.pkCategory,
          name: row.cName,
        };
      })
    );
  });
});

module.exports = categories;
