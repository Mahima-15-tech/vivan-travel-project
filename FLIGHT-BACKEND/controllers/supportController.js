const { validationResult, Result } = require("express-validator");
const ContactsupportModel = require("../models").contactsupport;
const FeedbackModel = require("../models").feedback;
const { where } = require("sequelize");
const { Op } = require('sequelize');
const SettingModel = require("../models").setting;


const generateid = () => {
  return Math.floor(1000000 + Math.random() * 9000000).toString();
};

async function add(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  info = {
    support_id: generateid(),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    subject: req.body.subject,
    message: req.body.message,
    status: 'Pending',
  };

  await ContactsupportModel.create(info);
  res.status(200).send({
    status: true,
    message: "Added successfully",
  });
}

async function submit_feedback(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(403).json({ errors: errors.array() });
    }

    info = {
      name: req.body.name,
      designation: req.body.designation,
      message: req.body.message,
    };

    await FeedbackModel.create(info);
    res.status(200).send({
      status: true,
      message: "Feedback Submit Successfully",
    });
  } catch (error) {
    console.log(`submit_feedback .     ${error}`);
    res.status(403).send({
      status: false,
      message: "Something went wrong",
    });
  }
}

async function list(req, res) {
  try {
    // Get page and limit from request body, default to page 1 and limit 10
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const offset = (page - 1) * limit;

    // Get filter criteria from request body
    const { name, mobile_no, email } = req.body;

    // Build where clause for filters
    const whereClause = {};
    if (name) {

      whereClause.name = { [Op.like]: `%${name}%` };
    }
    if (mobile_no) {
      whereClause.mobile_no = { [Op.like]: `%${mobile_no}%` };
    }
    if (email) {
      whereClause.email = { [Op.like]: `%${email}%` };
    }

    // Fetch the total number of users matching the filter criteria
    const totallist = await ContactsupportModel.count({ where: whereClause });

    // Fetch the users with pagination and filters
    const data = await ContactsupportModel.findAll({
      where: whereClause,
      offset: offset,
      limit: limit,
    });

    res.status(200).send({
      status: true,
      message: "Data retrieved successfully",
      data: data,
      pagination: {
        totallist: totallist,
        currentPage: page,
        totalPages: Math.ceil(totallist / limit),
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

async function feedbacklist(req, res) {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = req.body.ishome == "yes" ? 1000 : parseInt(req.body.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await FeedbackModel.findAndCountAll({
      offset: offset,
      limit: limit,
    });

    res.status(200).send({
      status: true,
      message: "Data retrieved successfully",
      data: result.rows,
      pagination: {
        totallist: result.count,
        currentPage: page,
        totalPages: Math.ceil(result.count / limit),
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

async function deleteFeedback(req, res) {
  try {
    const { id } = req.body; // Extract the id from request parameters

    // Check if the feedback exists
    const feedback = await FeedbackModel.findByPk(id);

    if (!feedback) {
      return res.status(404).send({
        status: false,
        message: "Feedback not found",
      });
    }

    // Delete the feedback
    await feedback.destroy();

    res.status(200).send({
      status: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "An error occurred while deleting feedback",
      error: error.message,
    });
  }
}

async function update(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  info = { status: req.body.status };
  await ContactsupportModel.update(info, { where: { id: req.body.id } });
  res.status(200).send({ status: true, message: `Update successfully`, });
}

async function settings(req, res) {
  const data = await SettingModel.findOne({ where: { id: '1' }, });
  res.status(200).send({
    status: true,
    message: "Data retrieved successfully",
    data: data,
  });
}

async function updateSettings(req, res) {
  try {
    const info = req.body;

    if (req.files) {
      if (req.files.admin_logo) {
        info.admin_logo = "users_images/" + req.files.admin_logo[0].filename;
      }
      if (req.files.firebase_file) {
        info.firebase_file = "firebase/" + req.files.firebase_file[0].filename;
      }
    }


    // if (info.flightApiCharges !== undefined &&
    //   info.flightApiCharges !== null) {
    //   info.flight_charges = JSON.stringify(info.flightApiCharges);
    // }
    const [affectedRows] = await SettingModel.update(info, { where: { id: '1' } });

    if (affectedRows === 0) {
      return res.status(404).send({
        status: false,
        message: "No settings found to update",
      });
    }

    res.status(200).send({
      status: true,
      message: "Update successful",
      data: affectedRows,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).send({
      status: false,
      message: "An error occurred while updating settings",
    });
  }
}

module.exports = {
  add, submit_feedback,
  list, feedbacklist, deleteFeedback,
  update,
  settings,
  updateSettings
};
