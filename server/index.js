const https = require("https");
const express = require("express");
const app = express();
const fs = require("fs");
const helmet = require("helmet");
const logger = require("./util/winston");
const { sequelize } = require("./models");
require("dotenv").config(".env");
const port = 8080;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src-attr": ["'unsafe-inline'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://code.jquery.com",
        "https://cdnjs.cloudflare.com",
        "https://stackpath.bootstrapcdn.com",
      ],
    },
  })
);

app.use("/", express.static("../app"));
app.use("/", require("./routes/ui"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/blogs", require("./routes/blogs"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/subscriptions", require("./routes/subscriptions"));

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

sequelize
  .sync({ alter: true })
  // .sync()
  .then(() => {
    https
      .createServer(
        {
          key: fs.readFileSync("server.key"),
          cert: fs.readFileSync("server.cert"),
        },
        app
      )
      .listen(port, () => {
        logger.log({
          logger: "info",
          message: `[Index.js]\tServer listening at https://localhost:${port}.`,
        });
      });
  })
  .catch((error) => {
    logger.log({
      logger: "error",
      message: "[Index]\t" + error,
    });
  });

module.exports = app;
