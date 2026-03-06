const { Sequelize, DataTypes } = require("sequelize");
const {
  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  DB_DIALECT,
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: false,



  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connected..");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.admin = require("./Admin.js")(sequelize, DataTypes);
db.contactsupport = require("./ContactSupport.js")(sequelize, DataTypes);
db.feedback = require("./Feedback.js")(sequelize, DataTypes);
db.language = require("./Language.js")(sequelize, DataTypes);
db.otp = require("./OTP.js")(sequelize, DataTypes);
db.reporteduser = require("./ReportedUsers.js")(sequelize, DataTypes);
db.setting = require("./Setting.js")(sequelize, DataTypes);
db.users = require("./Users.js")(sequelize, DataTypes);
db.country = require("./Country.js")(sequelize, DataTypes);
db.visa = require("./Visa.js")(sequelize, DataTypes);
db.oktb = require("./Oktb.js")(sequelize, DataTypes);
db.applied_visa = require("./Applied_visa.js")(sequelize, DataTypes);
db.applied_visa_files = require("./Applied_visa_files.js")(
  sequelize,
  DataTypes
);
db.agent = require("./Agent.js")(sequelize, DataTypes);
db.wallet = require("./Wallet.js")(sequelize, DataTypes);
db.booking = require("./Booking.js")(sequelize, DataTypes);
db.countrystatus = require("./CountryStatus.js")(sequelize, DataTypes);
db.airline = require("./Airline.js")(sequelize, DataTypes);
db.withdraw = require("./Withdraw.js")(sequelize, DataTypes);
db.airlineprice = require("./AirlinePrice.js")(sequelize, DataTypes);
db.cancel = require("./Cancel.js")(sequelize, DataTypes);
db.series_booking = require("./Series_Booking.js")(sequelize, DataTypes);
db.flight_api = require("./Flight_api.js")(sequelize, DataTypes);
db.flight_api_charges = require("./Flight_api_charges.js")(
  sequelize,
  DataTypes
);
db.payment_history_online = require("./payment_history_online.js")(
  sequelize,
  DataTypes
);

db.visa_agent_charges = require("./Visa_agent_charge.js")(sequelize, DataTypes);
db.Offline_ticket = require("./Offline_ticket.js")(sequelize, DataTypes);
db.api_logs = require("./Api_logs.js")(sequelize, DataTypes);

db.users.hasMany(db.oktb, {
  as: "oktbs",
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.oktb.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "applieduser",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.users.hasMany(db.applied_visa_files, {
  as: "visa_applied_users",
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.applied_visa_files.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "visa_applied_user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.applied_visa_files.hasMany(db.applied_visa, {
  as: "applied_visa_list",
  foreignKey: "refrense_no",
  sourceKey: "refrense_no", // this is important if not default `id`
});
db.applied_visa.belongsTo(db.applied_visa_files, {
  foreignKey: "refrense_no",
  targetKey: "refrense_no",
  as: "applieduser_list",
});

db.oktb.belongsTo(db.airline, {
  foreignKey: "airlines",
  as: "airlinedata",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.visa.hasMany(db.applied_visa_files, {
  as: "visas",
  foreignKey: "visa_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.applied_visa_files.belongsTo(db.visa, {
  foreignKey: "visa_id",
  as: "appliedvisa",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.users.hasMany(db.wallet, {
  as: "tusers",
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.wallet.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "tusers",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.users.hasMany(db.withdraw, {
  as: "wusers",
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.withdraw.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "wusers",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.users.hasOne(db.agent, {
  as: "agents",
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.agent.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "agents",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.airlineprice.belongsTo(db.airline, {
  foreignKey: "airline_id",
  as: "airlineDetails",
});
db.airlineprice.belongsTo(db.countrystatus, {
  foreignKey: "country_id",
  as: "countryDetails",
});

db.country.belongsTo(db.countrystatus, {
  foreignKey: "country_id",
  as: "country_Details",
});

db.airline.hasMany(db.airlineprice, { foreignKey: "airline_id", as: "prices" });

db.countrystatus.hasMany(db.airlineprice, {
  foreignKey: "country_id",
  as: "countryPrices",
});

db.users.hasOne(db.booking, {
  as: "bookings",
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.booking.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "bookings",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.booking.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.users.hasOne(db.cancel, {
  as: "cancelsusers",
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.cancel.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "cancelsusers",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.users.hasOne(db.series_booking, {
  as: "series_bookings",
  foreignKey: "agent_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.series_booking.belongsTo(db.users, {
  foreignKey: "agent_id",
  as: "series_bookings",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.visa.hasOne(db.visa_agent_charges, {
  as: "visa_agent_charges",
  foreignKey: "visa_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.visa_agent_charges.belongsTo(db.visa, {
  foreignKey: "visa_id",
  as: "visa_agent_charges",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.airline.hasOne(db.Offline_ticket, {
  as: "airline_details",
  foreignKey: "airline",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.Offline_ticket.belongsTo(db.airline, {
  foreignKey: "airline",
  as: "airline_details",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.Offline_ticket.belongsTo(db.country, {
  foreignKey: "from",
  as: "from_airline",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.Offline_ticket.belongsTo(db.country, {
  foreignKey: "to",
  as: "to_airline",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// sequelize.sync();

module.exports = db;
