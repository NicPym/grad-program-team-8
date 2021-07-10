const posts = require("express").Router();
const models = require("../models").sequelize.models;
const { dataCleaner, formatDate } = require("../util/helpers");

posts.get("/", (req, res, next) => {

  models.Post.findAll({
  })
    .then((posts) => {
      const { rows } = dataCleaner(posts);

      res.json(
        rows.map((row) => {
          return {
            id: row.pkPost,
            text: row.cText,
            createdAt: row.createdAt,
          };
        })
      );
    })
    .catch((err) => next(err));
});

module.exports = posts;
