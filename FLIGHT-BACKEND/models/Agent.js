module.exports = (sequelize, DataTypes) => {

    const Agent = sequelize.define("agent", {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        company_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        type_of_Ownership: {
            type: DataTypes.STRING,
            allowNull: true
        },
        gst_no: {
            type: DataTypes.STRING,
            allowNull: true
        },
        gst_certificate_photo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        office_Address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true
        },
        city_district: {
            type: DataTypes.STRING,
            allowNull: true
        },
        alt_mobile_number_1: {
            type: DataTypes.STRING,
            allowNull: true
        },
        alt_mobile_number_2: {
            type: DataTypes.STRING,
            allowNull: true
        },
        pan_no: {
            type: DataTypes.STRING,
            allowNull: true
        },
        pan_no_photo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        proof_type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        proof_photo_font: {
            type: DataTypes.STRING,
            allowNull: true
        },
        proof_photo_back: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Office_address_proof_photo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        pincode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        website: {
            type: DataTypes.STRING,
            allowNull: true
        },
        commission: {
            type: DataTypes.STRING,
            allowNull: true
        },
        logo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        flight_booking_c: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0'
        },
        series_flight_booking_c: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0'
        },
        visa_booking_c: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0'
        },
        otb_booking_c: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0'
        }, visa_booking_child_c: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0'
        },
        block_visa_country: {
            type: DataTypes.STRING,
            allowNull: true
        },
        flight_charges: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'Active'
        },
    })

    return Agent
}