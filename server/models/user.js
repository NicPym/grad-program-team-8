module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    pkUser: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    cFirstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cLastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cEmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cSaltedPassword: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
  });

  return User;
};
