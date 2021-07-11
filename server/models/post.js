const { Model, Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      pkPost: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      cTitle: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      cDescription: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      cText: {
        type: DataTypes.TEXT("MEDIUMTEXT"),
        allowNull: false,
      },
      createdAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.fn("CURRENT_TIMESTAMP"),
      },
    },
    {
      sequelize,
      modelName: "Post",
    }
  );

  return Post;
};
