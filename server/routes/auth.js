const auth = require("express").Router();
const logger = require("../util/winston");
const models = require("../models").sequelize.models;
const { dataCleaner, formatDate } = require("../util/helpers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

auth.post("/login", (req, res, next) => {
  const body = req.body;

  if (!(body.email && body.password)) {
    const error = new Error("Data not formatted properly");
    error.statusCode = 400;
    throw error;
  }

  models.User.findAll({
    where: {
      cEmail: body.email,
    },
  })
    .then(async (users) => {
      if (users.length == 0) {
        const error = new Error("Email and/or Password is incorrect");
        error.statusCode = 400;
        throw error;
      } else {
        const { rows } = dataCleaner(users);
        const hashedPassword = await bcrypt.hash(body.password, users[0].cSalt);

        if (rows[0].cHashedPassword != hashedPassword) {
          const error = new Error("Email and/or Password is incorrect");
          error.statusCode = 400;
          throw error;
        } else {
          const token = jwt.sign(
            {
              id: users[0].pkUser,
              email: users[0].cEmail,
              name: users[0].cFirstName + " " + users[0].cLastName,
            },
            SECRET,
            {
              expiresIn: "12h",
            }
          );

          res.json({ token: token });
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

  // TODO Use logger
  models.User.findAll({
    where: {
      cEmail: body.email,
    },
  })
    .then((users) => {
      if (users.length > 0) {
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

      res.sendStatus(201);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = auth;
