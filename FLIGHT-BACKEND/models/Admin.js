module.exports = (sequelize, DataTypes) => {

    const Admin = sequelize.define("admin", {
      name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      mobile_no: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
    })

    return Admin;
}