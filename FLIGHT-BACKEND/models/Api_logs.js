module.exports = (sequelize, DataTypes) => {
  const Api_logs = sequelize.define("api_logs", {
    user_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    api_name: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    api_url: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    api_payload: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    api_response: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
  });
  return Api_logs;
};
