module.exports = (sequelize, DataTypes) => {
  const Applied_visa_files = sequelize.define("applied_visa_files", {
    refrense_no: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true   // 🔥 YE LINE ADD KARO
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    visa_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    citizen_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  return Applied_visa_files;
};
