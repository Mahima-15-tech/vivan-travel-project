
module.exports = (sequelize, DataTypes) => {

    const Booking = sequelize.define("booking", {
      user_id: {
        type: DataTypes.INTEGER,
      },
      agent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Booking_RefNo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sit_type: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Agency_RefNo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      PNR: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      AirPNRDetails: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      BookingFlightDetails: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      PAX_Details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      Ticket_Details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_file: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      Amount: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      paying_method: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      amount_status: {
        type: DataTypes.STRING,
        defaultValue: "Pending",
      },
      amount_res: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      amount_api_res: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      travel_agency_charge: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      agent_charge: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      booking_type: {
        type: DataTypes.ENUM("1", "2"),
        allowNull: true,
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "Pending",
      },
    });

    return Booking
}

