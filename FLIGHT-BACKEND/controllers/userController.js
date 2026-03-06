const { validationResult, Result } = require("express-validator");
const JWT_SECRET = "rdk0786";
const bcrypt = require("bcrypt");
const saltRounds = 10;
const UserModel = require("../models").users;
const AgentModel = require("../models").agent;
const WithdrawModel = require("../models").withdraw;
const WalletModel = require("../models").wallet;
const jwt = require("jsonwebtoken");
const { where, Association, Sequelize, Op } = require("sequelize");
const { sendMail } = require("../helpers/send_mail");
const SettingModel = require("../models").setting;
const crypto = require('crypto');

async function account_login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  try {
    const model = await UserModel.findOne({
      where: { email: req.body.email, type: req.body.type, status: "1" },
      include: [
        {
          model: AgentModel,
          as: "agents",
        }
      ],
    });

    if (model != null) {
      const token = jwt.sign({ id: model.id }, JWT_SECRET);
      const comparison = await bcrypt.compare(
        req.body.password,
        model.password
      );
      if (comparison) {
        delete model.password;
        res.status(200).send({
          status: true,
          message: "Login Successfully",
          data: { token: token, model: model },
        });
      } else {
        res.status(403).send({
          status: false,
          message: "Invaild Login Details",
          data: {},
        });
      }
    } else {
      res.status(403).send({
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

async function create_account(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  let info;
  try {
    info = JSON.parse(req.body.data);
  } catch (err) {
    return res.status(400).send({
      status: false,
      message: "Not valid data format",
    });
  }
  if (!info.email || !info.password) {
    return res
      .status(400)
      .json({ status: false, message: "Email & password is Required !" });
  }

  try {
    const model = await UserModel.findOne({
      where: {
        [Op.or]: [
          { email: info.email },
          { mobile_no: info.mobile_no }
        ],
        type: info.type
      }
    });
    if (!model) {
      const hashedPassword = await bcrypt.hash(info.password, saltRounds);
      info.password = hashedPassword;
      info.status = info.type == '2' ? "2" : "1";
      const User = await UserModel.create(info);
      const settingdata = await SettingModel.findOne({ where: { id: '1' }, });
      // console.log(req.files);
      const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Created</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #ececf2; margin: 0; padding: 0;">
  <table style="width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px;">
    <!-- Header Section -->
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #ffa85d; color: #ffffff; border-radius: 8px 8px 0 0;">
        <img src="https://vivantravels.com/static/media/logo.7d19d5194296db63d18a.png" alt="Vivan Travels Logo" style="max-width: 150px; margin-bottom: 10px;">
        <h1 style="margin: 0;">${info.type == "2"
          ? "Agent Signup Received"
          : "Welcome to Vivan Travels"
        }</h1>
      </td>
    </tr>

    <!-- Content Section -->
    <tr>
      <td style="padding: 20px;">
        <p style="margin: 0 0 10px; font-size: 16px; color: #333333;">Dear ${info.name
        },</p>

        <!-- Agent Message -->
        ${info.type == "2"
          ? `
          <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">Thank you for registering as an agent with Vivan Travels. Your account is currently under review by our verification team.</p>
          <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">We will notify you via email once your account is approved and activated.</p>
        `
          : `
          <!-- User Message -->
          <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">Welcome to Vivan Travels! Your user account has been created successfully.</p>
          <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">We’re excited to have you onboard. Explore and enjoy our travel services.</p>
          <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">
            You can now <a href="https://vivantravels.com/#/login" style="color: #ffa85d; text-decoration: none;">log in</a> to your account.
          </p>
        `
        }

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #dddddd; font-size: 16px; color: #333333;">Name:</td>
            <td style="padding: 8px; border: 1px solid #dddddd; font-size: 16px; color: #333333;">${info.name
        }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #dddddd; font-size: 16px; color: #333333;">Email:</td>
            <td style="padding: 8px; border: 1px solid #dddddd; font-size: 16px; color: #333333;">${info.email
        }</td>
          </tr>
        </table>

        <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">If you have any questions or need help, feel free to contact our support team.</p>
        <p style="margin: 20px 0 0; font-size: 16px; color: #333333;">Best Regards,</p>
        <p style="margin: 5px 0 0; font-size: 16px; color: #333333;">Vivan Travels Team</p>
      </td>
    </tr>

    <!-- Footer Section -->
    <tr>
      <td style="padding: 20px; background-color: #f4f4f4; text-align: center; border-radius: 0 0 8px 8px;">
        <p style="margin: 0; font-size: 14px; color: #666666;">Website: <a href="https://vivantravels.com" style="color: #ffa85d; text-decoration: none;">vivantravels.com</a></p>
        <p style="margin: 0; font-size: 14px; color: #666666;">Contact: ${settingdata ? settingdata.support_no : 'Not Available'}</p>
        <p style="margin: 10px 0 0; font-size: 14px; color: #666666;">&copy; 2025 Vivan Travels. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>

`;
      sendMail(
        info.email,
        info.account_type === "agent"
          ? "Agent Signup Received"
          : "Welcome to Vivan Travels",
        emailHtml
      );

      if (info.type == '2') {
        if (req.files) {
          if (req.files.gst_certificate_photo) {
            info.gst_certificate_photo = "agent_document/" + req.files.gst_certificate_photo[0].filename;
          } if (req.files.pan_no_photo) {
            info.pan_no_photo = "agent_document/" + req.files.pan_no_photo[0].filename;
          } if (req.files.proof_photo_font) {
            info.proof_photo_font = "agent_document/" + req.files.proof_photo_font[0].filename;
          } if (req.files.proof_photo_back) {
            info.proof_photo_back = "agent_document/" + req.files.proof_photo_back[0].filename;
          } if (req.files.Office_address_proof_photo) {
            info.Office_address_proof_photo = "agent_document/" + req.files.Office_address_proof_photo[0].filename;
          } if (req.files.logo) {
            info.logo = "agent_document/" + req.files.logo[0].filename;
          }
        }
        info.user_id = User.id;
        await AgentModel.create(info);
      }

      const token = jwt.sign({ id: User.id }, JWT_SECRET);
      return res
        .status(200)
        .send({
          status: true,
          message: "Account successfully register with us",
          data: { token: token, model: User },
        });
    } else {
      return res
        .status(400)
        .json({
          status: false,
          message: "Record already exist in our databese !",
        });
    }
  } catch (err) {
    console.error("Error register account :", err);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
}

async function users_profile(req, res) {
  try {
    const user = await UserModel.findOne({
      where: { id: req.user.id }, include: [
        {
          model: AgentModel,
          as: "agents",
        }
      ],
    });
    if (user) {
      res.status(200).send({
        status: true,
        message: "Data retrieving successfully",
        data: user,
      });
    } else {
      res.status(403).send({
        status: false,
        message: "Data not found",
        data: user,
      });
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "An error occurred while retrieving data",
      error: error.message,
    });
  }
}

async function users_list(req, res) {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const offset = (page - 1) * limit;

    const { name, mobile_no, email } = req.body;

    const whereClause = { type: "1" };
    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` };
    }
    if (mobile_no) {
      whereClause.mobile_no = { [Op.like]: `%${mobile_no}%` };
    }
    if (email) {
      whereClause.email = { [Op.like]: `%${email}%` };
    }
    const totalUsers = await UserModel.count({ where: whereClause });
    const users = await UserModel.findAll({
      where: whereClause,
      offset: offset,
      limit: limit,
    });

    res.status(200).send({
      status: true,
      message: "Data retrieved successfully",
      data: users,
      pagination: {
        totalUsers: totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        pageSize: limit,
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

async function update_profile(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  try {
    let info;

    try {
      info = JSON.parse(req.body.data);
    } catch (err) {
      return res.status(400).send({
        status: false,
        message: "Not valid data format",
      });
    }

    if (req.files) {
      if (req.files.user_profile) {
        info.profile_photo = "user_profile/" + req.files.user_profile[0].filename;
      } if (req.files.gst_certificate_photo) {
        info.gst_certificate_photo = "agent_document/" + req.files.gst_certificate_photo[0].filename;
      } if (req.files.pan_no_photo) {
        info.pan_no_photo = "agent_document/" + req.files.pan_no_photo[0].filename;
      } if (req.files.proof_photo_font) {
        info.proof_photo_font = "agent_document/" + req.files.proof_photo_font[0].filename;
      } if (req.files.proof_photo_back) {
        info.proof_photo_back = "agent_document/" + req.files.proof_photo_back[0].filename;
      } if (req.files.Office_address_proof_photo) {
        info.Office_address_proof_photo = "agent_document/" + req.files.Office_address_proof_photo[0].filename;
      } if (req.files.logo) {
        info.logo = "agent_document/" + req.files.logo[0].filename;
      }
    }

    if (req.body.id == null || !req.body.id) {
      res.status(502).send({ status: false, message: "Somthing went wrong" });
    } else {
      // Fetch current wallet amount
      const agent = await UserModel.findOne({ where: { id: req.body.id } });
      const incoming_wallet = info.wallet;

      // Calculate wallet difference
      let walletDifference = 0;
      if (typeof incoming_wallet !== "undefined" && incoming_wallet !== null) {
        walletDifference = Number(incoming_wallet) - Number(agent.wallet);

        if (walletDifference !== 0) {
          const type = walletDifference > 0 ? 1 : 2;
          const order_id = Math.floor(10000000 + Math.random() * 90000000).toString();
          const infoWallet = {
            user_id: req.body.id,
            order_id: order_id,
            reference_id: order_id,
            transaction_type: 'Wallet Transaction By Admin',
            amount: Math.abs(walletDifference),
            payment_getway: 'wallet',
            details: 'Wallet Transaction By Admin',
            type: type,
            status: 'Success',
            createdAt: new Date(),
          };

          await WalletModel.create(infoWallet);
        }
      }

      // Update other user info
      await UserModel.update(info, { where: { id: req.body.id } });
      info.flight_charges = JSON.stringify(info.flightApiCharges);
      await AgentModel.update(info, { where: { user_id: req.body.id } });
      res.status(200).send({ status: true, message: "Profile Update Successfully" });
    }
  } catch (err) {
    console.error("Error updateing profile:", err);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
}

async function forget_update_password(req, res) {
  if (!req.body.password) {
    return res
      .status(403)
      .send({ status: false, message: "Password required." });
  }

  try {
    const encryptedPassword = await bcrypt.hash(req.body.password, saltRounds);
    await UserModel.update(
      { password: encryptedPassword },
      { where: { id: req.user.id } }
    );

    res
      .status(200)
      .send({ status: true, message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: "Server error." });
  }
}

async function update_password(req, res) {
  const { oldpass, newpass } = req.body;

  if (!oldpass || !newpass) {
    return res
      .status(403)
      .send({ status: false, message: "All fields are required." });
  }

  try {
    const user = await UserModel.findOne({ where: { id: req.user.id } });

    if (!user) {
      return res
        .status(404)
        .send({ status: false, message: "User not found." });
    }

    const passwordMatch = await bcrypt.compare(oldpass, user.password);

    if (!passwordMatch) {
      return res
        .status(403)
        .send({ status: false, message: "Old password is incorrect." });
    }

    const encryptedPassword = await bcrypt.hash(newpass, saltRounds);

    await UserModel.update(
      { password: encryptedPassword },
      { where: { id: req.user.id } }
    );

    return res
      .status(200)
      .send({ status: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Error during password update:", error);
    return res.status(500).send({ status: false, message: "Server error." });
  }
}

async function deactivate_account(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  try {
    // Update user active status
    await UserModel.update(
      { active_status: req.body.status },
      { where: { id: req.user.id } }
    );

    let msg;
    if (req.body.status == "1") {
      msg = "Active";
    } else {
      msg = "Deactivated";
    }

    // Fetch updated user info
    const users = await UserModel.findOne({ where: { id: req.user.id } });

    // Only send mail when account is activated
    if (req.body.status == "1") {
      const settingdata = await SettingModel.findOne({ where: { id: "1" } });

      const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Activated</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #ececf2; margin: 0; padding: 0;">
  <table style="width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px;">
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #ffa85d; color: #ffffff; border-radius: 8px 8px 0 0;">
        <img src="https://vivantravels.com/static/media/logo.7d19d5194296db63d18a.png" alt="Vivan Travels Logo" style="max-width: 150px; margin-bottom: 10px;">
        <h1 style="margin: 0;">Account Activated</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px;">
        <p style="margin: 0 0 10px; font-size: 16px; color: #333333;">Dear ${users.name},</p>
        <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">We are pleased to inform you that your account has been successfully activated.</p>
        <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">You can now log in to your dashboard and start offering visa services through our platform.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://vivantravels.com/#/login" target="_blank" style="background-color: #ffa85d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">Login Now</a>
        </div>
        <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">If you have any questions or require assistance, feel free to reach out to our support team.</p>
        <p style="margin: 20px 0 0; font-size: 16px; color: #333333;">Welcome aboard and best wishes!</p>
        <p style="margin: 10px 0 0; font-size: 14px; color: #666666;">Thank you for partnering with us.</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; background-color: #f4f4f4; text-align: center; border-radius: 0 0 8px 8px;">
        <p style="margin: 0; font-size: 14px; color: #666666;">Website: <a href="https://vivantravels.com" style="color: #ffa85d; text-decoration: none;">vivantravels.com</a></p>
        <p style="margin: 0; font-size: 14px; color: #666666;">Contact: ${settingdata.support_no}</p>
        <p style="margin: 10px 0 0; font-size: 14px; color: #666666;">&copy; 2025 Vivan Travels. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

      await sendMail(users.email, "Account Activated", emailHtml);
    }

    res.status(200).send({
      status: true,
      message: `Account ${msg} Successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: false,
      message: "Internal server error",
    });
  }
}

async function update_user_status(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  try {
    if (req.body.id == null || !req.body.id) {
      res.status(502).send({ status: false, message: "Somthing went wrong" });
    } else {
      let users = await UserModel.findOne({
        where: { id: req.body.id },
        attributes: ["name", 'type', 'status', 'email'],
      });

      console.log(users);

      await UserModel.update(
        { status: req.body.status },
        { where: { id: req.body.id } }
      );
      console.log(`${users.status != req.body.status} &&
        ${users.type == '2'} &&
        ${req.body.status == '1'}`);
      if (
        users.status != req.body.status &&
        users.type == '2' &&
        req.body.status == '2'
      ) {
        const settingdata = await SettingModel.findOne({ where: { id: "1" } });
        // console.log(req.files);
        const emailHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agent Account Activated</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #ececf2; margin: 0; padding: 0;">
    <table style="width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px;">
        <!-- Header Section -->
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #ffa85d; color: #ffffff; border-radius: 8px 8px 0 0;">
                <img src="https://vivantravels.com/static/media/logo.7d19d5194296db63d18a.png" alt="Vivan Travels Logo" style="max-width: 150px; margin-bottom: 10px;">
                <h1 style="margin: 0;">Agent Account Activated</h1>
            </td>
        </tr>
        <!-- Content Section -->
        <tr>
            <td style="padding: 20px;">
                <p style="margin: 0 0 10px; font-size: 16px; color: #333333;">Dear ${users.name},</p>
                <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">We are pleased to inform you that your agent account has been successfully activated.</p>
                
                <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">You can now log in to your dashboard and start offering visa services through our platform.</p>

                <!-- Login Button -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://vivantravels.com/#/login" target="_blank" style="background-color: #ffa85d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">Login Now</a>
                </div>

                <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">If you have any questions or require assistance, feel free to reach out to our support team.</p>

                <p style="margin: 20px 0 0; font-size: 16px; color: #333333;">Welcome aboard and best wishes!</p>
                <p style="margin: 10px 0 0; font-size: 14px; color: #666666;">Thank you for partnering with us.</p>
            </td>
        </tr>
        <!-- Footer Section -->
        <tr>
            <td style="padding: 20px; background-color: #f4f4f4; text-align: center; border-radius: 0 0 8px 8px;">
                <p style="margin: 0; font-size: 14px; color: #666666;">Website: <a href="https://vivantravels.com" style="color: #ffa85d; text-decoration: none;">vivantravels.com</a></p>
                <p style="margin: 0; font-size: 14px; color: #666666;">Contact: ${settingdata.support_no}</p>
                <p style="margin: 10px 0 0; font-size: 14px; color: #666666;">&copy; 2025 Vivan Travels. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>`;
        sendMail(users.email, "Account Activated", emailHtml);
      }
      res
        .status(200)
        .send({ status: true, message: "Status Update Successfully" });
    }
  } catch (err) {
    console.error("Error updateing status:", err);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
}

async function send_Mail(req, res) {
  sendMail(req.mail, "test", "hi");
  res.status(200).send({ status: true, message: "Mail send successfully" });
}

async function update_user_wallet(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  try {
    if (!req.user.id) {
      return res
        .status(502)
        .send({ status: false, message: "Something went wrong" });
    }

    await UserModel.update(
      { wallet: Sequelize.literal("wallet + " + req.body.amount) },
      { where: { id: req.body.id } }
    );

    res
      .status(200)
      .send({ status: true, message: "Wallet recharged successfully" });
  } catch (err) {
    console.error("Error updating wallet:", err);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
}

async function withdraw(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  try {
    if (!req.user.id) {
      return res
        .status(502)
        .send({ status: false, message: "Something went wrong" });
    }

    const user = await UserModel.findOne({
      where: { id: req.body.id },
      attributes: ["wallet"],
    });

    if (user && user.wallet >= req.body.amount) {
      await UserModel.update(
        { wallet: Sequelize.literal(`wallet - ${req.body.amount}`) },
        { where: { id: req.body.id } }
      );
      await WithdrawModel.create({
        user_id: req.body.id,
        amount: req.body.amount,
        date: new Date(),
        status: "Pending",
      });
      res
        .status(200)
        .send({ status: true, message: "Withdraw successfully." });
    } else {
      res.status(403).send({ status: false, message: "Insufficient balance." });
    }


  } catch (err) {
    console.error("Error updating wallet:", err);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
}

async function withdrawlist(req, res) {
  const page = parseInt(req.body.page) || 1;
  const limit = parseInt(req.body.limit) || 10;
  const offset = (page - 1) * limit;
  const whereCondition = req.body.user_id ? { user_id: req.body.user_id } : {};

  // const withdrawalList = await WithdrawModel.findAll({
  //   where: whereCondition,
  // });
  const { count, rows: list } = await WithdrawModel.findAndCountAll({
    where: whereCondition,
    include: [
      {
        model: UserModel, // Include the associated user model
        as: "wusers", // Use the alias defined in the associations
        attributes: ["id", "name", "email"], // Select specific user attributes to return
      },
    ],
    offset: offset,
    limit: limit,
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
}

async function withdrawupdate(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  try {
    if (!req.user.id) {
      return res
        .status(502)
        .send({ status: false, message: "Something went wrong" });
    }
    // Check if the withdrawal entry exists
    // const withdrawalEntry = await WithdrawModel.findOne({
    //   where: { id: req.body.id },
    // });

    // if (withdrawalEntry) {
    // Update the withdrawal status
    await WithdrawModel.update(
      { status: req.body.status },
      { where: { id: req.body.id } }
    );

    // If status is 'reject', refund the amount to the user's wallet

    const data = await WithdrawModel.findOne({
      where: { id: req.body.id },
      include: [
        {
          model: UserModel, // Include the associated user model
          as: "wusers", // Use the alias defined in the associations
          attributes: ["id", "name", "email"], // Select specific user attributes to return
        },
      ],
    });
    if (req.body.status === "Reject") {
      await UserModel.update(
        { wallet: Sequelize.literal(`wallet + ${data.amount}`) },
        { where: { id: data.user_id } }
      );
    }
    console.log("Withdrawal status updated successfully.");
    res
      .status(200)
      .send({
        status: true, data: data,
        message: "Withdrawal status updated successfully.",
      });
    // } else {
    //    res.status(403).send({
    //      status: true,
    //      message: "Withdrawal entry not found.",
    //    });
    //   console.log("Withdrawal entry not found.");
    //   // Handle case when withdrawal entry does not exist, e.g., return an error response
    // }
  } catch (err) {
    console.error("Error updating wallet:", err);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
}

async function logout(req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  let tokenBlacklist = new Set();

  if (token) {
    tokenBlacklist.add(token);
    res.status(200).send({
      status: true,
      msg: "Log out successfully",
    });
  } else {
    res.status(400).send({
      status: false,
      msg: "Somthing went wrong",
    });
  }
}

async function forget_password(req, res) {
  try {

    const user = await UserModel.findOne({ where: { email: req.body.email } });
    if (user) {
      const data = await SettingModel.findOne({ where: { id: '1' }, });

      const randomPassword = crypto.randomBytes(4).toString('hex');
      const encryptedPassword = await bcrypt.hash(randomPassword, saltRounds);
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #ececf2; margin: 0; padding: 0;">
    <table style="width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px;">
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #ffa85d; color: #ffffff; border-radius: 8px 8px 0 0;">
                <img src="https://vivantravels.com/static/media/logo.7d19d5194296db63d18a.png" alt="Vivan Travels Logo" style="max-width: 150px; margin-bottom: 10px;">
                <h1 style="margin: 0; font-size: 24px;">Password Reset</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
                <p style="margin: 0 0 10px; font-size: 16px; color: #333333;">Hi ${user.name},</p>
                <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">We received a request to reset your password. Here is your new password:</p>
                <p style="margin: 0 0 20px; font-size: 18px; font-weight: bold; color: #ffa85d; text-align: center;">${randomPassword}</p>
                <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">For security reasons, we recommend you change your password after logging in.</p>
                <a href="https://vivantravels.com/#/login" style="display: inline-block; padding: 10px 20px; background-color: #ffa85d; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px; text-align: center;">Log In Now</a>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; background-color: #f4f4f4; text-align: center; border-radius: 0 0 8px 8px;">
                <p style="margin: 10px 0; font-size: 14px; color: #666666;">Website: <a href="https://vivantravels.com" style="color: #ffa85d; text-decoration: none;">vivantravels.com</a></p>
                <p style="margin: 0; font-size: 14px; color: #666666;">Contact: ${data.support_no}</p>
                <p style="margin: 10px 0 0; font-size: 14px; color: #666666;">&copy; 2025 Vivan Travels. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>
`;
      sendMail(req.body.email, "Password Reset", emailHtml);

      await UserModel.update(
        { password: encryptedPassword },
        { where: { email: req.body.email } }
      );

      res
        .status(200)
        .send({ status: true, message: "A new password has been sent to your email!" });
    } else {
      res
        .status(200)
        .send({ status: false, message: "Record does not exist with us " });
    }


  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: "Server error." });
  }
}

module.exports = {
  create_account,
  account_login,
  users_list,
  users_profile,
  update_password,
  update_profile,
  forget_update_password,
  deactivate_account,
  update_user_status,
  send_Mail,
  update_user_wallet,
  logout,
  withdraw,
  withdrawupdate,
  withdrawlist,
  forget_password
};
