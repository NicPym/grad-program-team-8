const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const root = require("./util/root");
const logger = require("./util/winston");
const port = 8080;

app.use(helmet());

app.use(
  cors({
    origin: "",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((error, req, res, next) => {
  logger.log({
    logger: "error",
    message: error.stack,
  });
  const status = error.statusCode || 500;
  const message = error.message.replace(/^\[.*\](\t){1,}/g, "");
  const data = error.data;
  res.status(status).json({ message: message, data: data, success: false });
});

const server = app.listen(port, () => {
  logger.log({
    logger: "info",
    message: `[Index.js]\tServer listening at http://localhost:${port}.`,
  });
});

module.exports = app;
