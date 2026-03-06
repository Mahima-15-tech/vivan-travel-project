const { validationResult, Result } = require("express-validator");
const { Sequelize, Op, fn, col, where } = require("sequelize");
const AirlineModel = require("../models").airline;
const CountryStatus = require("../models").countrystatus;
const AirlinePrice = require("../models").airlineprice;

async function add(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  const info = req.body;
  let image = "";
  if (req.files) {
    if (req.files.airline_logo) {
      info.logo = "airline_logo/" + req.files.airline_logo[0].filename;
    }
  }
  let data;
  try {
    let msg;
    if (req.body.id) {
      await AirlineModel.update(info, { where: { id: req.body.id } });
      msg = "Update";
      data = await AirlineModel.findOne({
        where: {
          id: req.body.id,
        },
      });
    } else {
      data = await AirlineModel.create(info);
      msg = "Create";
    }

    res
      .status(200)
      .send({
        status: true,
        message: "Airline " + msg + " successfully",
        data: data,
      });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Failed to add Airline",
      error: error.message,
    });
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

  const search = req.body.search || "";
  const whereClause = {};

  if (search) {
    whereClause.name = { [Op.like]: `%${search}%` };
  }
  try {
    const { count, rows: list } = await AirlineModel.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: parseInt(offset),
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
async function singledata(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  try {
     let data = [];
    if ( req.body.code) {
      data = await AirlineModel.findOne({
        where: { code: req.body.code },
      });
    }else{
      data = await AirlineModel.findAndCountAll();
    }
   
    if (data) {
      res.status(200).send({
        status: true,
        message: "Data retrieved successfully",
        data: data,
      });
    } else {
      res.status(403).send({
        status: false,
        message: "No Data Available",
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

async function createOrUpdateAirlinePrice(req, res) {
  const { airline_id, country_id, price, status } = req.body;

  try {
    // Check for existing entry with same airline_id and country_id
    const [airlinePrice, created] = await AirlinePrice.findOrCreate({
      where: {
        airline_id,
        country_id,
      },
      defaults: {
        price,
        status,
      },
    });

    if (!created) {
      // If the record exists, update it
      await airlinePrice.update({ price, status });
      
      // return res.status(200).send({
      //   status: true,
      //   message: "Airline price updated successfully.",
      //   data: data,
      // });
    }
const data = await AirlinePrice.findOne({
  where: { id: airlinePrice.id },
  include: [
    {
      model: AirlineModel,
      as: "airlineDetails",
      attributes: ["id", "name"], // Adjust attributes as needed
    },
    {
      model: CountryStatus,
      as: "countryDetails",
      attributes: ["id", "country_name"], // Adjust attributes as needed
    },
  ],
});
    res.status(200).send({
      status: true,
      message: !created?"Airline price updated successfully.":"Airline price created successfully.",
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error creating or updating airline price.",
      error: error.message,
    });
  }
}

async function listAirlinePrices(req, res) {
  const { page = 1, limit = 10,airline_id='',country_id='',isadmin='no' } = req.body

  try {
    const offset = (page - 1) * limit;
        const whereCondition = {};
        if (airline_id) {
          whereCondition.airline_id = airline_id;
        }
        if (country_id) {
          whereCondition.country_id = country_id;
        }
    if(isadmin=='no'){
              whereCondition.status = 'Active';

    
    }
    const { count, rows } = await AirlinePrice.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: AirlineModel,
          as: "airlineDetails",
          attributes: ["id", "name"], // Adjust attributes as needed
        },
        {
          model: CountryStatus,
          as: "countryDetails",
          attributes: ["id", "country_name"], // Adjust attributes as needed
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]], // Optional ordering
    });

    res.status(200).send({
      status: true,
      message: "Airline prices fetched successfully.",
      data: rows,
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
      message: "Error fetching airline prices.",
      error: error.message,
    });
  }
}
async function getairlineprice(req, res) {

  try {
    const data = await AirlinePrice.findOne({
      where: { country_id: req.body.country_id },
      include: [
        {
          model: AirlineModel,
          as: "airlineDetails",
          attributes: ["id", "name"], // Adjust attributes as needed
        },
        {
          model: CountryStatus,
          as: "countryDetails",
          attributes: ["id", "country_name"], // Adjust attributes as needed
        },
      ],
    });
    res.status(200).send({
      status: true,
      message: "Airline price fetched successfully.",
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error fetching airline prices.",
      error: error.message,
    });
  }
}

module.exports = {
  add,
  list,
  singledata,
  createOrUpdateAirlinePrice,
  listAirlinePrices,
  getairlineprice,
};
