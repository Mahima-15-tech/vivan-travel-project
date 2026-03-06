module.exports = (sequelize, DataTypes) => {

    const country = sequelize.define("country", {
        country_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        country_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        alpha_2: {
            type: DataTypes.STRING,
            allowNull: false
        },
        alpha_3: {
            type: DataTypes.STRING,
            allowNull: false
        },
        let: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lng: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // currency: {
        //     type: DataTypes.STRING,
        //     allowNull: true
        // },
        // allow_for_flight: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        //     defaultValue: 'Yes'
        // },
        // allow_for_visa: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        //     defaultValue: 'Yes'
        // },
        // allow_for_otb: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        //     defaultValue: 'Yes'
        // },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Active'
        },

    })

    return country

}