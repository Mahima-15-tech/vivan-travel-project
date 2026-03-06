const { validationResult, Result } = require("express-validator");
const JWT_SECRET = "rdk0786";
const bcrypt = require("bcrypt");
const saltRounds = 10;
const UserModel = require("../models").users;
const AdminModel = require("../models").admin;
const OTPModel = require("../models").otp;
const jwt = require("jsonwebtoken");
const { where, Association, Sequelize, Op } = require("sequelize");
const { sendMail } = require('../helpers/send_mail');



async function admin_login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  try {
    const model = await AdminModel.findOne({
      where: { email: req.body.email },
    });
    if (model != null) {
      const comparison = await bcrypt.compare(
        req.body.password,
        model.password
      );
      if (comparison) {
        const token = jwt.sign({ id: model.id }, JWT_SECRET);
        delete model.password;
        res.status(200).send({
          status: true,
          message: "Login Successfully",
          data: { token: token, data: { name: model.name, email: model.email, mobile_no: model.mobile_no } },
        });
      } else {
        res.status(502).send({
          status: false,
          message: "Invaild Login Details",
          data: {},
        });
      }
    } else {
      res.status(502).send({
        status: false,
        message: "Invaild Login Details",
        data: {},
      });
    }
  } catch (err) {
    console.error("Error inserting User into database:", err);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
}

async function admin_create(req, res) {

  const encryptedPassword = await bcrypt.hash(req.body.password, saltRounds);
  info = {
    name: req.body.name,
    email: req.body.email,
    mobile_no: req.body.mobile_no,
    password: encryptedPassword,
  };

  const model = await AdminModel.create(info);
  delete model["password"];
  res.status(200).send({
    status: true,
    message: "Account create successfully",
  });
}

async function admin_profile(req, res) {
  try {
    const model = await AdminModel.findOne({ where: { id: req.user.id } });
    if (model != null) {
      const { password, ...modelWithoutPassword } = model.toJSON();
      res.status(200).send({
        status: true,
        message: "Profile retrieved successfully",
        data: modelWithoutPassword,
      });
    } else {
      res.status(502).send({
        status: false,
        message: "Details not found",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "An error occurred while retrieving profile",
      error: error.message,
    });
  }
}


async function send_otp_to_password(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  const existingUser = await UserModel.findOne({
    mainlist: {
      mobile_no: req.body.mobile_no,
    },
  });
  if (!existingUser) {
    return res.status(403).send({ status: false, message: "This mobile no is not registor." })
  }
  let info = {
    value: req.body.mobile_no,
    otp: generateOTP(),
  };
  try {
    const otp = await OTPModel.create(info);
    res
      .status(200)
      .send({ status: true, message: "OTP Sent Successfully", data: otp });
  } catch (err) {
    console.error("Error inserting OTP into database:", err);
    res.status(500).send({ status: false, message: err });
  }
}

async function Verify_otp_to_password(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  try {
    data = await OTPModel.findOne({
      where: {
        value: req.body.mobile_no,
      },
      order: [["id", "DESC"]],
    });

    if (data == null) {
      res.status(502).send({ status: false, message: "Invaild Request" });
    } else if (data.otp == req.body.otp) {
      await OTPModel.destroy({
        where: {
          value: req.body.mobile_no,
        },
      });
      res.status(200).send({ status: true, message: "OTP Verify Successfully" });
    } else {
      res.status(502).send({ status: false, message: "OTP Wrong" });
    }
  } catch (err) {
    console.error("Error inserting OTP into database:", err);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
}

async function forget_update_password(req, res) {

  if (!req.body.password) {
    return res.status(403).send({ status: false, message: "Password required." });
  }

  try {
    const encryptedPassword = await bcrypt.hash(req.body.password, saltRounds);
    await UserModel.update(
      { password: encryptedPassword },
      { where: { id: req.user.id } }
    );

    res.status(200).send({ status: true, message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: "Server error." });
  }
}

async function admin_profile_update(req, res) {
  let info = JSON.parse(req.body.data);
  try {
    const model = await AdminModel.update(info, { where: { id: req.user.id } });
    // const otp = await OTPModel.create(info);
    res.status(200).send({
      status: true,
      message: "Profile Update Successfully",
      data: model,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
}

async function admin_password_update(req, res) {
  const { newpass, conpassword } = req.body;

  if (!newpass || !conpassword) {
    return res.status(403).send({ status: false, message: "All fields are required." });
  }
  if (newpass !== conpassword) {
    return res.status(403).send({ status: false, message: "New password and confirm password do not match." });
  }
  const encryptedPassword = await bcrypt.hash(newpass, saltRounds);
  info = {
    password: encryptedPassword,
  };
  try {
    const model = await await AdminModel.update(info, { where: { id: req.user.id } });
    res.status(200).send({ status: true, message: "Password Update Successfully", });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: "Server error." });
  }
}

async function logout(req, res) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  let tokenBlacklist = new Set();

  if (token) {
    tokenBlacklist.add(token);
    await UserModel.update(
      { fcm: '' },
      { where: { id: req.user.id } }
    );
    res.status(200).json({
      msg: 'logged out Successfully'
    });
  } else {
    res.status(400).json({
      msg: 'No token to blacklist'
    });
  }
}

module.exports = {
  admin_login,
  admin_create,
  send_otp_to_password,
  Verify_otp_to_password,
  forget_update_password,
  admin_profile,
  admin_profile_update,
  admin_password_update,
  logout,
};

