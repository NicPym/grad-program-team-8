module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      pkCategory: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      cName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Category",
    }
  );

  return Category;
};
