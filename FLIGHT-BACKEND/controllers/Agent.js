const { validationResult, Result } = require("express-validator");
const { Sequelize, Op, fn, col, where } = require("sequelize");
const AgentModel = require("../models").agent;
const UserModel = require("../models").users;
const Flight_api = require("../models").flight_api;
const v_agent_charge = require("../models").visa_agent_charges;
const visa_modal = require("../models").visa;
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const JWT_SECRET = "rdk0786";

async function add(req, res) {
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

  try {
    const model = await AgentModel.findOne({
      where: { email: info.email },
    });
    if (!model) {
      const hashedPassword = await bcrypt.hash(info.password, saltRounds);
      info.password = hashedPassword;

      if (req.files) {
        if (req.files.gst_certificate_photo) {
          info.gst_certificate_photo =
            "agent_document/" + req.files.gst_certificate_photo[0].filename;
        }
        if (req.files.pan_no_photo) {
          info.pan_no_photo =
            "agent_document/" + req.files.pan_no_photo[0].filename;
        }
        if (req.files.proof_photo_font) {
          info.proof_photo_font =
            "agent_document/" + req.files.proof_photo_font[0].filename;
        }
        if (req.files.proof_photo_back) {
          info.proof_photo_back =
            "agent_document/" + req.files.proof_photo_back[0].filename;
        }
        if (req.files.Office_address_proof_photo) {
          info.Office_address_proof_photo =
            "agent_document/" +
            req.files.Office_address_proof_photo[0].filename;
        }
        if (req.files.logo) {
          info.logo = "agent_document/" + req.files.logo[0].filename;
        }
      }

      if (req.body.id) {
        await AgentModel.update(info, { where: { id: req.body.id } });
        return res
          .status(200)
          .send({ status: true, message: "Details Update successfully" });
      } else {
        const User = await AgentModel.create(info);
        const token = jwt.sign({ id: User.id }, JWT_SECRET);
        return res.status(200).send({
          status: true,
          message: "Account successfully register with us",
          data: { token: token, model: User },
        });
      }
    } else {
      return res.status(400).json({
        status: false,
        message: "Record already exist in our databese !",
      });
    }
  } catch (err) {
    console.error("Error register account :", err);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
}

async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  try {
    const model = await AgentModel.findOne({
      where: { email: req.body.email, status: "Active" },
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
    console.error("Error :", err);
    res.status(500).send({ status: false, message: "Internal server error" });
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

  const mobile = req.body.mobile || "";
  const name = req.body.name || "";
  const status = req.body.status || "";
  let WhereCondition = { type: "2" };
  if (mobile || name || status) {
    WhereCondition = {
      ...WhereCondition, // Keep the existing conditions
      [Op.or]: [
        ...(mobile ? [{ mobile_no: { [Op.like]: `${mobile}%` } }] : []),
        ...(name ? [{ name: { [Op.like]: `${name}%` } }] : []),
        ...(status ? [{ status: { [Op.like]: `${status}%` } }] : []),
      ],
    };
  }

  try {
    const { count, rows: list } = await UserModel.findAndCountAll({
      where: WhereCondition,
      attributes:
        req.body.ishome === "yes" ? ["name", "id", "profile_photo"] : null,
      include: [
        {
          model: AgentModel,
          as: "agents",
          attributes:
            req.body.ishome === "yes"
              ? [
                  "city_district",
                  "state",
                  "user_id",
                  "id",
                  "pincode",
                  "company_name",
                ]
              : null,
        },
      ],
      offset: offset,
      limit: req.body.ishome === "yes" ? 10 : limit,
    });
    res.status(200).send({
      status: true,
      message: "Data retrieved successfully",
      data: list,
      pagination: {
        totallist: count,
        currentPage: page,
        totalPages: Math.ceil(count / (req.body.ishome === "yes" ? 10 : limit)),
        limit: req.body.ishome === "yes" ? 10 : limit,
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

async function delet(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  await AgentModel.destroy({ where: { id: req.body.id } });
  res.status(200).send({ status: true, message: `Record Delete successfully` });
}

async function update_status(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  try {
    await AgentModel.update(
      { status: req.body.status },
      { where: { id: req.body.id } }
    );

    res.status(200).send({
      status: true,
      message: "Agent " + req.body.status + " Successfully",
    });
  } catch (err) {
    res.status(500).send({ status: false, message: "Internal server error" });
  }
}

async function agent_profile(req, res) {
  try {
    const user = await UserModel.findOne({
      where: { id: req.body.id },
      include: [
        {
          model: AgentModel,
          as: "agents",
        },
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

async function flight_apis(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  try {
    const record = await Flight_api.findAll({});
    res.status(200).send({
      status: true,
      message: "Data retrieved successfully",
      data: record,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "An error occurred while retrieving data",
      error: error.message,
    });
  }
}

async function visa_agent_charge(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  try {
    const record = await v_agent_charge.findAll({
      where: { agent_id: req.body.agent_id },
      include: [
        {
          model: visa_modal,
          as: "visa_agent_charges",
        },
      ],
    });
    res.status(200).send({
      status: true,
      message: "Data retrieved successfully",
      data: record,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "An error occurred while retrieving data",
      error: error.message,
    });
  }
}

async function visa_agent_charge_add(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  try {
    const { id, agent_id, visa_id, charge, child_amount } = req.body;
    if (!agent_id || !visa_id || !charge) {
      return res.status(400).json({
        status: false,
        message: "agent_id, visa_id, and charge are required",
      });
    }

    if (id) {
      const updated = await v_agent_charge.update(
        { agent_id, visa_id, price: charge, child_price: child_amount },
        { where: { id } }
      );
      if (updated[0] === 0) {
        return res
          .status(404)
          .json({ status: false, message: "Record not found for update" });
      }
      return res.status(200).send({
        status: true,
        message: "Visa agent charge updated successfully",
      });
    } else {
      const existing = await v_agent_charge.findOne({
        where: { agent_id, visa_id },
      });

      if (existing) {
        return res.status(400).json({
          status: false,
          message: "Charge for this agent and visa already exists",
        });
      }

      const newCharge = await v_agent_charge.create({
        agent_id,
        visa_id,
        price: charge,
        child_price: child_amount,
      });

      res.status(200).send({
        status: true,
        message: "Visa agent charge added successfully",
        data: newCharge,
      });
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "An error occurred while saving data",
      error: error.message,
    });
  }
}

module.exports = {
  add,
  login,
  list,
  delet,
  update_status,
  agent_profile,
  flight_apis,
  visa_agent_charge,
  visa_agent_charge_add,
};
