module.exports = (sequelize, DataTypes) => {

    const OTP = sequelize.define("otp", {
        value: {
            type: DataTypes.STRING,
            allowNull: false
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: false
        },
        
    })
    return OTP
}