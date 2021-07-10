const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config.json")[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = {};

db.user = require("./user")(sequelize, Sequelize.DataTypes);
db.blog = require("./blog")(sequelize, Sequelize.DataTypes);
db.post = require("./post")(sequelize, Sequelize.DataTypes);
db.category = require("./category")(sequelize, Sequelize.DataTypes);
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

db.post.belongsTo(db.blog, {
  foreignKey: "fkBlog",
  targetKey: "pkBlog",
});

db.category.hasMany(db.blog, {
  foreignKey: "fkCategory",
  targetKey: "pkCategory",
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
