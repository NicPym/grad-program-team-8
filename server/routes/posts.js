const posts = require("express").Router();
const authenticate = require("../util/authenticate");
const models = require("../models").sequelize.models;
const { dataCleaner, formatDate } = require("../util/helpers");

posts.get("/", (req, res, next) => {
  models.Post.findAll({})
    .then((posts) => {
      if (posts.length == 0) {
        res.json([]);
      } else {
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
      }
    })
    .catch((err) => next(err));
});

posts.get("/:id", (req, res, next) => {
  models.Post.findOne({
    where: {
      pkPost: req.params.id,
    },
  })
    .then((post) => {
      if (!post) {
        const error = new Error("Blog Post Not Found");
        error.statusCode = 404;
        throw error;
      } else {
        res.json({
          title: post.cTitle,
          description: post.cDescription,
          text: post.cText,
        });
      }
    })
    .catch((err) => next(err));
});

posts.put("/", authenticate, (req, res, next) => {
  const body = req.body;

  if (!(body.id && body.text)) {
    const error = new Error("Data not formatted properly");
    error.statusCode = 400;
    throw error;
  }

  models.Post.findOne({
    where: {
      pkPost: body.id,
    },
    include: [
      {
        model: models.Blog,
        attributes: [["fkUser", "ownerId"]],
      },
    ],
  })
    .then((post) => {
      const { rows } = dataCleaner(post);
      if (rows.length == 0) {
        const error = new Error(`Post with id: ${body.id} does not exist`);
        error.statusCode = 404;
        throw error;
      } else if (rows[0].ownerId != req.token.id) {
        const error = new Error(
          `Cannot edit post as you do not own the post with id: ${body.id}`
        );
        error.statusCode = 401;
        throw error;
      } else {
        return post.update({
          cText: body.text,
        });
      }
    })
    .then((post) => {
      res.json({
        id: post.pkPost,
        text: post.cText,
        createdAt: post.createdAt,
      });
    })
    .catch((err) => next(err));
});

posts.delete("/", authenticate, (req, res, next) => {
  const body = req.body;

  if (!body.id) {
    const error = new Error("Data not formatted properly");
    error.statusCode = 400;
    throw error;
  }

  models.Post.findOne({
    where: {
      pkPost: body.id,
    },
    include: [
      {
        model: models.Blog,
        attributes: [["fkUser", "ownerId"]],
      },
    ],
  })
    .then((post) => {
      const { rows } = dataCleaner(post);
      if (rows.length == 0) {
        return;
      } else if (rows[0].ownerId != req.token.id) {
        const error = new Error(
          `Cannot delete post as you do not own the post with id: ${body.id}`
        );
        error.statusCode = 404;
        throw error;
      } else {
        return post.destroy();
      }
    })
    .then((_) => {
      res.sendStatus(200);
    })
    .catch((err) => next(err));
});

module.exports = posts;
