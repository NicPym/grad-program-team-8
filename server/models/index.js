const Sequelize = require("sequelize");
require("dotenv").config("../.env");
const env = process.env.NODE_ENV || "development";
const config = require("../config.json")[env];
const username = process.env.DB_ACCESS_USER;
const password = process.env.DB_ACCESS_PASSWORD;
const dbName = process.env.DB_ACCESS_NAME;

const sequelize = new Sequelize(dbName, username, password, config);

const db = {};

db.user = require("./user")(sequelize, Sequelize.DataTypes);
db.blog = require("./blog")(sequelize, Sequelize.DataTypes);
db.post = require("./post")(sequelize, Sequelize.DataTypes);
db.subscription = require("./subscription")(sequelize, Sequelize.DataTypes);
db.user.hasMany(db.blog, {
  foreignKey: "fkUser",
  targetKey: "pkUser",
});

db.blog.belongsTo(db.user, {
  foreignKey: "fkUser",
  targetKey: "pkUser",
});

db.blog.hasMany(db.subscription, {
  foreignKey: "fkBlog",
  targetKey: "pkBlog",
});

db.blog.hasMany(db.post, {
  foreignKey: "fkBlog",
  targetKey: "pkBlog",
  onDelete: "cascade",
});

db.post.belongsTo(db.blog, {
  foreignKey: "fkBlog",
  targetKey: "pkBlog",
});

db.subscription.belongsTo(db.blog, {
  foreignKey: "fkBlog",
  targetKey: "pkBlog",
});

db.subscription.belongsTo(db.user, {
  foreignKey: "fkUser",
  targetKey: "pkUser",
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
