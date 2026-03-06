module.exports = (sequelize, DataTypes) => {

    const feedback = sequelize.define("feedback", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      designation: {
        type: DataTypes.STRING,
      },
      message: {
        type: DataTypes.TEXT,
      },
    }); 

    return feedback

}