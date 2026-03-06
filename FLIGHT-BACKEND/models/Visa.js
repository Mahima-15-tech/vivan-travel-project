module.exports = (sequelize, DataTypes) => {

    const Visa = sequelize.define("visa", {
        going_from: {
            type: DataTypes.STRING,
            allowNull: false
        },
        going_to: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        about: {
            type: DataTypes.STRING,
            allowNull: true
        },
        spec: {
            type: DataTypes.STRING,
            allowNull: true
        },
        entry: {
            type: DataTypes.STRING,
            allowNull: false
        },
        validity: {
            type: DataTypes.STRING,
            allowNull: false
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: false
        },
        documents: {
            type: DataTypes.STRING,
            allowNull: false
        },
        processing_time: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.STRING,
            allowNull: false
        },
      child_amount: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "0",
      },
        absconding_fees: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Active'
        },
        
    })
    
    return Visa

}