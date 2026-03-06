module.exports = (sequelize, DataTypes) => {

    const reporteduser = sequelize.define("reporteduser", {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reported_userid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
        },
    }) 

    return reporteduser

}