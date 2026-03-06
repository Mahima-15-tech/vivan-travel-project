const { Transaction } = require("sequelize")

module.exports = (sequelize, DataTypes) => {

  const AirlinePrice = sequelize.define("airlineprice", {
    airline_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Active",
    },
  });

  return AirlinePrice

}