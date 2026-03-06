module.exports = (sequelize, DataTypes) => {

  const setting = sequelize.define("setting", {
    project_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin_logo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin_version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    app_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    app_logo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    app_primary_color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    app_secondary_color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    app_other_color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    app_version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    agora_key_1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    agora_key_2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    server_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firebase_file: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    razorpay_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    razorpay_prod_key: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    aitool_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    aitool_username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    aitool_password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    support_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    support_whatsapp_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    support_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    support_start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    support_end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    otp_length: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    password_length: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    flight_agency_charge: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    visa_agency_charge: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otb_agency_charge: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    razorpay_prod_on: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    etrav_api_prod_on: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    airiq_api_prod_on: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    etrav_api_uat_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    airiq_api_uat_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    etrav_api_prod_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    airiq_api_prod_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    child_visa_prize: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    insurance_prize: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    etrav_api_uat_username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    etrav_api_uat_password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    etrav_api_prod_username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    etrav_api_prod_password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    airiq_api_uat_username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    airiq_api_uat_password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    airiq_api_prod_username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    airiq_api_prod_password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    flight_charges: {
      type: DataTypes.STRING,
      allowNull: true
    },
  });

  return setting

}