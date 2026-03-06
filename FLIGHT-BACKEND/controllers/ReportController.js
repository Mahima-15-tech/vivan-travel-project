const { validationResult, Result } = require("express-validator");
const { where } = require("sequelize");
const { Op } = require('sequelize');
const ReportModel = require("../models").reporteduser;
const UserModel = require("../models").users;

async function add(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  let info = {
    user_id: req.user.id,
    reported_userid: req.body.r_user_id,
    description : req.body.description,
    status : 'Pending',
  };

  await ReportModel.create(info);
  res.status(200).send({
    status: true,
    message: "Added successfully",
  });
}

async function list(req, res) {
  try {
    // Get page and limit from request body, default to page 1 and limit 10
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const offset = (page - 1) * limit;

    // Fetch the total number of users matching the filter criteria
    const totallist = await ReportModel.count();

    // Fetch the users with pagination and filters
    const reports = await ReportModel.findAll({
      offset: offset,
      limit: limit,
    });

    const userPromises = reports.map(async (report) => {
      const use = await UserModel.findOne({ where: { id: report.reported_userid },attributes: ['name', 'email', 'mobile_no'] });
      return {
        ...report.toJSON(),
        Reported_user: use,
      };
    });
    const usersWith = await Promise.all(userPromises);

    res.status(200).send({
      status: true,
      message: "Data retrieved successfully",
      data: usersWith,
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

async function del_report(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  info = { status: req.body.status };
  await ContactsupportModel.update(info, { where: { id: req.body.id } });
  res.status(200).send({ status: true, message: `Update successfully`, });
}

module.exports = {
  add,
  list,
  del_report,
};
