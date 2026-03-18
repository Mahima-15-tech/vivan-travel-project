const { validationResult, Result } = require("express-validator");
const BookingModel = require("../models").booking;
const UserModel = require("../models").users;
const AgentModel = require("../models").agent;
const CancelModel = require("../models").cancel;
const WalletModel = require("../models").wallet;
const SeriesModel = require("../models").series_booking;
const { Sequelize, Op, fn, col } = require("sequelize");
const SettingModel = require("../models").setting;
const axios = require("axios");
const AirlineModel = require("../models").airline;


async function add(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  const info = {
    user_id: req.body.user_id,
    Booking_RefNo: req.body.Booking_RefNo,
    PAX_Details: req.body.PAX_Details,
    Agency_RefNo: req.body.Agency_RefNo,
  };
  info.status = req.body.status ?? "Pending";
  info.type = 1;
  try {
    await BookingModel.create(info);
    return res
      .status(200)
      .send({ status: true, message: "Temp Ticket Create successfully" });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Failed to processing request",
      error: error.message,
    });
  }
}

// async function addv2(req, res) {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(403).json({ errors: errors.array() });
//   }

//   try {
//     // 🔎 CHECK IF BOOKING EXISTS
//     const existing = await BookingModel.findOne({
//       where: { Booking_RefNo: req.body.Booking_RefNo },
//     });

//     if (existing) {
//       return res.status(200).send({
//         status: true,
//         message: "Booking already exists",
//       });
//     }

//     const payload = req.body;

//     // 🔒 NEVER TRUST FRONTEND AMOUNT
//     // Calculate or validate amount here
    
//     // Example (minimum protection)
//     if (!payload.Amount || payload.Amount <= 0) {
//       return res.status(400).send({
//         status: false,
//         message: "Invalid amount",
//       });
//     }
    
//     // OPTIONAL: agar tumhare paas actual price calculation logic hai
//     // to yaha DB ya flight data se compare karo
    
//     await BookingModel.create({
//       ...payload,
//       Amount: payload.Amount, // only after validation
//     });

//     return res.status(200).send({
//       status: true,
//       message: "Ticket Create successfully",
//     });

//   } catch (error) {
//     res.status(500).send({
//       status: false,
//       message: "Failed to processing request",
//       error: error.message,
//     });
//   }
// }


// async function addv2(req, res) {
//   try {
//     const existing = await BookingModel.findOne({
//       where: { Booking_RefNo: req.body.Booking_RefNo },
//     });

//     if (existing) {
//       return res.status(200).send({
//         status: true,
//         message: "Booking already exists",
//       });
//     }

//     const payload = req.body;

//     // 🚨 BASIC SECURITY (temp fix)
//     if (!payload.Amount || payload.Amount <= 100) {
//       return res.status(400).send({
//         status: false,
//         message: "Invalid or suspicious amount",
//       });
//     }

//     await BookingModel.create({
//       ...payload,
//       Amount: payload.Amount,
//     });

//     return res.status(200).send({
//       status: true,
//       message: "Ticket Create successfully",
//     });

//   } catch (error) {
//     return res.status(500).send({
//       status: false,
//       message: "Failed",
//       error: error.message,
//     });
//   }
// }


