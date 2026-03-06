module.exports = (sequelize, DataTypes) => {
  const payment_history_online = sequelize.define("payment_history_online", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    txnid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    txnid_for: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    response: {
      type: DataTypes.TEXT("long"), // Use "long" for very long text
      allowNull: true,
    },
  });

  return payment_history_online;
};
