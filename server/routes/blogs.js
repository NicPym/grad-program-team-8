const blogs = require("express").Router();
const authenticate = require("../util/authenticate");
const models = require("../models").sequelize.models;
const { sequelize } = require("../models");
const { dataCleaner, formatDate } = require("../util/helpers");

blogs.get("/", (req, res, next) => {
  models.Blog.findAll({
    where: req.query.categoryId
      ? {
          fkCategory: req.query.categoryId,
        }
      : {},
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
            categoryId: row.fkCategory,
          };
        })
      );
    })
    .catch((err) => next(err));
});

blogs.get("/:id", (req, res, next) => {
  models.Blog.findOne({
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
    .then((blog) => {
      if (!blog) {
        res.sendStatus(404);
      } else {
        res.json({
          id: blog.pkBlog,
          description: blog.cDescription,
          subscriberCount: blog.iSubscriberCount,
          owner: blog.owner,
          categoryId: blog.fkCategory,
        });
      }
    })
    .catch((err) => next(err));
});

blogs.post("/", authenticate, (req, res, next) => {
  const body = req.body;

  if (!(body.description && body.categoryId)) {
    const error = new Error("Data not formatted properly");
    error.statusCode = 400;
    throw error;
  }

  models.Blog.create({
    cDescription: body.description,
    iSubscriberCount: 0,
    fkUser: req.token.id,
    fkCategory: body.categoryId,
  })
    .then((blog) => {
      res.json({
        id: blog.pkBlog,
        description: blog.cDescription,
        subscriberCount: blog.iSubscriberCount,
        owner: req.token.name,
        categoryId: blog.fkCategory,
      });
    })
    .catch((err) => next(err));
});

blogs.get("/:id/posts", (req, res, next) => {
  models.Blog.findOne({
    where: {
      pkBlog: req.params.id,
    },
  })
    .then((blog) => {
      if (!blog) {
        res.sendStatus(404);
      } else {
        return models.Post.findAll({
          where: {
            fkBlog: blog.pkBlog,
          },
        });
      }
    })
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

blogs.post("/:id/posts", authenticate, (req, res, next) => {
  const body = req.body;

  if (!body.text) {
    const error = new Error("Data not formatted properly");
    error.statusCode = 400;
    throw error;
  }

  models.Blog.findOne({
    where: {
      pkBlog: req.params.id,
    },
  })
    .then((blog) => {
      if (!blog) {
        const error = new Error(
          `Blog with id: ${req.params.id} does not exist`
        );
        error.statusCode = 400;
        throw error;
      } else {
        return models.Post.create({
          cText: body.text,
          fkBlog: blog.pkBlog,
        });
      }
    })
    .then((post) => {
      res.json({
        id: post.pkPost,
        text: post.cText,
        createdAt: new Date().toISOString(),
      });
    })
    .catch((err) => next(err));
});

blogs.post("/:id/subscribe", authenticate, (req, res, next) => {
  models.Blog.findOne({
    where: {
      pkBlog: req.params.id,
    },
  })
    .then((blog) => {
      if (!blog) {
        const error = new Error(
          `Blog with id: ${req.params.id} does not exist`
        );
        error.statusCode = 400;
        throw error;
      } else {
        return models.Subscription.findOne({
          where: { fkUser: req.token.id, fkBlog: req.params.id },
        });
      }
    })
    .then((subscription) => {
      if (subscription) {
        const error = new Error(
          `Cannot subscribe to the same blog more than once`
        );
        error.statusCode = 400;
        throw error;
      } else {
        return models.Subscription.create({
          fkUser: req.token.id,
          fkBlog: req.params.id,
        });
      }
    })
    .then((subscription) => {
      return models.Blog.increment("iSubscriberCount", {
        by: 1,
        where: { pkBlog: subscription.fkBlog },
      });
    })
    .then((_) => {
      res.sendStatus(200);
    })
    .catch((err) => next(err));
});

module.exports = blogs;
