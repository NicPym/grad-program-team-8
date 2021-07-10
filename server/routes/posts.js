const posts = require("express").Router();
const authenticate = require("../util/authenticate");
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

posts.put("/:id", authenticate, (req, res, next) => {

  const body = req.body;

  if (!body.newText) {
    const error = new Error("Data not formatted properly");
    error.statusCode = 400;
    throw error;
  }

  models.Post.findOne({
    where: {
      pkPost: req.params.id,
    },
  })
  .then((post) => {

    post.update({
      cText: body.newText
    })
    .then((_) => {

      res.sendStatus(200);
    })
  })
  .catch((err) => next(err));
});

module.exports = posts;
