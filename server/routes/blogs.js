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
      if (blogs.length == 0) {
        return res.json([]);
      } else {
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
      }
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
        const error = new Error(
          `Blog with id: ${req.params.id} does not exist`
        );
        error.statusCode = 404;
        throw error;
      } else {
        const { rows } = dataCleaner(blog);
        blog = rows[0];
        res.json({
          id: blog.pkBlog,
          description: blog.cDescription,
          subscriberCount: blog.iSubscriberCount,
          owner: blog.owner,
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

blogs.put("/", authenticate, (req, res, next) => {
  const body = req.body;

  if (!(body.id && body.description)) {
    const error = new Error("Data not formatted properly");
    error.statusCode = 400;
    throw error;
  }

  models.Blog.findOne({
    where: {
      pkBlog: body.id,
    },
  })
    .then((blog) => {
      if (blog.fkUser != req.token.id) {
        const error = new Error(
          `Cannot edit blog as you do not own the blog with id: ${body.id}`
        );
        error.statusCode = 401;
        throw error;
      } else {
        return blog.update({
          cDescription: body.description,
        });
      }
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

blogs.delete("/", authenticate, (req, res, next) => {
  const body = req.body;

  if (!body.id) {
    const error = new Error("Data not formatted properly");
    error.statusCode = 400;
    throw error;
  }

  models.Blog.findOne({
    where: {
      pkBlog: body.id,
    },
  })
    .then((blog) => {
      if (blog.fkUser != req.token.id) {
        const error = new Error(
          `Cannot delete blog as you do not own the blog with id: ${body.id}`
        );
        error.statusCode = 401;
        throw error;
      } else {
        return blog.destroy();
      }
    })
    .then((_) => {
      res.sendStatus(200);
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
        const error = new Error(
          `Blog with id: ${req.params.id} does not exist`
        );
        error.statusCode = 404;
        throw error;
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
        error.statusCode = 404;
        throw error;
      } else if (blog.fkUser != req.token.id) {
        const error = new Error(
          `Cannot add a post to the blog as you do not own the blog with id: ${req.params.id}`
        );
        error.statusCode = 401;
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

blogs.get("/subscriptions", (req, res, next) => {
  models.Subscription.findAll({
    where: {
      fkUser: req.token.id,
    },
  })
    .then((subscriptions) => {
      if (subscriptions.length == 0) {
        return [];
      } else {
        return Promise.all(
          subscriptions.map((subscription) => {
            return models.Blog.findOne({
              where: {
                pkBlog: subscription.fkBlog,
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
            });
          })
        );
      }
    })
    .then((blogs) => {
      if (blogs.length == 0) {
        res.json([]);
      } else {
        res.json(
          blogs.map((blog) => {
            const { rows } = dataCleaner(blog);
            return {
              id: rows[0].pkBlog,
              description: rows[0].cDescription,
              subscriberCount: rows[0].iSubscriberCount,
              owner: rows[0].owner,
            };
          })
        );
      }
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
