const blogs = require("express").Router();
const authenticate = require("../util/authenticate");
const models = require("../models").sequelize.models;
const { sequelize } = require("../models");
const { dataCleaner, formatDate } = require("../util/helpers");

blogs.get("/", (req, res, next) => {
  models.Blog.findAll({
    include: [
      {
        model: models.User,
        attributes: [
          [
            sequelize.fn(
              "concat",
              sequelize.col("cFirstName"),
              " ",
              sequelize.col("cLastName")
            ),
            "owner",
          ],
        ],
      },
    ],
  })
    .then((blogs) => {
      const { rows } = dataCleaner(blogs);

      res.json(
        rows.map((row) => {
          return {
            id: row.pkBlog,
            description: row.cDescription,
            subscriberCount: row.iSubscriberCount,
            owner: row.owner,
          };
        })
      );
    })
    .catch((err) => next(err));
});

blogs.get("/:id", (req, res, next) => {
  models.Blog.findAll({
    where: {
      pkBlog: req.params.id,
    },
    include: [
      {
        model: models.User,
        attributes: [
          [
            sequelize.fn(
              "concat",
              sequelize.col("cFirstName"),
              " ",
              sequelize.col("cLastName")
            ),
            "owner",
          ],
        ],
      },
    ],
  })
    .then((blogs) => {
      if (blogs.length == 0) {
        res.statusCode(404);
      } else {
        const { rows } = dataCleaner(blogs);

        res.json({
          id: rows[0].pkBlog,
          description: rows[0].cDescription,
          subscriberCount: rows[0].iSubscriberCount,
          owner: rows[0].owner,
        });
      }
    })
    .catch((err) => next(err));
});

blogs.post("/", authenticate, (req, res, next) => {
  const body = req.body;

  if (!body.description) {
    const error = new Error("Data not formatted properly");
    error.statusCode = 400;
    throw error;
  }

  models.Blog.create({
    cDescription: body.description,
    iSubscriberCount: 0,
    fkUser: req.token.id,
  })
    .then((blog) => {
      res.json({
        id: blog.pkBlog,
        description: blog.cDescription,
        subscriberCount: blog.iSubscriberCount,
        owner: req.token.name,
      });
    })
    .catch((err) => next(err));
});

blogs.get("/:id/posts", (req, res, next) => {
  models.Blog.findAll({
    where: {
      pkBlog: req.params.id,
    },
  })
    .then((blogs) => {
      if (blogs.length == 0) {
        res.statusCode(404);
      } else {
        const { rows } = dataCleaner(blogs);

        return models.Post.findAll({
          where: {
            fkBlog: rows[0].pkBlog,
          },
        });
      }
    })
    .then((posts) => {
      if (posts.length == 0) {
        res.json([]);
      } else {
        const { rows } = dataCleaner(posts);

        res.json({
          id: rows[0].pkBlog,
          text: rows[0].cText,
          createdAt: rows[0].createdAt,
        });
      }
    })
    .catch((err) => next(err));
});

blogs.post("/:id/posts", authenticate, (req, res, next) => {
  const body = req.body;

  if (!body.text) {
    const error = new Error("Data not formatted properly");
    error.statusCode = 400;
    throw error;
  }

  models.Blog.findAll({
    where: {
      pkBlog: req.params.id,
    },
  })
    .then((blogs) => {
      if (blogs.length == 0) {
        const error = new Error(
          `Blog with id: ${req.params.id} does not exist`
        );
        error.statusCode = 400;
        throw error;
      } else {
        const { rows } = dataCleaner(blogs);

        return models.Post.create({
          cText: body.text,
          fkBlog: rows[0].pkBlog,
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

module.exports = blogs;
