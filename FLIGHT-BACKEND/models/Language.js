module.exports = (sequelize, DataTypes) => {

    const language = sequelize.define("language", {
    
        icon: {
            type: DataTypes.STRING,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }) 

    return language

}