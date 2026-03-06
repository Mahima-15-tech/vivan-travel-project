module.exports = (sequelize, DataTypes) => {

    const airport_city = sequelize.define("airport_city", {
      city_name: {
        type: DataTypes.STRING,
      },
      city_code: {
        type: DataTypes.STRING,
      },
      alpha_2: {
        type: DataTypes.STRING,
      },
      alpha_3: {
        type: DataTypes.STRING,
      },
    })

    return airport_city;
}