async function addv2(req, res) {
  try {
    const payload = req.body;

    // 🔍 Parse booking details
    let flightDetails;
    try {
      flightDetails = JSON.parse(payload.BookingFlightDetails);
    } catch (err) {
      return res.status(400).json({
        status: false,
        message: "Invalid BookingFlightDetails format",
      });
    }

    // ❌ Missing total_price
    // if (!flightDetails.total_price) {
    //   return res.status(400).json({
    //     status: false,
    //     message: "Invalid booking details",
    //   });
    // }

    // 🔥 CALL AGAIN YOUR CHECKFLIGHT API (trusted source)
// 🔥 CALL AGAIN YOUR CHECKFLIGHT API
const verifyResponse = await axios.post(
  "https://vivan-backend.onrender.com/api/third_party/gflight",
  {
    sit_type: payload.sit_type.toString(),
    type: "checkflight",
    data: JSON.stringify({
      query: flightDetails.query,
      flight_keys: flightDetails.flight_keys,
    }),
  }
);

// ✅ ADD THIS LINE
const apiData = verifyResponse.data;

// ✅ proper validation
if (!apiData?.status || !apiData?.data?.success) {
  return res.status(400).json({
    status: false,
    message: "Flight verification failed",
  });
}

// ✅ correct price
const actualAmount = apiData?.data?._data?.flight?.total_price;

if (!actualAmount) {
  return res.status(400).json({
    status: false,
    message: "Unable to fetch valid price",
  });
}

// 🚨 security check
if (Number(payload.Amount) !== Number(actualAmount)) {
  return res.status(400).json({
    status: false,
    message: "Amount mismatch detected",
  });
}
    // 🔁 Check duplicate AFTER validation
    const existing = await BookingModel.findOne({
      where: { Booking_RefNo: payload.Booking_RefNo },
    });

    if (existing) {
      return res.status(200).json({
        status: true,
        message: "Booking already exists",
      });
    }

    // ✅ Save only trusted amount
    await BookingModel.create({
      ...payload,
      BookingFlightDetails: JSON.stringify({
        ...flightDetails,
        total_price: actualAmount, // ✅ overwrite with real price
      }),
      Amount: actualAmount,
    });

    return res.status(200).json({
      status: true,
      message: "Ticket Create successfully",
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
}


async function update(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  try {
    const booking = await BookingModel.findOne({
      where: { Booking_RefNo: req.body.Booking_RefNo },
    });

    if (!booking) {
      return res.status(404).send({
        status: false,
        message: "Booking not found",
      });
    }

    const info = {
      Amount: req.body.Amount ?? booking.Amount,
      paying_method: req.body.paying_method ?? booking.paying_method,
      amount_status: req.body.amount_status ?? booking.amount_status,
      amount_res: req.body.amount_res ?? booking.amount_res,
      Ticket_Details: req.body.Ticket_Details ?? booking.Ticket_Details,
      amount_api_res: req.body.amount_api_res ?? booking.amount_api_res,
      status: req.body.status ?? booking.status,
    };

    await BookingModel.update(info, {
      where: { Booking_RefNo: req.body.Booking_RefNo },
    });

    return res.status(200).send({
      status: true,
      message: "Booking Updated Successfully",
    });

  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Failed to processing request",
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

  try {
    const { count, rows: list } = await BookingModel.findAndCountAll({
      where: {
        user_id: req.body.user_id,
        // Ticket_Details: {
        //   [Op.not]: null,
        // },
      },

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

async function searchbooking(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  try {
    const data = await BookingModel.findOne({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { Booking_RefNo: req.body.id },
              { Agency_RefNo: req.body.id },
            ],
          },
          {
            Ticket_Details: {
              [Op.not]: null,
            },
          },
        ],
      },
    });
    res.status(200).send({
      status: true,
      message: "Data get successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "An error occurred while retrieving data",
      error: error.message,
    });
  }
}

async function get_ticket_details(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  try {
    const data = await BookingModel.findOne({
      where: { Booking_RefNo: req.body.Booking_RefNo },
    });
    res.status(200).send({
      status: true,
      message: "Data retrieved successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "An error occurred while retrieving data",
      error: error.message,
    });
  }
}

async function applied_list(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  const page = parseInt(req.body.page) || 1;
  const limit = parseInt(req.body.limit) || 10;
  const offset = (page - 1) * limit;
  const { name, mobile, bookingStatus } = req.body;
  try {
    let BookingWhereCondition = {};

    // Add filter for booking status
    if (bookingStatus) {
      BookingWhereCondition.status = bookingStatus; // Assuming `status` is the field for booking status
    }

    // WhereCondition for UserModel
    let UserWhereCondition = {};

    // Add filter for user name
    if (name) {
      UserWhereCondition.name = { [Op.like]: `%${name}%` }; // Partial match for name
    }

    // Add filter for user mobile number
    if (mobile) {
      UserWhereCondition.mobile_no = { [Op.like]: `%${mobile}%` }; // Partial match for mobile number
    }

    const { count, rows: list } = await BookingModel.findAndCountAll({
      where: BookingWhereCondition,
      include: [
        {
          model: UserModel,
          as: "bookings",
          where: UserWhereCondition,
        },
      ],
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

async function cancle_booking(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  try {
    let data = "";
    if (req.body.cancel_api_type == "Etrav") {
      const info = {
        status: "cancelled request",
        description: req.body.description,
      };
      data = await BookingModel.update(info, {
        where: { Booking_RefNo: req.body.Booking_RefNo },
      });
    } else {
      const updateinfo = {
        status: "cancelled request",
      };
      data = await SeriesModel.update(updateinfo, {
        where: { booking_id: req.body.Booking_RefNo },
      });
    }

    const info2 = {
      amount: req.body.amount,
      user_id: req.body.user_id,
      Booking_RefNo: req.body.Booking_RefNo,
      type: req.body.type,
      upi: req.body.upi,
      description: req.body.description,
      cancel_api_type: req.body.cancel_api_type,
    };
    await CancelModel.create(info2);

    res.status(200).send({
      status: true,
      message: "Ticket cancel successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "An error occurred while cancel Ticket",
      error: error.message,
    });
  }
}

async function update_status(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  let updateinfo = { status: req.body.status };
  if (req.body.type == 5) {
    updateinfo = { status: req.body.status, PNR: req.body.pnr };
  }
  try {
    await BookingModel.update(updateinfo, { where: { id: req.body.id } });

    res.status(200).send({ status: true, message: "Update Successfully" });
  } catch (err) {
    res.status(500).send({ status: false, message: "Internal server error" });
  }
}

async function cancle_booking_update(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  try {
    await CancelModel.update(
      { status: req.body.status },
      { where: { id: req.body.id } }
    );
    const info = {
      user_id: req.body.user_id,
      order_id: Math.floor(10000000 + Math.random() * 90000000),
      reference_id: Math.floor(10000000 + Math.random() * 90000000),
      transaction_type: "Refund Amount",
      amount: req.body.amount,
      payment_getway: "Online",
      type: "1",
      status: "Success",
      details: '{"amount":"Refund Amount received"}',
    };
    await WalletModel.create(info);
    const Userdata = await UserModel.findOne({
      where: { id: req.body.user_id },
    });
    const amount = Userdata.wallet;

    if (req.body.type == "Wallet") {
      const finalamount = Number(amount) + Number(req.body.amount);
      await UserModel.update(
        { wallet: finalamount },
        { where: { id: req.body.user_id } }
      );
    }

    res.status(200).send({ status: true, message: "Update Successfully" });
  } catch (err) {
    res.status(500).send({ status: false, message: "Internal server error" });
  }
}

async function cancle_list(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  const page = parseInt(req.body.page) || 1;
  const limit = parseInt(req.body.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows: list } = await CancelModel.findAndCountAll({
      include: [
        {
          model: UserModel,
          as: "cancelsusers",
          attributes: ["id", "name", "mobile_no", "email"],
        },
      ],
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

async function Series_Booking(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  try {
    const data = await SeriesModel.create(req.body);
    res.status(200).send({
      status: true,
      message: "Ticket Booked successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "An error occurred while cancel Ticket",
      error: error.message,
    });
  }
}

async function Series_Booking_list(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  const page = parseInt(req.body.page) || 1;
  const limit = parseInt(req.body.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows: list } = await SeriesModel.findAndCountAll({
      where: { agent_id: req.body.user_id },
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

async function S_Booking_list(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  const page = parseInt(req.body.page) || 1;
  const limit = parseInt(req.body.limit) || 10;
  const offset = (page - 1) * limit;

  const mobile_no = req.body.mobile_no || "";
  let userWhereCondition = {};
  if (mobile_no) {
    userWhereCondition = {
      [Op.or]: [{ mobile_no: { [Op.like]: `${mobile_no}%` } }],
    };
  }
  const email = req.body.email || "";
  if (email) {
    userWhereCondition = {
      [Op.or]: [{ email: { [Op.like]: `${email}%` } }],
    };
  }

  try {
    const { count, rows: list } = await SeriesModel.findAndCountAll({
      include: [
        {
          model: UserModel,
          as: "series_bookings",
          where: userWhereCondition,
        },
      ],
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

async function Series_Booking_details(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  try {
    const data = await SeriesModel.findOne({
      where: { booking_id: req.body.booking_id },
    });
    res.status(200).send({
      status: true,
      message: "Data retrieved successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "An error occurred while retrieving data",
      error: error.message,
    });
  }
}

async function Series_update_status(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  try {
    await SeriesModel.update(
      { status: req.body.status },
      { where: { id: req.body.id } }
    );

    res.status(200).send({ status: true, message: "Update Successfully" });
  } catch (err) {
    res.status(500).send({ status: false, message: "Internal server error" });
  }
}
async function get_ticket_etrav_data(reference_id) {
  try {
    const data = await SettingModel.findOne({ where: { id: "1" } });

    let apikey = "";

    let etravparams = { Booking_RefNo: reference_id };

    etravparams["Auth_Header"] = {
      UserId:
        data.etrav_api_prod_on === 1
          ? data.etrav_api_prod_username
          : data.etrav_api_uat_username,
      Password:
        data.etrav_api_prod_on === 1
          ? data.etrav_api_prod_password
          : data.etrav_api_uat_password,
      IP_Address: "0000000000000",
      Request_Id: "5500887959052",
      IMEI_Number: "2232323232323",
    };

    const etravurl = `${
      data.etrav_api_prod_on === 1
        ? data.etrav_api_prod_url + "/flight/AirAPIService.svc/JSONService/"
        : data.etrav_api_uat_url + "/airlinehost/AirAPIService.svc/JSONService/"
    }Air_Reprint`;

    const response = await axios({
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      url: etravurl,
      data: JSON.stringify(etravparams),
    });

    // ✅ Return actual data
    return response.data;
  } catch (error) {
    // console.log("get_ticket_etrav_data error:", error);
    return null;
  }
}
async function get_ticket_gofly_data(reference_id) {
  try {
    // const data = await SettingModel.findOne({ where: { id: "1" } });
    const response = await axios({
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": "test_2b2234580819f38a390c903f1665584a595a3736f19d0415",
        // "api-key": "live_2b2234580819f38a8cc3f03c79bc4050167b550dede3466f",
      },
      // url: "https://api.nexusdmc.com/api/v1/bookings/reference/" + reference_id,
      url: "https://krn.nexusdmc.com/api/v1/bookings/reference/" + reference_id,
    });
    // .then(function (response) {
    return response.data["_data"];
    // })
    // .catch(function (error) {
    //   console.log("get_ticket_gofly_data error:", error);
    //   return "";
    // });
  } catch (error) {
    // console.log("get_ticket_gofly_data error:", error);
    return "";
  }
}
async function aitiq_token(Username, Password, apikey) {
  const payload = {
    Username: Username,
    Password: Password,
  };

  try {
    const response = await axios({
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": apikey,
      },
      url: "https://omairiq.azurewebsites.net/login",
      data: JSON.stringify(payload),
    });
    return response.data.token;
  } catch (error) {
    // console.error("Error fetching token:", error);
    // throw error;
    return "";
  }
}
async function get_ticket_airlq_data(reference_id) {
  try {
    const data = await SettingModel.findOne({ where: { id: "1" } });

    apikey =
      "MTEzMjY3NTA6Vml2YW4gVHJhdmVscyBBbmQgVG91cmlzbToxNzcyMDQ2NjA3MTIyOlZsQitPNWNVSzdKWm1uMGdaN2tLMCt0NDJySEJKNXNYcVJlUGpQQ0tDU1E9";

    authToken = await aitiq_token(
      data.airiq_api_prod_username,
      data.airiq_api_prod_password,
      apikey
    );
    // axios({
    //     method: "post",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Accept: "application/json",
    //       Authorization: authToken,
    //       "api-key": apikey,
    //     },
    //     url: req.body.url,
    //     data: JSON.stringify(dataparams),
    //   })
    //     .then(function (response) {
    //       console.log(response);
    //       return res.status(200).send({
    //         status: true,
    //         message: "Data get successfully",
    //         data: response.data,
    //       });
    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //       return res.status(403).send({ status: false, message: error });
    //     });
    // const data = await SettingModel.findOne({ where: { id: "1" } });
    const response = await axios({
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authToken,
        "api-key": apikey,
      },
      url:
        "https://omairiq.azurewebsites.net/ticket?booking_id=" + reference_id,
    });

    // .then(function (response) {
    return response.data["data"];
    // })
    // .catch(function (error) {
    //   console.log("get_ticket_air_data error:", error);
    //   return "";
    // });
  } catch (error) {
    // console.log("get_ticket_air_data error:", error);
    return "";
  }
}
async function get_ticket_winfly_data(reference_id) {
  try {
    // const data = await SettingModel.findOne({ where: { id: "1" } });
    const response = await axios({
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // url: "https://devapi.flightapi.co.in/v1/fbapi/booking_details",
      url: "https://api.fareboutique.in/v1/fbapi/booking_details",
      data: JSON.stringify({
        reference_id: reference_id,
        transaction_id: "transaction_id",
        // end_user_ip: "183.83.43.117",
        // token: "4-2-3721-KRAZY-389-xnewkncBUI8",
        end_user_ip: "89.116.34.212",
        token: "316-597-VIVAAN9809nuewhbnkcuewIYnj",
      }),
    });
    // .then(function (response) {
    return response.data["data"];
    // })
    // .catch(function (error) {
    //   console.log("get_ticket_gofly_data error:", error);
    //   return "";
    // });
  } catch (error) {
    // console.log("get_ticket_winfly_data error:", error);
    return "";
  }
}
const getetravpaxtype = (code) => {
  switch (code.toString()) {
    case "0":
      return "ADULT";
    case "1":
      return "CHILD";
    case "2":
      return "INFANT";
    default:
      return ""; // or return an empty string
  }
};
const getEtravPaxTypeFromTitle = (label) => {
  switch (label.toUpperCase()) {
    case "MR":
    case "MS":
    case "MRS":
      return "ADULT";

    case "MSTR":
    case "MISS":
      return "CHILD";

    case "INF":
    case "INFANT":
      return "INFANT";

    default:
      return "";
  }
};

async function ticket_Details(req, res) {
  try {
    const reference_id =
      req.body.reference_id ||
      req.body.Agency_RefNo ||
      req.body.Booking_RefNo ||
      req.body.PNR;

    console.log("FINAL REFERENCE USED:", reference_id);

    const data = await BookingModel.findOne({
      where: {
        [Op.or]: [
          { Agency_RefNo: reference_id },
          { Booking_RefNo: reference_id },
          { PNR: reference_id },
        ],
      },
      include: [
        {
          model: UserModel,
          as: "user",
          include: [
            {
              model: AgentModel,
              as: "agents",
              required: false,
            },
          ],
        },
      ],
    });

    if (!data) {
      return res.status(200).send({
        status: false,
        message: "Booking not found",
      });
    }

    const support = await SettingModel.findOne({
      where: { id: "1" },
      attributes: ["id", "support_no", "address", "support_email"],
    });

    let bookingdata = null;

    if (data.Ticket_Details) {
      try {
        bookingdata = JSON.parse(data.Ticket_Details);
      } catch (e) {
        bookingdata = null;
      }
    }

    let pax_list = [];
    let stops = [];
    let ssr = [];

    /* =====================================================
       ✅ TYPE 3 (GOFLY) — FULLY FIXED BLOCK
    ===================================================== */

    if (data.type == 3) {

      if (!bookingdata || !bookingdata._data || !bookingdata._data.booking_items) {
        return res.status(200).send({
          status: false,
          message: "Ticket details not available yet",
        });
      }

      const goflydata = bookingdata._data;

      /* -------- PASSENGERS -------- */

      pax_list = (goflydata.pax_details || []).map((details, index) => ({
        id: index + 1,
        fullName: `${details.title} ${details.first_name} ${details.last_name}`,
        passportNumber: details.passport_num || "",
        pnr:
          goflydata.booking_items?.[0]?.confirmations?.[0]?.pnr ||
          data.PNR ||
          "",
        paxType: details.type,
        dob: details.dob,
      }));

      /* -------- STOPS -------- */

      for (const booking_item of goflydata.booking_items || []) {
        for (const item of booking_item.flight.legs || []) {

          const airlinedata = await AirlineModel.findOne({
            where: { code: item.airline },
            attributes: ["name", "logo"],
          });

          stops.push({
            Airline_Code: item.airline,
            depeparture_city_code: item.origin,
            Departure_DateTime: item.departure_time?.replaceAll("-", "/"),
            Arrival_DateTime: item.arrival_time?.replaceAll("-", "/"),
            arrival_city_code: item.destination,
            flight_number: item.flight_number,
            airline_name: airlinedata?.name || "",
            airline_logo: airlinedata?.logo || "",
            status: "Confirmed",
            hand_baggage: booking_item.flight.cabin_baggage || "",
            check_in_baggage: booking_item.flight.checkin_baggage || "",
          });
        }
      }
    }

    /* ===================================================== */

    return res.status(200).send({
      status: true,
      message: "Data retrieved successfully",
      data: data,
      pax_list: pax_list,
      stops: stops,
      ssr: ssr,
      support: support,
    });

  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "An error occurred while retrieving data",
      error: error.message,
    });
  }
}

async function token(Username, Password, apikey) {
  const payload = {
    Username: Username,
    Password: Password,
  };

  try {
    const response = await axios({
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": apikey,
      },
      url: "https://omairiq.azurewebsites.net/login",
      data: JSON.stringify(payload),
    });
    return response.data.token;
  } catch (error) {
    // console.error("Error fetching token:", error);
    // throw error;
    return "";
  }
}

module.exports = {
  add,
  update,
  list,
  get_ticket_details,
  applied_list,
  cancle_booking,
  update_status,
  cancle_list,
  cancle_booking_update,
  Series_Booking,
  Series_Booking_list,
  Series_Booking_details,
  S_Booking_list,
  Series_update_status,
  addv2,
  searchbooking,
  ticket_Details,
};
