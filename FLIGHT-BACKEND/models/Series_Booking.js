
module.exports = (sequelize, DataTypes) => {

    const Series_Booking = sequelize.define("series_booking", {
        agent_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        booking_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Agency_RefNo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        BookingFlightDetails: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        PAX_Details: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        Ticket_Details: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_file: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        Amount: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        paying_method: {
            type: DataTypes.STRING,
            allowNull: true
        },
        amount_res: {
            type: DataTypes.STRING,
            allowNull: true
        },
        travel_agency_charge: {
            type: DataTypes.STRING,
            allowNull: true
        },
        agent_charge: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'Pending',
        },
    })

    return Series_Booking
}

