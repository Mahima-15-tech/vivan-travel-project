const { Transaction } = require("sequelize")

module.exports = (sequelize, DataTypes) => {

  const Withdraw = sequelize.define("withdraw", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Bank",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Pending",
    },

  });

  return Withdraw

}