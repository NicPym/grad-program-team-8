const auth = require("express").Router();
const logger = require("../util/winston");
const models = require("../models").sequelize.models;
const { dataCleaner, formatDate } = require("../util/helpers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

const getToken = (id, email, name) =>
  jwt.sign(
    {
      id,
      email,
      name,
    },
    SECRET,
    {
      expiresIn: "12h",
    }
  );

auth.post("/login", (req, res, next) => {
  const body = req.body;

  if (!(body.email && body.password)) {
    const error = new Error("Data not formatted properly");
    error.statusCode = 400;
    throw error;
  }

  models.User.findOne({
    where: {
      cEmail: body.email,
    },
  })
    .then(async (user) => {
      if (!user) {
        const error = new Error("Email and/or Password is incorrect");
        error.statusCode = 400;
        throw error;
      } else {
        const hashedPassword = await bcrypt.hash(body.password, user.cSalt);

        if (user.cHashedPassword != hashedPassword) {
          const error = new Error("Email and/or Password is incorrect");
          error.statusCode = 400;
          throw error;
        } else {
          const token = getToken(
            user.pkUser,
            user.cEmail,
            user.cFirstName + " " + user.cLastName
          );

          res.json({
            token,
          });
        }
      }
    })
    .catch((err) => next(err));
});

auth.post("/register", (req, res, next) => {
  const body = req.body;

  if (!(body.name && body.surname && body.email && body.password)) {
    const error = new Error("Data not formatted properly");
    error.statusCode = 400;
    throw error;
  }

  let passwordSalt = "";

  models.User.findOne({
    where: {
      cEmail: body.email,
    },
  })
    .then((user) => {
      if (user) {
        const error = new Error("User already registered");
        error.statusCode = 400;
        throw error;
      } else {
        return bcrypt.genSalt(10);
      }
    })
    .then((salt) => {
      passwordSalt = salt;
      return bcrypt.hash(body.password, salt);
    })
    .then((hashedPassword) => {
      return models.User.create({
        cFirstName: body.name,
        cLastName: body.surname,
        cEmail: body.email,
        cSalt: passwordSalt,
        cHashedPassword: hashedPassword,
      });
    })
    .then((createdUser) => {
      logger.log({
        logger: "info",
        message: `[auth.js]\tCreated new user with email ${createdUser.cEmail}`,
      });

      const token = getToken(
        createdUser.pkUser,
        createdUser.cEmail,
        body.name + " " + createdUser.cLastName
      );

      res.status(200).json({
        token,
      });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = auth;
