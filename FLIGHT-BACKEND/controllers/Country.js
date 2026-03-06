const { validationResult, Result } = require("express-validator");
const CountryModel = require("../models").country;
const CountrySModel = require("../models").countrystatus;
const { where } = require("sequelize");
const { Sequelize, Op } = require('sequelize');

async function add(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(403).json({ errors: errors.array() });
    }
    let info = req.body;

    let msg;
    if (req.body.id) {
      await CountryModel.update(info, { where: { id: req.body.id } });
      msg = "Update";
    } else {
      console.log(info);
      // info.createdAt = new Date(),info.updatedAt = new Date();
      await CountryModel.create(req.body);
      msg = "Create";
    }

    res.status(200).send({
      status: true,
      message: msg + "successfully",
    });
  } catch (error) { console.log(`error ${error}`); }
}

async function list(req, res) {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const offset = (page - 1) * limit;

    const { name, alpha_2,status } = req.body;

    const whereClause = {};
    if (name) {

      whereClause.country_code = { [Op.like]: `%${name}%` };
    }
    if (alpha_2) {
      whereClause.alpha_2 = { [Op.like]: `%${alpha_2}%` };
    }    if (status) {
      whereClause.status = { [Op.like]: `%${status}%` };
    }

    const { count, rows: list } = await CountryModel.findAndCountAll({
      where: whereClause,
      offset,
      limit,
    });
    

    res.status(200).send({
      status: true,
      message: "Data retrieved successfully",
      data: list,
      pagination: {
        totallist: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
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

async function update(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  const info = req.body;
  // info = { 
  //     status: req.body.status,
  //     allow_for_flight: req.body.allow_for_flight,
  //     allow_for_visa: req.body.allow_for_visa,
  //     allow_for_otb: req.body.allow_for_otb,
  //     currency: req.body.currency,
  //  };
  await CountryModel.update(info, { where: { id: req.body.id } });
  res.status(200).send({ status: true, message: `Update successfully`, });
}

async function mainadd(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(403).json({ errors: errors.array() });
    }
    let info = req.body;

    let msg;
    if (req.body.id) {
      await CountrySModel.update(info, { where: { id: req.body.id } });
      msg = "Update";
    } else {
      console.log(info);
      // info.createdAt = new Date(),info.updatedAt = new Date();
      await CountrySModel.create(req.body);
      msg = "Create";
    }

    res.status(200).send({
      status: true,
      message: msg + "successfully",
    });
  } catch (error) {
    console.log(`error ${error}`);
  }
}

async function mainlist(req, res) {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const offset = (page - 1) * limit;

    let countryIds = [];
    if (req.body.country) {
      countryIds = req.body.country ? req.body.country.split(',').map(name => name.trim()) : [];
    }


    const whereClause = {};
    if (req.body.is_from_all == 'yes') {
      if (req.body.search != '') {
        whereClause.country_name = { [Op.like]: `${req.body.search}%` };
      }
      if (req.body.otb_status != '') {
        whereClause.allow_for_otb = req.body.otb_status;
      }
      if (req.body.visa_status != "") {
        whereClause.allow_for_visa = req.body.visa_status;
      }
    }

    const additionalConditions =
      req.body.is_from_all !== "yes"
        ? req.body.type === "visa"
          ? { allow_for_visa: "Yes" }
          : req.body.type === "otb"
            ? { allow_for_otb: "yes" }
            : {}
        : {};
    const { count, rows: list } = await CountrySModel.findAndCountAll({
      where: {
        id: {
          [Sequelize.Op.notIn]: countryIds,
        },
        ...whereClause,
        ...additionalConditions,
      },
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

async function mainupdate(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  const info = req.body;
  // info = {
  //     status: req.body.status,
  //     allow_for_flight: req.body.allow_for_flight,
  //     allow_for_visa: req.body.allow_for_visa,
  //     allow_for_otb: req.body.allow_for_otb,
  //     currency: req.body.currency,
  //  };
  await CountrySModel.update(info, { where: { id: req.body.id } });
  res.status(200).send({ status: true, message: `Update successfully` });
}

module.exports = {
  add,
  list,
  update,
  mainadd,
  mainlist,
  mainupdate,
};
