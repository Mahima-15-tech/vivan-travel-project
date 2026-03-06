module.exports = (sequelize, DataTypes) => {

    const Airline = sequelize.define("airline", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Active",
      },
    });
    
    return Airline

}