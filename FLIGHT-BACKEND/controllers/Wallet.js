const { response } = require("express");
const { validationResult, Result } = require("express-validator");
const WalletModel = require("../models").wallet;
const UserModel = require("../models").users;
const commissionModel = require("../models").commission_history;
const PaymentHistory = require("../models").payment_history_online;
const { Op } = require("sequelize");

async function add(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  const info = {
    user_id: req.body.user_id,
    order_id: req.body.order_id,
    reference_id: req.body.order_id,
    transaction_type: req.body.transaction_type,
    amount: req.body.amount,
    payment_getway: req.body.payment_getway,
    details: req.body.details,
    type: req.body.type,
    status: req.body.status,
  };
  try {
    const userdetails = await UserModel.findOne({
      where: { id: req.body.user_id },
    });

    let updateAmount = 0;
    if (info.type == "1") {
      updateAmount = Number(userdetails.wallet) + Number(req.body.amount);
    } else {
      updateAmount = Number(userdetails.wallet) - Number(req.body.amount);
    }
    await UserModel.update(
      { wallet: updateAmount },
      { where: { id: req.body.user_id } }
    );
    await WalletModel.create(info);
    const User = await UserModel.findOne({ where: { id: req.body.user_id } });
    return res
      .status(200)
      .send({ status: true, message: "History Save successfully", data: User });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Failed to processing request",
      error: error.message,
    });
  }
}
async function getPaymentHistoryByTxnid(req, res) {
  try {
    const { txnid } = req.query; // Get txnid from query params

    if (!txnid) {
      return res.status(400).json({
        status: false,
        message: "txnid is required",
      });
    }

    const data = await PaymentHistory.findOne({
      where: { txnid: txnid },
      order: [["id", "DESC"]],
    });
    return res.status(200).json({
      status: data ? true : false,
      message: "Payment history retrieved successfully",
      data: data,
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to process request",
      error: error.message,
    });
  }
}
async function payment_history(params) {
  try {
    await PaymentHistory.create({
      user_id: params.user_id,
      txnid: params.order_id,
      txnid_for: params.transaction_type,
      response: params.details,
    });
    return true;
  } catch (error) {
    return false;
  }
}
async function addfromsucessapi(params) {
  const info = {
    user_id: params.user_id,
    order_id: params.order_id,
    reference_id: params.order_id,
    transaction_type: params.transaction_type,
    amount: params.amount,
    payment_getway: params.payment_getway,
    details: params.details,
    type: params.type,
    status: params.status,
  };
  try {
    const userdetails = await UserModel.findOne({
      where: { id: params.user_id },
    });

    let updateAmount = 0;
    if (info.type == "1") {
      updateAmount = Number(userdetails.wallet) + Number(params.amount);
    } else {
      updateAmount = Number(userdetails.wallet) - Number(params.amount);
    }
    await UserModel.update(
      { wallet: updateAmount },
      { where: { id: params.user_id } }
    );
    await WalletModel.create(info);
    const User = await UserModel.findOne({ where: { id: params.user_id } });
    return true;
  } catch (error) {
    return true;
  }
}
async function list(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  const page = parseInt(req.body.page) || 1;
  const limit = parseInt(req.body.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows: list } = await WalletModel.findAndCountAll({
      where: { user_id: req.body.user_id },
      offset: offset,
      limit: limit,
      order: [["createdAt", "DESC"]],
    });
    res.status(200).send({
      status: true,
      message: "Data retrieved successfully",
      data: list,
      pagination: {
        totallist: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        limit: limit,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "An error occurred while retrieving data",
      error: error.message,
    });
  }
}

async function History(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  const page = parseInt(req.body.page) || 1;
  const limit = parseInt(req.body.limit) || 10;
  const offset = (page - 1) * limit;

  let userWhereCondition = {};
  if (req.body.mobile_no) {
    userWhereCondition = {
      [Op.or]: [{ mobile_no: { [Op.like]: `${req.body.mobile_no}%` } }],
    };
  }
  if (req.body.email) {
    userWhereCondition = {
      [Op.or]: [{ email: { [Op.like]: `${req.body.email}%` } }],
    };
  }
  if (req.body.name) {
    userWhereCondition = {
      [Op.or]: [{ name: { [Op.like]: `${req.body.name}%` } }],
    };
  }

  try {
    const { count, rows: list } = await WalletModel.findAndCountAll({
      offset: offset,
      limit: limit,
      include: [
        {
          model: UserModel,
          as: "tusers",
          required: true,
          where: userWhereCondition,
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).send({
      status: true,
      message: "Data retrieved successfully",
      data: list,
      pagination: {
        totallist: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        limit: limit,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "An error occurred while retrieving data",
      error: error.message,
    });
  }
}

async function agent_commission(req, res) {
  try {
    const { count, rows: list } = await commissionModel.findAndCountAll({
      where: { user_id: req.body.user_id },
      offset: offset,
      limit: limit,
      order: [["createdAt", "DESC"]],
    });
    res.status(200).send({
      status: true,
      message: "Data retrieved successfully",
      data: list,
      pagination: {
        totallist: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        limit: limit,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "An error occurred while retrieving data",
      error: error.message,
    });
  }
}

module.exports = {
  add,
  list,
  History,
  agent_commission,
  addfromsucessapi,
  payment_history,
  getPaymentHistoryByTxnid,
};
