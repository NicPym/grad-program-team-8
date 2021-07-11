const subscriptions = require("express").Router();
const authenticate = require("../util/authenticate");
const models = require("../models").sequelize.models;
const { sequelize } = require("../models");
const { dataCleaner, formatDate } = require("../util/helpers");

subscriptions.get("/", authenticate, (req, res, next) => {
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

module.exports = subscriptions;
