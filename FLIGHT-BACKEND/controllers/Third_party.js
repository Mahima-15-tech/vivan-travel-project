const axios = require("axios");
const SettingModel = require("../models").setting;
const crypto = require("crypto");
var sha512 = require("js-sha512");
const qs = require("qs"); // Helps convert JSON to form-urlencoded
const moment = require("moment");
const { where, Op, fn, col } = require("sequelize");
const Agent = require("../models").agent;
const OfflineTicketModel = require("../models").Offline_ticket;
const AirlineModel = require("../models").airline;
const CountryModel = require("../models").country;
const fs = require("fs");
const jwt = require("jsonwebtoken");
const BookingModel = require("../models").booking;
const PaymentHistory = require("../models").payment_history_online;


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
        "x-api-key": apiKey
      },
      
      url: "https://omairiq.azurewebsites.net/login",
      data: JSON.stringify(payload),
    });
    // console.log(JSON.stringify(response));
    return response.data.token;
  } catch (error) {
    // console.error("Error fetching token:", error);
    // throw error;
    return "";
  }
}

// async function hdfcCreateOrder(req, res) {
//   try {
//     const { amount, order_id, customer_email } = req.body;

//     const apiKey = process.env.HDFC_API_KEY;
//     const mid = process.env.HDFC_MID;

//     console.log("ENV FILE VALUES:");
// console.log("API KEY:", process.env.HDFC_API_KEY);
// console.log("MID:", process.env.HDFC_MID);


//     const privateKey = fs.readFileSync("private_key.pem", "utf8");

//     const token = jwt.sign(
//       {
//         merchantId: mid,
//         iat: Math.floor(Date.now() / 1000),
//         exp: Math.floor(Date.now() / 1000) + (5 * 60)
//       },
//       privateKey,
//       { algorithm: "RS256" }
//     );

//     console.log("JWT TOKEN:", token);


//     const payload = {
//       merchantId: mid,
//       amount: amount,
//       orderId: order_id,
//       customerEmail: customer_email,
//       currency: "INR",
//       returnUrl: "http://localhost:4000/api/third_party/hdfc-callback"
//     };

//     const response = await axios({
//       method: "post",
//       url: "https://smartgatewayuat.hdfcbank.com/session",
//       headers: {
//         "Content-Type": "application/json",
//         "x-api-key": apiKey,
//         Authorization: `Bearer ${token}`
//       },
//       data: payload
//     });

//     return res.status(200).send({
//       status: true,
//       data: response.data
//     });

//   } catch (error) {
//     console.log(error.response?.data || error.message);
//     return res.status(500).send({
//       status: false,
//       error: error.response?.data || error.message
//     });
//   }
// }

async function hdfcCreateOrder(req, res){
  try {
    console.log("🔥 HDFC CREATE ORDER HIT");
    console.log("📦 Received in Backend:");
console.log(req.body);


    const { amount, order_id, customer_email } = req.body;
    

    if (!amount || !order_id) {
      return res.status(400).json({
        success: false,
        message: "amount and order_id required",
      });
    }

    const apiKey = process.env.HDFC_API_KEY;
    

    const base64Key = Buffer.from(apiKey).toString("base64");

    const response = await axios.post(
      "https://smartgateway.hdfcuat.bank.in/session",
      {
        order_id,
        amount,
        customer_email,   // 👈 use from body
        payment_page_client_id: "hdfcmaster",
        action: "paymentPage",
        return_url: `${process.env.BASE_URL}/api/third_party/hdfc-callback`,
        currency: "INR",
        description: "Complete your payment",
      },
      {
        headers: {
          Authorization: `Basic ${base64Key}`,
          "Content-Type": "application/json",
          "x-merchantid": process.env.HDFC_MID,
          "x-customerid": customer_email,
          "x-resellerid": "hdfc_reseller",
        },
      }
    );

    return res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("HDFC SESSION ERROR:", error.response?.data || error);
    return res.status(500).json({
      success: false,
      error: error.response?.data || "Session creation failed",
    });
  }
};


async function verifyOrder(order_id) {
  const apiKey = process.env.HDFC_API_KEY;
  const base64Key = Buffer.from(apiKey).toString("base64");

  const response = await axios.get(
    `https://smartgateway.hdfcuat.bank.in/orders/${order_id}`,
    {
      headers: {
        Authorization: `Basic ${base64Key}`,
        "x-merchantid": process.env.HDFC_MID,
      },
    }
  );

  return response.data; // 👈 VERY IMPORTANT
}



// async function hdfcCallback(req, res) {
//   try {
//     console.log("HDFC CALLBACK BODY:", req.body);

//     const { order_id } = req.body;

//     if (!order_id) {
//       return res.status(400).send("Order ID missing");
//     }

//     // 🔎 Order verify karo
//     const apiKey = process.env.HDFC_API_KEY;
//     const base64Key = Buffer.from(apiKey).toString("base64");

//     const verifyResponse = await axios.get(
//       `https://smartgateway.hdfcuat.bank.in/orders/${order_id}`,
//       {
//         headers: {
//           Authorization: `Basic ${base64Key}`,
//           "x-merchantid": process.env.HDFC_MID,
//         },
//       }
//     );

//     console.log("VERIFY RESPONSE:", verifyResponse.data);

//     if (verifyResponse.data.status === "CHARGED") {
//       console.log("✅ PAYMENT SUCCESS");
//     } else {
//       console.log("❌ PAYMENT FAILED");
//     }

//     return res.send("Callback received");
//   } catch (error) {
//     console.log("CALLBACK ERROR:", error.response?.data || error.message);
//     return res.status(500).send("Callback failed");
//   }
// }

// async function hdfcCallback(req, res) {
//   try {
//     console.log("📩 HDFC CALLBACK BODY:", req.body);

//     const order_id = req.body.order_id;

//     if (!order_id) {
//       return res.status(400).send("Order ID missing");
//     }

//     console.log("🔁 Callback Order ID:", order_id);

//     // ===============================
//     // ✅ VERIFY PAYMENT FROM HDFC
//     // ===============================
//     const orderDetails = await verifyOrder(order_id);
//     console.log("🔍 HDFC VERIFY RESPONSE:", orderDetails);

//     await PaymentHistory.create({
//       user_id: null,
//       txnid: order_id,
//       txnid_for: "Flight Booking",
//       response: JSON.stringify(orderDetails),
//     });

//     if (orderDetails.status !== "CHARGED") {
//       await BookingModel.update(
//         {
//           amount_status: "Failed",
//           status: "Failed",
//           amount_api_res: JSON.stringify(orderDetails),
//         },
//         { where: { Booking_RefNo: order_id } }
//       );

//       return res.redirect(
//         `http://localhost:5173/#/sucess?status=failed&order_id=${order_id}`
//       );
//     }

//     console.log("✅ PAYMENT SUCCESS");

//     const booking = await BookingModel.findOne({
//       where: { Booking_RefNo: order_id },
//     });

//     if (!booking) {
//       return res.status(404).send("Booking not found");
//     }

//     const setting = await SettingModel.findOne({ where: { id: "1" } });

//     // ===============================
//     // 🔥 DEFINE ALL ETRAV SERVICES
//     // ===============================

//     const baseDomain =
//       setting.etrav_api_prod_on == 1
//         ? setting.etrav_api_prod_url
//         : setting.etrav_api_uat_url;

//     const tradeUrl =
//       baseDomain + "/TradeHost/TradeAPIService.svc/JSONService/";

//     const flightUrl =
//       baseDomain + "/Flight/AirAPIService.svc/JSONService/";

//     const airlineUrl =
//       baseDomain + "/AirlineHost/AirAPIService.svc/JSONService/";

//     console.log("🌍 TRADE URL:", tradeUrl);
//     console.log("🌍 FLIGHT URL:", flightUrl);
//     console.log("🌍 AIRLINE URL:", airlineUrl);

//     // ===============================
//     // ✈️ ETRAV FLOW (TYPE 1,2,5)
//     // ===============================
//     if ([1, 2, 5].includes(booking.type)) {
//       try {
//         // 1️⃣ ADD PAYMENT (TRADE SERVICE)
//         const payPayload = {
//           api_c: "a",
//           is_uat: setting.etrav_api_prod_on == 1 ? "no" : "yes",
//           ClientRefNo: "HDFC Payment",
//           RefNo: order_id + "_" + Date.now(),
//           TransactionType: 0,
//           ProductId: "1",
//         };

//         const payRes = await axios.post(
//           tradeUrl + "AddPayment",
//           payPayload
//         );

//         console.log("💳 ADD PAYMENT RESPONSE:", payRes.data);

//         // 2️⃣ TICKETING (FLIGHT SERVICE)
//         const ticketPayload = {
//           api_c: "a",
//           is_uat: setting.etrav_api_prod_on == 1 ? "no" : "yes",
//           Booking_RefNo: order_id,
//           Ticketing_Type: "1",
//         };

//         const ticketRes = await axios.post(
//           flightUrl + "Air_Ticketing",
//           ticketPayload
//         );

//         console.log("🎫 TICKETING RESPONSE:", ticketRes.data);

//         // 3️⃣ REPRINT (AIRLINE SERVICE)
//         const reprintPayload = {
//           api_c: "a",
//           is_uat: setting.etrav_api_prod_on == 1 ? "no" : "yes",
//           Booking_RefNo: order_id,
//           Airline_PNR: "",
//         };

//         const reprintRes = await axios.post(
//           airlineUrl + "Air_Reprint",
//           reprintPayload
//         );

//         console.log("🖨 REPRINT RESPONSE:", reprintRes.data);

//         const pnr =
//           reprintRes.data?.data?.AirPNRDetails?.[0]?.Airline_PNR || null;

//         // ===============================
//         // ✅ SAVE FINAL BOOKING
//         // ===============================
//         await BookingModel.update(
//           {
//             Ticket_Details: JSON.stringify(reprintRes.data),
//             PNR: pnr,
//             amount_status: "Success",
//             status: "Confirmed",
//             Amount: orderDetails.amount,
//             paying_method:
//               orderDetails.payment_method ||
//               orderDetails.payment_method_type,
//             amount_api_res: JSON.stringify(orderDetails),
//           },
//           { where: { Booking_RefNo: order_id } }
//         );

//         console.log("✅ ETRAV TICKET GENERATED SUCCESSFULLY");
//       } catch (err) {
//         console.log("❌ ETRAV FLOW ERROR:", err.response?.data || err);

//         await BookingModel.update(
//           {
//             amount_status: "Failed",
//             status: "Failed",
//           },
//           { where: { Booking_RefNo: order_id } }
//         );

//         return res.redirect(
//           `http://localhost:5173/#/sucess?status=failed&order_id=${order_id}`
//         );
//       }
//     }

//     return res.redirect(
//       `http://localhost:5173/#/sucess?status=success&order_id=${order_id}`
//     );
//   } catch (error) {
//     console.log("❌ CALLBACK ERROR:", error.response?.data || error);
//     return res.status(500).send("Callback failed");
//   }
// }  

// async function hdfcCallback(req, res) {
//   try {
//     console.log("📩 HDFC CALLBACK BODY:", req.body);

//     const order_id = req.body.order_id;

//     if (!order_id) {
//       return res.status(400).send("Order ID missing");
//     }

//     console.log("🔁 Callback Order ID:", order_id);

//     // ✅ VERIFY PAYMENT
//     const orderDetails = await verifyOrder(order_id);
//     console.log("🔍 HDFC VERIFY RESPONSE:", orderDetails);

//     // ✅ SAVE PAYMENT HISTORY
//     await PaymentHistory.create({
//       user_id: null,
//       txnid: order_id,
//       txnid_for: "Flight Booking",
//       response: JSON.stringify(orderDetails),
//     });

//     // ❌ IF PAYMENT FAILED
//     if (orderDetails.status !== "CHARGED") {
//       await BookingModel.update(
//         {
//           amount_status: "Failed",
//           status: "Failed",
//           amount_api_res: JSON.stringify(orderDetails),
//         },
//         { where: { Booking_RefNo: order_id } }
//       );

//       return res.redirect(
//         `http://localhost:5173/#/sucess?status=failed&order_id=${order_id}`
//       );
//     }

//     console.log("🔥 PAYMENT SUCCESS - STARTING GOFLY BOOKING");

//     // ✅ FIND BOOKING
//     const booking = await BookingModel.findOne({
//       where: { Booking_RefNo: order_id },
//     });

//     if (!booking) {
//       console.log("❌ Booking not found");
//       return res.status(404).send("Booking not found");
//     }

//     // ✅ SAFE PARSE PAYLOAD
//     let payload = null;

//     try {
//       payload =
//         booking.BookingFlightDetails &&
//         booking.BookingFlightDetails !== "undefined"
//           ? JSON.parse(booking.BookingFlightDetails)
//           : null;
//     } catch (err) {
//       console.log("❌ Invalid BookingFlightDetails JSON");
//       return res.status(400).send("Invalid booking payload");
//     }

//     if (!payload) {
//       console.log("❌ Booking payload missing");
//       return res.status(400).send("Booking payload missing");
//     }

//     console.log("📦 GOFLY PAYLOAD:", payload);

//     // ✅ CALL GOFLY BOOKING API
//     const goflyResponse = await axios.post(
//       "http://localhost:4000/api/third_party/" + getSupplierRoute(booking.sit_type),
//       {
//         sit_type: booking.sit_type.toString(),
//         type: "booking",
//         data: JSON.stringify(payload),
//       }
//     );

//     function getSupplierRoute(type) {
//       const map = {
//         1: "etrav",
//         2: "airiq",
//         3: "gflight",
//         4: "wingflight",
//       };
//       return map[type];
//     }

//     const goflyData = goflyResponse.data;
//     console.log("🛫 GOFLY BOOKING RESPONSE:", goflyData);

//     // ❌ BOOKING FAILED
//     if (!goflyData.status || !goflyData.data?.success) {
//       await BookingModel.update(
//         {
//           status: "Failed",
//           amount_status: "Success",
//           amount_api_res: JSON.stringify(orderDetails),
//         },
//         { where: { Booking_RefNo: order_id } }
//       );

//       console.log("❌ GOFLY BOOKING FAILED");
//       return res.redirect(
//         `http://localhost:5173/#/sucess?status=booking_failed&order_id=${order_id}`
//       );
//     }

//     // ✅ BOOKING SUCCESS
//     const supplierData = goflyData.data?._data || {};
//     const bookingReference =
//   supplierData?.booking_reference ||
//   supplierData?.pnr ||
//   supplierData?.reference ||
//   null;
//     console.log("✅ BOOKING SUCCESS - REF:", bookingReference);

//     // ==============================
//     // 🎫 FETCH TICKET DETAILS
//     // ==============================

//     console.log("🎫 FETCHING TICKET DETAILS...");
//     if (!bookingReference) {
//       console.log("❌ Supplier booking reference missing");
//       return res.redirect(
//         `http://localhost:5173/#/sucess?status=booking_failed&order_id=${order_id}`
//       );
//     }
//     const ticketResponse = await axios.get(
//       `https://krn.nexusdmc.com/api/v1/bookings/reference/${bookingReference}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           "api-key":
//             "test_2b2234580819f38a390c903f1665584a595a3736f19d0415",
//         },
//       }

      
//     );

//     const ticketData = ticketResponse.data;

//     console.log("🎟 TICKET RESPONSE:", ticketData);

//     // ==============================
//     // ✅ UPDATE DB WITH FULL TICKET
//     // ==============================

//     await BookingModel.update(
//       {
//         paying_method: "HDFC",
//         amount_status: "Success",
//         status: "Confirmed",
//         PNR: bookingReference,
//         Ticket_Details: JSON.stringify(ticketData),
//         amount_api_res: JSON.stringify(orderDetails),
//       },
//       { where: { Booking_RefNo: order_id } }
//     );

//     console.log("✅ FULL TICKET SAVED TO DB");

//     return res.redirect(
//       `http://localhost:5173/#/sucess?status=success&order_id=${order_id}`
//     );
//   } catch (error) {
//     console.log(
//       "❌ CALLBACK ERROR:",
//       error.response?.data || error.message || error
//     );
//     console.log("TICKET RESPONSE:");
//     return res.status(500).send("Callback failed");
//   }
// }
async function hdfcCallback(req, res) {
  try {
    console.log("📩 HDFC CALLBACK BODY:", req.body);

    const order_id = req.body.order_id;

    if (!order_id) {
      return res.status(400).send("Order ID missing");
    }

    console.log("🔁 Callback Order ID:", order_id);

    // ==============================
    // ✅ VERIFY PAYMENT
    // ==============================

    const orderDetails = await verifyOrder(order_id);
    console.log("🔍 HDFC VERIFY RESPONSE:", orderDetails);

    await PaymentHistory.create({
      user_id: null,
      txnid: order_id,
      txnid_for: "Flight Booking",
      response: JSON.stringify(orderDetails),
    });

    // ❌ PAYMENT FAILED
    if (
      !orderDetails ||
      orderDetails.status !== "CHARGED" ||
      orderDetails.status_id !== 21
    ) {
      await BookingModel.update(
        {
          amount_status: "Failed",
          status: "Failed",
          amount_api_res: JSON.stringify(orderDetails),
        },
        { where: { Booking_RefNo: order_id } }
      );

      return res.redirect(
        `${process.env.FRONTEND_URL}/#/success?status=failed&order_id=${order_id}&amount=${orderDetails.amount}`
      );
    }

    console.log("🔥 PAYMENT SUCCESS - STARTING BOOKING");

    // ==============================
    // ✅ FIND BOOKING
    // ==============================

    const booking = await BookingModel.findOne({
      where: { Booking_RefNo: order_id },
    });

    if (!booking) {
      console.log("❌ Booking not found");
      return res.status(404).send("Booking not found");
    }

    // 🚨 DUPLICATE CALLBACK PROTECTION
    if (booking.status === "Confirmed") {
      console.log("⚠️ Booking already processed");
      return res.sendStatus(200);
    }

    // ==============================
    // ✅ SAFE PARSE PAYLOAD
    // ==============================

    let payload = null;

    try {
      payload =
        booking.BookingFlightDetails &&
        booking.BookingFlightDetails !== "undefined"
          ? JSON.parse(booking.BookingFlightDetails)
          : null;
    } catch (err) {
      console.log("❌ Invalid BookingFlightDetails JSON");
      return res.status(400).send("Invalid booking payload");
    }

    if (!payload) {
      console.log("❌ Booking payload missing");
      return res.status(400).send("Booking payload missing");
    }

    console.log("📦 SUPPLIER PAYLOAD:", payload);

    // ==============================
    // ✅ SUPPLIER ROUTE
    // ==============================

    function getSupplierRoute(type) {
      const map = {
        1: "etrav",
        2: "airiq",
        3: "gflight",
        4: "wingflight",
      };
      return map[type];
    }

    // ==============================
    // ✅ CALL SUPPLIER BOOKING API
    // ==============================

    const supplierUrl = `${process.env.BASE_URL}/api/third_party/${getSupplierRoute(
      booking.sit_type
    )}`;

    let goflyResponse;

    try {
      goflyResponse = await axios.post(supplierUrl, {
        sit_type: booking.sit_type.toString(),
        type: "booking",
        data: JSON.stringify(payload),
      });
    } catch (error) {
      console.log("❌ SUPPLIER API ERROR:", error.response?.data || error.message);

      await BookingModel.update(
        {
          status: "Failed",
          amount_status: "Success",
          amount_api_res: JSON.stringify(orderDetails),
        },
        { where: { Booking_RefNo: order_id } }
      );

      return res.redirect(
        `${process.env.FRONTEND_URL}/#/success?status=booking_failed&order_id=${order_id}&amount=${orderDetails.amount}`
      );
    }

    const goflyData = goflyResponse.data;

    console.log("🛫 SUPPLIER BOOKING RESPONSE:", goflyData);

    // ❌ BOOKING FAILED
    if (!goflyData?.status || !goflyData?.data?.success) {
      await BookingModel.update(
        {
          status: "Failed",
          amount_status: "Success",
          amount_api_res: JSON.stringify(orderDetails),
        },
        { where: { Booking_RefNo: order_id } }
      );

      console.log("❌ SUPPLIER BOOKING FAILED");

      return res.redirect(
        `${process.env.FRONTEND_URL}/#/success?status=booking_failed&order_id=${order_id}&amount=${orderDetails.amount}`
        );
    }

    // ==============================
    // ✅ BOOKING SUCCESS
    // ==============================

    const supplierData = goflyData.data?._data || {};

    const bookingReference =
      supplierData?.booking_reference ||
      supplierData?.pnr ||
      supplierData?.reference ||
      null;

    console.log("✅ BOOKING SUCCESS - REF:", bookingReference);

    if (!bookingReference) {
      console.log("❌ Supplier booking reference missing");

      return res.redirect(
        `${process.env.FRONTEND_URL}/#/success?status=booking_failed&order_id=${order_id}&amount=${orderDetails.amount}`
        );
    }

    // ==============================
    // 🎫 FETCH TICKET DETAILS
    // ==============================

    console.log("🎫 FETCHING TICKET DETAILS...");

    let ticketData = null;

    try {
      const ticketResponse = await axios.get(
        `https://krn.nexusdmc.com/api/v1/bookings/reference/${bookingReference}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "api-key": process.env.GOFLY_API_KEY,
          },
        }
      );

      ticketData = ticketResponse.data;

      console.log("🎟 TICKET RESPONSE:", ticketData);
    } catch (err) {
      console.log("⚠️ Ticket fetch failed, continuing...");
    }

    // ==============================
    // ✅ UPDATE BOOKING
    // ==============================

    await BookingModel.update(
      {
        paying_method: "HDFC",
        amount_status: "Success",
        status: "Confirmed",
        PNR: bookingReference,
        Ticket_Details: ticketData ? JSON.stringify(ticketData) : null,
        amount_api_res: JSON.stringify(orderDetails),
      },
      { where: { Booking_RefNo: order_id } }
    );

    console.log("✅ BOOKING SAVED SUCCESSFULLY");

    return res.redirect(
      `${process.env.FRONTEND_URL}/#/success?status=success&order_id=${order_id}&amount=${orderDetails.amount}`
      );
  } catch (error) {
    console.log(
      "❌ CALLBACK ERROR:",
      error.response?.data || error.message || error
    );

    return res.status(500).send("Callback failed");
  }
}


async function fetch(req, res) {
  const data = await SettingModel.findOne({ where: { id: "1" } });

  let authToken = "";
  let apikey = "";

  let dataparams = JSON.parse(req.body.data);
  if (dataparams.api_c === "a" && dataparams.is_uat === "yes") {
    delete dataparams["api_c"];
    delete dataparams["is_uat"];
    dataparams["Auth_Header"] = {
      UserId: data.etrav_api_uat_username,
      Password: data.etrav_api_uat_password,
      IP_Address: "0000000000000",
      Request_Id: "5500887959052",
      IMEI_Number: "2232323232323",
    };
  } else if (dataparams.api_c === "a" && dataparams.is_uat === "no") {
    delete dataparams["api_c"];
    delete dataparams["is_uat"];
    dataparams["Auth_Header"] = {
      UserId: data.etrav_api_prod_username,
      Password: data.etrav_api_prod_password,
      IP_Address: "0000000000000",
      Request_Id: "5500887959052",
      IMEI_Number: "2232323232323",
    };
  } else if (dataparams.api_c === "b" && dataparams.is_uat === "no") {
    delete dataparams["api_c"];
    delete dataparams["is_uat"];
    apikey =
      "MTEzMjY3NTA6Vml2YW4gVHJhdmVscyBBbmQgVG91cmlzbToxNzcyMDQ2NjA3MTIyOlZsQitPNWNVSzdKWm1uMGdaN2tLMCt0NDJySEJKNXNYcVJlUGpQQ0tDU1E9";

    authToken = await token(
      data.airiq_api_prod_username,
      data.airiq_api_prod_password,
      apikey
    );
  } else if (dataparams.api_c === "b" && dataparams.is_uat === "yes") {
    delete dataparams["api_c"];
    delete dataparams["is_uat"];
    apikey =
      "NTMzNDUwMDpBSVJJUSBURVNUIEFQSToxODkxOTMwMDM1OTk2OmpTMm0vUU1HVmQvelovZi81dFdwTEE9PQ==";

    authToken = await token(
      data.airiq_api_uat_username,
      data.airiq_api_uat_password,
      apikey
    );
  }
  // console.log(dataparams);
  axios({
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: authToken,
      "api-key": apikey,
    },
    url: req.body.url,
    data: JSON.stringify(dataparams),
  })
    .then(function (response) {
      // console.log(response);
      return res.status(200).send({
        status: true,
        message: "Data get successfully",
        data: response.data,
      });
    })
    .catch(function (error) {
      // console.log(error);
      return res.status(403).send({ status: false, message: error });
    });
}

async function fetch_get(req, res) {
  const data = await SettingModel.findOne({ where: { id: "1" } });

  let dataparams = JSON.parse(req.body.data);
  let authToken = "";
  let apikey = "";

  if (dataparams.api_c === "b" && dataparams.is_uat === "no") {
    apikey =
      "MTEzMjY3NTA6Vml2YW4gVHJhdmVscyBBbmQgVG91cmlzbToxNzcyMDQ2NjA3MTIyOlZsQitPNWNVSzdKWm1uMGdaN2tLMCt0NDJySEJKNXNYcVJlUGpQQ0tDU1E9";
    authToken = await token(
      data.airiq_api_prod_username,
      data.airiq_api_prod_password,
      apikey
    );
  } else if (dataparams.api_c === "b" && dataparams.is_uat === "yes") {
    apikey =
      "NTMzNDUwMDpBSVJJUSBURVNUIEFQSToxODkxOTMwMDM1OTk2OmpTMm0vUU1HVmQvelovZi81dFdwTEE9PQ==";
    authToken = await token(
      data.airiq_api_uat_username,
      data.airiq_api_uat_password,
      apikey
    );
  }

  axios({
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: authToken,
      "api-key": apikey,
    },
    url: req.body.url,
  })
    .then(function (response) {
      return res.status(200).send({
        status: true,
        message: "Data get successfully",
        data: response.data,
      });
    })
    .catch(function (error) {
      // return res
      //   // .status(403)
      //   .send({ status: false, message: error, other: authToken });
    });
}

async function razorpayCapture(req, res) {
  try {
    // Parse the incoming request data
    const { payment_id, amount, currency, type } = req.body;
    let keyId;
    let keySecret;
    if (type) {
      keyId = "rzp_live_sYbcyWNMUmSsFz";
      keySecret = "kzeAwo3cueCj0yin7uCQrDs4";
    } else {
      keyId = "rzp_test_Cdw8jmV9l9R9vG";
      keySecret = "gOICCEVYAAKZUtbd8opihiSw";
    }

    // Construct the Razorpay auth token
    const authToken = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    // Perform the capture API call
    const response = await axios({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${authToken}`,
      },
      url: `https://api.razorpay.com/v1/payments/${payment_id}/capture`,
      data: {
        amount: amount, // Amount in smallest currency unit (e.g., paise for INR)
        currency: currency || "INR",
      },
    });

    // Send success response
    return res.status(200).send({
      status: true,
      message: "Payment captured successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error capturing payment:", error.response?.data || error);

    // Send error response
    return res.status(500).send({
      status: false,
      message: "Failed to capture payment",
      error: error.response?.data || error.message,
    });
  }
}

function generateHash(data) {
  const testkey = "DBAVAJTTK";
  const testsalt = "DBQJX94L8";

  const livekey = "QW7O6D05EV";
  const livesalt = "OTE1W11IXZ";

  const udfFields = Array.from(
    { length: 10 },
    (_, i) => data[`udf${i + 1}`] || ""
  );

  // Construct hash string with sanitized values
  let hashstring = `${livekey}|${data.txnid}|${data.amount}|${
    data.productinfo
  }|${data.firstname}|${data.email}|${udfFields.join("|")}|${livesalt}`;
  let hash = sha512.sha512(hashstring);
  return hash;
}

async function payment(req, res) {
  try {
    const axios = require("axios").default;
    const { URLSearchParams } = require("url");
    const hash = generateHash(req.body);

    try {
      const livekey = "QW7O6D05EV";

      // const testkey = "DBAVAJTTK";
      // const testurl = "https://testpay.easebuzz.in/";
      const liveurl = "https://pay.easebuzz.in/";
      const hash = generateHash(req.body);

      // Convert JSON to form-urlencoded format
      const liveownurl = "https://api.vivantravels.com/sucess";
      // const localownurl = "http://192.168.31.138:1028/sucess";
      const formData = qs.stringify({
        key: livekey,
        txnid: req.body.txnid,
        amount: req.body.amount,
        productinfo: req.body.productinfo,
        firstname: req.body.firstname,
        phone: req.body.phone,
        email: req.body.email,
        udf1: req.body.udf1,
        udf2: req.body.udf2,
        surl: liveownurl,
        furl: liveownurl,
        hash: hash,
      });

      // Make the POST request with form data
      const response = await axios.post(
        `${liveurl}payment/initiateLink`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
        }
      );
      return res.status(200).send({
        status: true,
        message: "Payment successfully",
        data: response.data,
        url: `${liveurl}/pay/`,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        status: false,
        message: "Failed to payment",
        error: error.response?.data || error.message,
      });
    }

    // Send success response
  } catch (error) {
    console.error("Error capturing payment:", error.response?.data || error);

    // Send error response
    return res.status(500).send({
      status: false,
      message: "Failed to capture payment",
      error: error.response?.data || error.message,
    });
  }
}

async function search(req, res) {
  const data = await SettingModel.findOne({ where: { id: "1" } });
  const agent = await Agent.findOne({ where: { user_id: req.user.id } });
  const apicharges =
    agent && agent.flight_charges ? JSON.parse(agent.flight_charges) : {};
  const userapicharges =
    data && data.flight_charges ? JSON.parse(data.flight_charges) : {};
  // console.log(`hi user id is ${req.user.id}`)
  let dataparams = JSON.parse(req.body.data);
  let authToken = "";
  let apikey = "";
  let etravparams = dataparams;
  if (data.etrav_api_prod_on === 1) {
    etravparams["Auth_Header"] = {
      UserId: data.etrav_api_prod_username,
      Password: data.etrav_api_prod_password,
      IP_Address: "0000000000000",
      Request_Id: "5500887959052",
      IMEI_Number: "2232323232323",
    };
  } else {
    etravparams["Auth_Header"] = {
      UserId: data.etrav_api_uat_username,
      Password: data.etrav_api_uat_password,
      IP_Address: "0000000000000",
      Request_Id: "5500887959052",
      IMEI_Number: "2232323232323",
    };
  }
  const etravurl = `${
    data.etrav_api_prod_on === 1
      ? data.etrav_api_uat_url + "/flight/AirAPIService.svc/JSONService/"
      : data.etrav_api_prod_url + "/airlinehost/AirAPIService.svc/JSONService/"
  }Air_Search`;
  // // console.log(etravurl);
  // let etravdata = [];
  let response1 = {};
  try {
    await axios({
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      url: etravurl,
      data: JSON.stringify(etravparams),
    })
      .then(function (response) {
        // return res.status(200).send({
        //   status: true,
        //   message: "Data get successfully",
        //   data: response.data,
        //   params: etravparams,
        //   etravurl,
        // });
        // etravdata = response.data;
        response1 = response.data;
      })
      .catch(function (error) {
        // return res
        //   // .status(403)
        //   .send({ status: false, message: error, other: authToken });
      });
  } catch (error) {}
  // air iq
  if (data.airiq_api_prod_on === 1) {
    apikey =
      "MTEzMjY3NTA6Vml2YW4gVHJhdmVscyBBbmQgVG91cmlzbToxNzcyMDQ2NjA3MTIyOlZsQitPNWNVSzdKWm1uMGdaN2tLMCt0NDJySEJKNXNYcVJlUGpQQ0tDU1E9";
    authToken = await token(
      data.airiq_api_prod_username,
      data.airiq_api_prod_password,
      apikey
    );
  } else {
    apikey =
      "NTMzNDUwMDpBSVJJUSBURVNUIEFQSToxODkxOTMwMDM1OTk2OmpTMm0vUU1HVmQvelovZi81dFdwTEE9PQ==";

    authToken = await token(
      data.airiq_api_uat_username,
      data.airiq_api_uat_password,
      apikey
    );
  }
  let airiqlist = [];
  let response2 = {};
  // console.log({
  //   data: JSON.stringify({
  //     origin: dataparams.TripInfo[0].Origin,
  //     destination: dataparams.TripInfo[0].Destination,
  //     departure_date: dataparams.TripInfo[0].TravelDate,
  //     adult: dataparams.Adult_Count,
  //     child: dataparams.Child_Count,
  //     infant: dataparams.Infant_Count,
  //     airline_code: "",
  //   }),
  //   authToken:authToken,
  // apikey:apikey});
  try {
    if (authToken != "") {
      await axios({
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: authToken,
          "api-key": apikey,
        },
        url: "https://omairiq.azurewebsites.net/search",
        data: JSON.stringify({
          origin: dataparams.TripInfo[0].Origin,
          destination: dataparams.TripInfo[0].Destination,
          departure_date: dataparams.TripInfo[0].TravelDate,
          adult: dataparams.Adult_Count,
          child: dataparams.Child_Count,
          infant: dataparams.Infant_Count,
          airline_code: "",
        }),
      })
        .then(function (response) {
          // console.log(response.data)
          // return res.status(200).send({
          //   status: true,
          //   message: "Data get successfully",
          //   data: response.data,
          // });
          if (response.data.message == "Search successfully") {
            airiqlist = response.data.data;
            response2 = response.data;
          }
        })
        .catch(function (error) {
          // return res
          //   .status(403)
          //   .send({ status: false, message: error, other: authToken });
        });
    }
  } catch (error) {}
  // Function to calculate duration between two date/times
  // offlines tickets
  const totalCount =
    dataparams.Adult_Count + dataparams.Child_Count + dataparams.Infant_Count;
  const fullDateTime = new Date(dataparams.datetime); // Full datetime like 2025-06-09T11:00:00

  const travelDate = new Date(dataparams.TripInfo[0].TravelDate);
  const now = new Date();
  // Check if travelDate is today
  const isToday =
    travelDate.getDate() === now.getDate() &&
    travelDate.getMonth() === now.getMonth() &&
    travelDate.getFullYear() === now.getFullYear();

  let finalTravelDate;

  if (isToday) {
    // Set travelDate's hours and minutes to now, then add 30 mins
    travelDate.setHours(now.getHours());
    travelDate.setMinutes(now.getMinutes());
    travelDate.setSeconds(0); // optional, for consistency
    finalTravelDate = new Date(travelDate.getTime() + 30 * 60000);
  } else {
    finalTravelDate = travelDate; // keep original
  }
  const travelDateStr = fullDateTime.toISOString().slice(0, 10); // 'YYYY-MM-DD'

  const offlineticketlist = await OfflineTicketModel.findAll({
    where: {
      status: "Active",
      seat: {
        [Op.gte]: totalCount,
      },
      departure_time: {
        [Op.gte]: fullDateTime, // ensures it's not before full datetime
      },
      [Op.and]: [
        where(fn("DATE", col("departure_time")), travelDateStr), // match exact date
      ],
    },
    include: [
      {
        model: AirlineModel,
        as: "airline_details",
        attributes: ["id", "name", "code"],
      },
      {
        model: CountryModel,
        as: "to_airline",
        attributes: ["id", "country_code", "alpha_2"],
        where: { alpha_2: dataparams.TripInfo[0].Destination },
      },
      {
        model: CountryModel,
        as: "from_airline",
        attributes: ["id", "country_code", "alpha_2"],
        where: { alpha_2: dataparams.TripInfo[0].Origin },
      },
    ],
  });

  // return res.status(200).send({
  //   status: true,
  //   message: "Data get successfully",
  //   ss: offlineticketlist,
  // });

  // Gofly
  let goflyres = {};
  try {
    await axios({
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key":
           "test_2b2234580819f38a390c903f1665584a595a3736f19d0415",
          // "live_2b2234580819f38a8cc3f03c79bc4050167b550dede3466f",
      },
      // for live envirement
      // url: `https://api.nexusdmc.com/api/v1/flights/series-search?segment=${
        /// for test envirment
        url: `https://krn.nexusdmc.com/api/v1/flights/series-search?segment=${

        dataparams.TripInfo[0].Origin
      }-${dataparams.TripInfo[0].Destination}-${
        dataparams.TripInfo[0].TravelDate.split("/")[2]
      }${dataparams.TripInfo[0].TravelDate.split("/")[0]}${
        dataparams.TripInfo[0].TravelDate.split("/")[1]
      }&pax=${dataparams.Adult_Count}-${dataparams.Child_Count}-${
        dataparams.Infant_Count
      }`,
    })
      .then(function (response) {
        console.log(response);
        // return res.status(200).send({
        //   status: true,
        //   message: "Data get successfully",
        //   data: response,
        // });
        if (response.data.success) {
          goflyres = response.data["_data"];
        }
        console.log("GOFLY RAW RESPONSE:", response.data["_data"]);
      })
      .catch(function (error) {
        // return res
        //   .status(403)
        //   .send({ status: false, message: error, other: authToken });
      });
  } catch (error) {}

  // Winfly
  let winflyres = {};
  let booking_token_id = "";
  try {
    const dataforwinfly = `${dataparams.TripInfo[0].TravelDate.split("/")[2]}-${
      dataparams.TripInfo[0].TravelDate.split("/")[0]
    }-${dataparams.TripInfo[0].TravelDate.split("/")[1]}`;
    await axios({
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // url: "https://devapi.flightapi.co.in/v1/fbapi/search",
      url: "https://api.fareboutique.in/v1/fbapi/search",

      data: JSON.stringify({
        trip_type: 0,
        // end_user_ip: "183.83.43.117",
        // token: "4-2-3721-KRAZY-389-xnewkncBUI8",
        end_user_ip: "89.116.34.212",
        token: "316-597-VIVAAN9809nuewhbnkcuewIYnj",
        dep_city_code: dataparams.TripInfo[0].Origin,
        arr_city_code: dataparams.TripInfo[0].Destination,
        onward_date: dataforwinfly,
        return_date: "",
        adult: dataparams.Adult_Count,
        children: dataparams.Child_Count,
        infant: dataparams.Infant_Count,
      }),
    })
      .then(function (response) {
        // console.log(
        //   JSON.stringify({
        //     payload: {
        //       trip_type: 0,
        //       end_user_ip: "183.83.43.117",
        //       token: "4-2-3721-KRAZY-389-xnewkncBUI8",
        //       // end_user_ip: "89.116.34.212",
        //       // token: "316-597-VIVAAN9809nuewhbnkcuewIYnj",
        //       dep_city_code: dataparams.TripInfo[0].Origin,
        //       arr_city_code: dataparams.TripInfo[0].Destination,
        //       onward_date: dataforwinfly,
        //       return_date: "",
        //       adult: dataparams.Adult_Count,
        //       children: dataparams.Child_Count,
        //       infant: dataparams.Infant_Count,
        //     },

        //     res: response.data,
        //   })
        // );
        // return res.status(200).send({
        //   status: true,
        //   message: "Data get successfully",
        //   data: response.data["_data"],
        // });
        if (response.data.errorCode == 0) {
          winflyres = response.data["data"];
          booking_token_id = response.data["booking_token_id"];
        }
      })
      .catch(function (error) {
        console.log(error);
        // return res
        //   .status(403)
        //   .send({ status: false, message: error, other: authToken });
      });
  } catch (error) {}

  // Merge the two responses

  // Execute the merge
  const flights1 = processResponse1(
    response1,
    dataparams,
    apicharges,
    userapicharges
  );
  const flights2 = processResponse2(
    response2,
    dataparams,
    apicharges,
    userapicharges
  );
  const flights_gofly = processgofly(
    goflyres,
    dataparams,
    apicharges,
    userapicharges
  );
  const formattedOfflineData = offlineProcess(
    offlineticketlist,
    dataparams,
    "OFF001",
    apicharges,
    userapicharges
  );

  const flights_winfly = processResponse4(
    winflyres,
    dataparams,
    booking_token_id,
    apicharges,
    userapicharges
  );


  
  const mergedFlights = [
    ...flights1,
    ...flights2,
    ...formattedOfflineData,
    ...flights_gofly,
    ...flights_winfly,
  ];

  console.log("====================================");
  console.log("SUPPLIER RESULT COUNT:");
  console.log("ETRAV (sit_type 1):", flights1.length);
  console.log("AIRIQ (sit_type 2):", flights2.length);
  console.log("GOFLY (sit_type 3):", flights_gofly.length);
  console.log("WINGFLY (sit_type 4):", flights_winfly.length);
  console.log("OFFLINE (sit_type 5):", formattedOfflineData.length);
  console.log("TOTAL MERGED:", mergedFlights.length);
  console.log("====================================");


  return res.status(200).send({
    status: true,
    message: "sucess",
    // gofly: goflyres,
    data: mergedFlights,
  });
}

// etrav search
async function search1(req, res) {
  const data = await SettingModel.findOne({ where: { id: "1" } });
  const agent = await Agent.findOne({ where: { user_id: req.user.id } });
  const apicharges =
    agent && agent.flight_charges ? JSON.parse(agent.flight_charges) : {};
  const userapicharges =
    data && data.flight_charges ? JSON.parse(data.flight_charges) : {};
  // console.log(`hi user id is ${req.user.id}`)
  let dataparams = JSON.parse(req.body.data);
  let etravparams = dataparams;
  if (data.etrav_api_prod_on === 1) {
    etravparams["Auth_Header"] = {
      UserId: data.etrav_api_prod_username,
      Password: data.etrav_api_prod_password,
      IP_Address: "0000000000000",
      Request_Id: "5500887959052",
      IMEI_Number: "2232323232323",
    };
  } else {
    etravparams["Auth_Header"] = {
      UserId: data.etrav_api_uat_username,
      Password: data.etrav_api_uat_password,
      IP_Address: "0000000000000",
      Request_Id: "5500887959052",
      IMEI_Number: "2232323232323",
    };
  }
  const etravurl = `${
    data.etrav_api_prod_on === 1
      ? data.etrav_api_uat_url + "/flight/AirAPIService.svc/JSONService/"
      : data.etrav_api_prod_url + "/airlinehost/AirAPIService.svc/JSONService/"
  }Air_Search`;

  let response1 = {};
  try {
    await axios({
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      url: etravurl,
      data: JSON.stringify(etravparams),
    })
      .then(function (response) {
        response1 = response.data;
      })
      .catch(function (error) {
        // return res
        //   .status(403)
        //   .send({ status: false, message: error, other: authToken });
      });
  } catch (error) {
    // return res
    //   .status(403)
    //   .send({ status: false, message: error, other: authToken });
  }
  const flights1 = processResponse1(
    response1,
    dataparams,
    apicharges,
    userapicharges
  );
  return res.status(200).send({
    status: true,
    message: "sucess",
    data: flights1,
  });
}

// airiq search
async function search2(req, res) {
  const data = await SettingModel.findOne({ where: { id: "1" } });
  const agent = await Agent.findOne({ where: { user_id: req.user.id } });
  const apicharges =
    agent && agent.flight_charges ? JSON.parse(agent.flight_charges) : {};
  const userapicharges =
    data && data.flight_charges ? JSON.parse(data.flight_charges) : {};
  // console.log(`hi user id is ${req.user.id}`)
  let dataparams = JSON.parse(req.body.data);
  let authToken = "";
  let apikey = "";
  // air iq
  if (data.airiq_api_prod_on === 1) {
    apikey =
      "MTEzMjY3NTA6Vml2YW4gVHJhdmVscyBBbmQgVG91cmlzbToxNzcyMDQ2NjA3MTIyOlZsQitPNWNVSzdKWm1uMGdaN2tLMCt0NDJySEJKNXNYcVJlUGpQQ0tDU1E9";
    authToken = await token(
      data.airiq_api_prod_username,
      data.airiq_api_prod_password,
      apikey
    );
  } else {
    apikey =
      "NTMzNDUwMDpBSVJJUSBURVNUIEFQSToxODkxOTMwMDM1OTk2OmpTMm0vUU1HVmQvelovZi81dFdwTEE9PQ==";

    authToken = await token(
      data.airiq_api_uat_username,
      data.airiq_api_uat_password,
      apikey
    );
  }
  let response2 = {};
  // console.log({
  //   data: JSON.stringify({
  //     origin: dataparams.TripInfo[0].Origin,
  //     destination: dataparams.TripInfo[0].Destination,
  //     departure_date: dataparams.TripInfo[0].TravelDate,
  //     adult: dataparams.Adult_Count,
  //     child: dataparams.Child_Count,
  //     infant: dataparams.Infant_Count,
  //     airline_code: "",
  //   }),
  //   authToken:authToken,
  // apikey:apikey});
  try {
    if (authToken != "") {
      await axios({
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: authToken,
          "api-key": apikey,
        },
        url: "https://omairiq.azurewebsites.net/search",
        data: JSON.stringify({
          origin: dataparams.TripInfo[0].Origin,
          destination: dataparams.TripInfo[0].Destination,
          departure_date: dataparams.TripInfo[0].TravelDate,
          adult: dataparams.Adult_Count,
          child: dataparams.Child_Count,
          infant: dataparams.Infant_Count,
          airline_code: "",
        }),
      })
        .then(function (response) {
          if (response.data.message == "Search successfully") {
            airiqlist = response.data.data;
            response2 = response.data;
          }
        })
        .catch(function (error) {
          // return res
          //   .status(403)
          //   .send({ status: false, message: error, other: authToken });
        });
    }
  } catch (error) {}
  const flights2 = processResponse2(
    response2,
    dataparams,
    apicharges,
    userapicharges
  );
  return res.status(200).send({
    status: true,
    message: "sucess",
    data: flights2,
  });
}

async function search3(req, res) {
  const data = await SettingModel.findOne({ where: { id: "1" } });
  const agent = await Agent.findOne({ where: { user_id: req.user.id } });
  const apicharges =
    agent && agent.flight_charges ? JSON.parse(agent.flight_charges) : {};
  const userapicharges =
    data && data.flight_charges ? JSON.parse(data.flight_charges) : {};
  // console.log(`hi user id is ${req.user.id}`)
  let dataparams = JSON.parse(req.body.data);

  // Gofly
  let goflyres = {};
  try {
    await axios({
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key":
          //  "test_2b2234580819f38a390c903f1665584a595a3736f19d0415",
          "live_2b2234580819f38a8cc3f03c79bc4050167b550dede3466f",
      },
      // for live envirement
      // url: `https://api.nexusdmc.com/api/v1/flights/series-search?segment=${
        /// for test envirment
        url: `https://krn.nexusdmc.com/api/v1/flights/series-search?segment=${

        dataparams.TripInfo[0].Origin
      }-${dataparams.TripInfo[0].Destination}-${
        dataparams.TripInfo[0].TravelDate.split("/")[2]
      }${dataparams.TripInfo[0].TravelDate.split("/")[0]}${
        dataparams.TripInfo[0].TravelDate.split("/")[1]
      }&pax=${dataparams.Adult_Count}-${dataparams.Child_Count}-${
        dataparams.Infant_Count
      }`,
    })
      .then(function (response) {
        // console.log(response.data);
        // return res.status(200).send({
        //   status: true,
        //   message: "Data get successfully",
        //   data: response,
        // });
        if (response.data.success) {
          goflyres = response.data["_data"];
        }
      })
      .catch(function (error) {
        // return res
        //   .status(403)
        //   .send({ status: false, message: error, other: authToken });
      });
  } catch (error) {}

  const flights_gofly = processgofly(
    goflyres,
    dataparams,
    apicharges,
    userapicharges
  );
  return res.status(200).send({
    status: true,
    message: "sucess",
    // gofly: goflyres,
    data: flights_gofly,
  });
}

async function search4(req, res) {
  const data = await SettingModel.findOne({ where: { id: "1" } });
  const agent = await Agent.findOne({ where: { user_id: req.user.id } });
  const apicharges =
    agent && agent.flight_charges ? JSON.parse(agent.flight_charges) : {};
  const userapicharges =
    data && data.flight_charges ? JSON.parse(data.flight_charges) : {};
  // console.log(`hi user id is ${req.user.id}`)
  let dataparams = JSON.parse(req.body.data);

  // Winfly
  let winflyres = {};
  let booking_token_id = "";
  try {
    const dataforwinfly = `${dataparams.TripInfo[0].TravelDate.split("/")[2]}-${
      dataparams.TripInfo[0].TravelDate.split("/")[0]
    }-${dataparams.TripInfo[0].TravelDate.split("/")[1]}`;
    await axios({
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // url: "https://devapi.flightapi.co.in/v1/fbapi/search",
      url: "https://api.fareboutique.in/v1/fbapi/search",

      data: JSON.stringify({
        trip_type: 0,
        // end_user_ip: "183.83.43.117",
        // token: "4-2-3721-KRAZY-389-xnewkncBUI8",
        end_user_ip: "89.116.34.212",
        token: "316-597-VIVAAN9809nuewhbnkcuewIYnj",
        dep_city_code: dataparams.TripInfo[0].Origin,
        arr_city_code: dataparams.TripInfo[0].Destination,
        onward_date: dataforwinfly,
        return_date: "",
        adult: dataparams.Adult_Count,
        children: dataparams.Child_Count,
        infant: dataparams.Infant_Count,
      }),
    })
      .then(function (response) {
        // console.log(response.data);
        // console.log(
        //   JSON.stringify({
        //     payload: {
        //       trip_type: 0,
        //       end_user_ip: "183.83.43.117",
        //       token: "4-2-3721-KRAZY-389-xnewkncBUI8",
        //       // end_user_ip: "89.116.34.212",
        //       // token: "316-597-VIVAAN9809nuewhbnkcuewIYnj",
        //       dep_city_code: dataparams.TripInfo[0].Origin,
        //       arr_city_code: dataparams.TripInfo[0].Destination,
        //       onward_date: dataforwinfly,
        //       return_date: "",
        //       adult: dataparams.Adult_Count,
        //       children: dataparams.Child_Count,
        //       infant: dataparams.Infant_Count,
        //     },

        //     res: response.data,
        //   })
        // );
        // return res.status(200).send({
        //   status: true,
        //   message: "Data get successfully",
        //   data: response.data["_data"],
        // });
        if (response.data.errorCode == 0) {
          winflyres = response.data["data"];
          booking_token_id = response.data["booking_token_id"];
        }
      })
      .catch(function (error) {
        console.log(error);
        // return res
        //   .status(403)
        //   .send({ status: false, message: error, other: authToken });
      });
  } catch (error) {}

  const flights_winfly = processResponse4(
    winflyres,
    dataparams,
    booking_token_id,
    apicharges,
    userapicharges
  );
  return res.status(200).send({
    status: true,
    message: "sucess",
    // gofly: goflyres,
    data: flights_winfly,
  });
}
async function search5(req, res) {
  const data = await SettingModel.findOne({ where: { id: "1" } });
  const agent = await Agent.findOne({ where: { user_id: req.user.id } });
  const apicharges =
    agent && agent.flight_charges ? JSON.parse(agent.flight_charges) : {};
  const userapicharges =
    data && data.flight_charges ? JSON.parse(data.flight_charges) : {};
  // console.log(`hi user id is ${req.user.id}`)
  let dataparams = JSON.parse(req.body.data);

  // offlines tickets
  const totalCount =
    dataparams.Adult_Count + dataparams.Child_Count + dataparams.Infant_Count;
  const fullDateTime = new Date(dataparams.datetime); // Full datetime like 2025-06-09T11:00:00

  const travelDate = new Date(dataparams.TripInfo[0].TravelDate);
  const now = new Date();
  // Check if travelDate is today
  const isToday =
    travelDate.getDate() === now.getDate() &&
    travelDate.getMonth() === now.getMonth() &&
    travelDate.getFullYear() === now.getFullYear();

  let finalTravelDate;

  if (isToday) {
    // Set travelDate's hours and minutes to now, then add 30 mins
    travelDate.setHours(now.getHours());
    travelDate.setMinutes(now.getMinutes());
    travelDate.setSeconds(0); // optional, for consistency
    finalTravelDate = new Date(travelDate.getTime() + 30 * 60000);
  } else {
    finalTravelDate = travelDate; // keep original
  }
  const travelDateStr = fullDateTime.toISOString().slice(0, 10); // 'YYYY-MM-DD'

  const offlineticketlist = await OfflineTicketModel.findAll({
    where: {
      status: "Active",
      seat: {
        [Op.gte]: totalCount,
      },
      departure_time: {
        [Op.gte]: fullDateTime, // ensures it's not before full datetime
      },
      [Op.and]: [
        where(fn("DATE", col("departure_time")), travelDateStr), // match exact date
      ],
    },
    include: [
      {
        model: AirlineModel,
        as: "airline_details",
        attributes: ["id", "name", "code"],
      },
      {
        model: CountryModel,
        as: "to_airline",
        attributes: ["id", "country_code", "alpha_2"],
        where: { alpha_2: dataparams.TripInfo[0].Destination },
      },
      {
        model: CountryModel,
        as: "from_airline",
        attributes: ["id", "country_code", "alpha_2"],
        where: { alpha_2: dataparams.TripInfo[0].Origin },
      },
    ],
  });

  const formattedOfflineData = offlineProcess(
    offlineticketlist,
    dataparams,
    "OFF001",
    apicharges,
    userapicharges
  );

  return res.status(200).send({
    status: true,
    message: "sucess",
    // gofly: goflyres,
    data: formattedOfflineData,
  });
}
function calculateDuration(start, end, type) {
  let startTime, endTime;

  if (type === 1) {
    startTime = moment(start, "MM/DD/YYYY HH:mm");
    endTime = moment(end, "MM/DD/YYYY HH:mm");
  } else if (type === 4) {
    startTime = moment(start, "YYYY-MM-DD HH:mm");
    endTime = moment(end, "YYYY-MM-DD HH:mm");
  } else if (type === 5) {
    // ISO format (e.g. 2025-06-08T07:29:00.000Z)
    startTime = moment(start); // auto-parse ISO string
    endTime = moment(end);
  } else {
    // default to "YYYY/MM/DD HH:mm"
    startTime = moment(start, "YYYY/MM/DD HH:mm");
    endTime = moment(end, "YYYY/MM/DD HH:mm");
  }

  const diff = moment.duration(endTime.diff(startTime));
  const hours = Math.floor(diff.asHours()).toString().padStart(2, "0");
  const minutes = diff.minutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}
function processResponse1(data, dataparams, apicharges, userapicharges) {
  const flights = [];
  // const tripDetails =  [];
  const tripDetails = data.TripDetails || [];

  tripDetails.forEach((trip) => {
    trip.Flights.forEach((flight) => {
      const segments = flight.Segments.map((segment) => ({
        origin: segment.Origin,
        destination: segment.Destination,
        flight_number: `${segment.Airline_Code} ${segment.Flight_Number}`,
        departure_datetime: segment.Departure_DateTime,
        arrival_datetime: segment.Arrival_DateTime,
        duration: segment.Duration,
      }));

      flight.Fares.forEach((fare) => {
        try {
          const fareDetails = fare.FareDetails[0];
          const flightData = {
            origin: flight.Origin,
            destination: flight.Destination,
            Airline_Code: flight.Airline_Code,
            flight_numbers: segments.map((s) =>
              s.flight_number.replace(/\s+/g, " ").trim()
            ),
            departure_datetime: segments[0].departure_datetime,
            arrival_datetime: segments[segments.length - 1].arrival_datetime,
            duration: calculateDuration(
              segments[0].departure_datetime,
              segments[segments.length - 1].arrival_datetime,
              1
            ),
            price: calculateFareDetails(
              fare,
              // dataparams.charges.m_c,
              {
                adult: dataparams.Adult_Count,
                child: dataparams.Child_Count,
                infant: dataparams.Infant_Count,
              },
              apicharges["1"] ?? 0,
              userapicharges["1"] ?? 0
            ),
            fare_type: fareDetails.FareClasses[0]?.Class_Desc || null,
            baggage: {
              Check_In_Baggage: fareDetails.Free_Baggage.Check_In_Baggage,
              Hand_Baggage: fareDetails.Free_Baggage.Hand_Baggage,
            },
            refundable: fare.Refundable || null,
            seats_available: parseInt(fare.Seats_Available) || null,
            segments: segments,
            stopovers: segments.length - 1,
            other: flight,
            other_fare: fare,
            searchkey: data.Search_Key,
            sit_type: 1,
          };
          flights.push(flightData);
        } catch (error) {}
      });
    });
  });

  return flights;
}

// Function to process single-segment flights from response2
function processResponse2(data, dataparams, apicharges, userapicharges) {
  const flights = [];
  const flightData = data.data || [];
  flightData.forEach((flight) => {
    const departureDatetime = `${flight.departure_date} ${flight.departure_time}`;
    const arrivalDatetime = `${flight.arival_date} ${flight.arival_time}`;
    // console.log(`${departureDatetime}   ${arrivalDatetime}`);
    const segment = {
      origin: flight.origin,
      destination: flight.destination,
      flight_number: flight.flight_number,
      departure_datetime: departureDatetime,
      arrival_datetime: arrivalDatetime,
      duration: calculateDuration(departureDatetime, arrivalDatetime, 2),
    };
    const paxTypes =
      Number(dataparams.Adult_Count || 0) + Number(dataparams.Child_Count || 0);
    const flightData = {
      origin: flight.origin,
      destination: flight.destination,
      airline: flight.airline,
      flight_numbers: [flight.flight_number],
      departure_datetime: departureDatetime,
      arrival_datetime: arrivalDatetime,
      duration: calculateDuration(departureDatetime, arrivalDatetime, 2),
      price: {
        isisnetfare:
          (Number(flight.price) + Number(apicharges["2"] || 0)) * paxTypes +
          (Number(flight.infant_price) + Number(apicharges["2"] || 0)) *
            Number(dataparams.Infant_Count || 0),
        Without_Net_Fare:
          (Number(flight.price) + Number(userapicharges["2"] || 0)) * paxTypes +
          (Number(flight.infant_price) + Number(userapicharges["2"] || 0)) *
            Number(dataparams.Infant_Count || 0),
      },
      fare_type: null,
      baggage: null,
      refundable: null,
      seats_available: flight.pax || null,
      segments: [segment],
      stopovers: 0,
      other: flight,
      sit_type: 2,
    };
    flights.push(flightData);
  });

  return flights;
}
function processgofly(data, dataparams, apicharges, userapicharges) {
  const flights = [];
  const flightData = data.flights || [];
  const totalPassengers =
    Number(dataparams.Adult_Count || 0) +
    Number(dataparams.Child_Count || 0) +
    Number(dataparams.Infant_Count || 0);
  flightData.forEach((flight) => {
    const segments = flight.segments.map((segment) => ({
      origin: segment.legs[0].origin,
      destination: segment.legs[0].destination,
      flight_number: `${segment.legs[0].airline} ${segment.legs[0].flight_number}`,
      departure_datetime: segment.legs[0].departure_time,
      arrival_datetime: segment.legs[0].arrival_time,
      duration: segment.duration,
    }));

    const flightData = {
      origin: flight.segments[0].legs[0].origin,
      destination: flight.segments[0].legs[0].destination,
      Airline_Code: flight.segments[0].legs[0].airline,
      flight_numbers: [
        `${flight.segments[0].legs[0].airline} ${flight.segments[0].legs[0].flight_number}`,
      ],
      departure_datetime: flight.segments[0].legs[0].departure_time,
      arrival_datetime: flight.segments[0].legs[0].arrival_time,
      duration: calculateDuration(
        flight.segments[0].legs[0].departure_time,
        flight.segments[0].legs[0].arrival_time,
        3
      ),
      price: {
        isisnetfare:
          Number(flight.total_price) +
          Number(apicharges["3"] || 0) * totalPassengers,
        Without_Net_Fare:
          Number(flight.total_price) +
          Number(userapicharges["3"] || 0) * totalPassengers,
      },
      fare_type: null,
      baggage: null,
      refundable: !flight.non_refundable,
      seats_available: flight.seats_available || null,
      segments: segments,
      stopovers: 0,
      other: flight,
      sit_type: 3,
    };
    flights.push(flightData);
  });

  return flights;
}
function processResponse4(
  data,
  dataparams,
  keyval,
  apicharges,
  userapicharges
) {
  const flights = [];
  const flightData = Array.isArray(data) ? data : [];

  const totalPassengers =
    Number(dataparams.Adult_Count || 0) +
    Number(dataparams.Child_Count || 0) +
    Number(dataparams.Infant_Count || 0);
  flightData.forEach((flight) => {
    // Create segments from onward_connecting data
    const segments = flight.onward_connecting.map((segment) => ({
      origin: segment.departure_city_code,
      destination: segment.arrival_city_code,
      flight_number: segment.flight_number.startsWith(
        `${segment.airline_code} `
      )
        ? segment.flight_number
        : segment.flight_number.startsWith(segment.airline_code)
        ? `${segment.airline_code} ${segment.flight_number
            .replace(segment.airline_code, "")
            .trim()}`
        : `${segment.airline_code} ${segment.flight_number}`,
      departure_datetime: `${segment.departure_date} ${segment.departure_time}`,
      arrival_datetime: `${segment.arrival_date} ${segment.arrival_time}`,
      duration: calculateDuration(
        `${segment.departure_date} ${segment.departure_time}`,
        `${segment.arrival_date} ${segment.arrival_time}`,
        4
      ),
    }));
    const finalsegment =
      segments.length > 0
        ? segments
        : [
            {
              origin: flight.dep_city_code,
              destination: flight.arr_city_code,
              flight_number: flight.flight_number.startsWith(
                `${flight.airline_code} `
              )
                ? flight.flight_number
                : flight.flight_number.startsWith(flight.airline_code)
                ? `${flight.airline_code} ${flight.flight_number
                    .replace(flight.airline_code, "")
                    .trim()}`
                : `${flight.airline_code} ${flight.flight_number}`,
              departure_datetime: `${flight.onward_date} ${flight.dep_time}`,
              arrival_datetime: `${flight.arr_date} ${flight.arr_time}`,
              duration: calculateDuration(
                `${flight.onward_date} ${flight.dep_time}`,
                `${flight.arr_date} ${flight.arr_time}`,
                4
              ),
            },
          ];
    const flightData = {
      key: keyval,
      origin: flight.dep_city_code,
      destination: flight.arr_city_code,
      Airline_Code: flight.airline_code,
      flight_numbers: finalsegment.map((s) =>
        s.flight_number.replace(/\s+/g, " ").trim()
      ),
      departure_datetime: `${flight.onward_date} ${flight.dep_time}`,
      arrival_datetime: `${flight.arr_date} ${flight.arr_time}`,
      duration: calculateDuration(
        `${flight.onward_date} ${flight.dep_time}`,
        `${flight.arr_date} ${flight.arr_time}`,
        4
      ),
      price: {
        isisnetfare:
          Number(flight.total_payable_price) +
          Number(apicharges["4"] || 0) * totalPassengers,
        Without_Net_Fare:
          Number(flight.total_payable_price) +
          Number(userapicharges["4"] || 0) * totalPassengers,
      },
      fare_type: flight.FareClasses[0]?.Class_Desc || null,
      baggage: {
        Check_In_Baggage: `adult: ${flight.check_in_baggage_adult}kg, child: ${flight.check_in_baggage_children}kg, infant: ${flight.check_in_baggage_infant}kg`,
        Hand_Baggage: `adult: ${flight.cabin_baggage_adult}kg, child: ${flight.cabin_baggage_children}kg, infant: ${flight.cabin_baggage_infant}kg`,
      },
      refundable: flight.FareClasses[0]?.Class_Desc.includes("Non Refundable")
        ? false
        : null,
      seats_available: parseInt(flight.available_seats) || null,
      segments: finalsegment,
      stopovers: flight.no_of_stop,
      other: flight,
      sit_type: 4,
    };
    flights.push(flightData);
  });

  return flights;
}
function convertISTtoUTC(istString) {
  const istDate = new Date(istString);
  // Manually subtract 5 hours 30 minutes
  const utcDate = new Date(istDate.getTime() - 5.5 * 60 * 60 * 1000);
  return utcDate.toISOString(); // "YYYY-MM-DDTHH:mm:ss.sssZ"
}
function offlineProcess(data, dataparams, keyval, apicharges, userapicharges) {
  const flights = [];
  const flightData = Array.isArray(data) ? data : [];
  const totalPassengers =
    Number(dataparams.Adult_Count || 0) +
    Number(dataparams.Child_Count || 0) +
    Number(dataparams.Infant_Count || 0);
  flightData.forEach((flight) => {
    const totalPayablePrice =
      Number(dataparams.Adult_Count || 0) * Number(flight.adult_price || 0) +
      Number(dataparams.Child_Count || 0) * Number(flight.child_price || 0) +
      Number(dataparams.Infant_Count || 0) * Number(flight.infant_price || 0);

    const departureDatetime = convertISTtoUTC(flight.departure_time);
    const arrivalDatetime = convertISTtoUTC(flight.arrived_time);

    const finalSegment = [
      {
        origin: flight.from_airline?.alpha_2 || "",
        destination: flight.to_airline?.alpha_2 || "",
        flight_number: `${flight.airline_details?.code || ""} ${
          flight.flight_code
        }`.trim(),
        departure_datetime: departureDatetime,
        arrival_datetime: arrivalDatetime,
        duration: calculateDuration(departureDatetime, arrivalDatetime, 5),
      },
    ];

    const flightObject = {
      key: keyval,
      origin: flight.from_airline?.alpha_2 || "",
      destination: flight.to_airline?.alpha_2 || "",
      Airline_Code: flight.airline_details?.code || "",
      flight_numbers: [
        `${flight.airline_details?.code || ""} ${flight.flight_code}`.trim(),
      ],

      departure_datetime: departureDatetime,
      arrival_datetime: arrivalDatetime,
      duration: calculateDuration(departureDatetime, arrivalDatetime, 5),
      price: {
        isisnetfare:
          totalPayablePrice + Number(apicharges["5"] || 0) * totalPassengers,
        Without_Net_Fare:
          totalPayablePrice +
          Number(userapicharges["5"] || 0) * totalPassengers,
      },
      fare_type: null, // Not available in offline data
      baggage: {
        Check_In_Baggage: flight.check_in_bag,
        Hand_Baggage: flight.cabin_in_bag,
      },
      refundable: flight.isrefundable?.toLowerCase() === "yes",
      seats_available: parseInt(flight.seat) || null,
      segments: finalSegment,
      stopovers: 0,
      other: flight,
      sit_type: 5,
    };

    flights.push(flightObject);
  });

  return flights;
}
function calculateFareDetails(
  item,
  // flight_booking_c,
  adultcount,
  agencycharge,
  usercharge
) {
  const paxTypes = [
    { type: 0, count: Number(adultcount.adult || 0) },
    { type: 1, count: Number(adultcount.child || 0) },
    { type: 2, count: Number(adultcount.infant || 0) },
  ];

  let totalFareWithNet = 0;
  let totalFareWithoutNet = 0;

  paxTypes.forEach((pax) => {
    const fareDetail =
      item.FareDetails.find((fare) => fare.PAX_Type === pax.type) || {};

    const totalAmount = Number(fareDetail.Total_Amount || 0);
    const netCommission = Number(fareDetail.Net_Commission || 0);
    const tds = Number(fareDetail.TDS || 0);
    const commissionPercentage = Number(agencycharge || 0);
    // console.log(commissionPercentage);
    const agentcommission = (netCommission * commissionPercentage) / 100;
    // const mycommission = netCommission -agentcommission;

    // // Calculation with Net Fare

    //   if( mycommission>100){
    //     totalFareWithNet +=
    //       (totalAmount - (netCommission * commissionPercentage) / 100 + tds) *
    //       pax.count;
    //       totalFareWithoutNet += totalAmount * pax.count;
    //   }else{
    //     totalFareWithNet +=
    //       ((totalAmount - (netCommission * commissionPercentage) / 100 + tds)+100) *
    //       pax.count;
    //       totalFareWithoutNet += (totalAmount+100) * pax.count;
    //   }
    // const mycom = (netCommission * (100 - commissionPercentage)) / 100;
    // Calculation with Net Fare
    // totalFareWithNet +=
    //   (mycom < 100
    //     ? totalAmount - netCommission + 100
    //     : totalAmount - mycom + tds) * pax.count;

    // Calculation without Net Fare
    totalFareWithNet +=
      (totalAmount - netCommission + commissionPercentage) * pax.count;
    totalFareWithoutNet += (totalAmount + Number(usercharge)) * pax.count;
  });

  return {
    isisnetfare: totalFareWithNet,
    Without_Net_Fare: totalFareWithoutNet,
  };
}

async function gflight(req, res) {
  
  const data = await SettingModel.findOne({ where: { id: "1" } });
  let urlforapi = "";
  let methodforapi = "";
  let dataforapi = req.body.data ? JSON.parse(req.body.data) : "";
  if (req.body.sit_type == "3") {
    urlforapi =
      req.body.type == "checkflight"
        ? "https://krn.nexusdmc.com/api/v1/flights/series-check-avail"
        : req.body.type == "ticket"
        ? "https://krn.nexusdmc.com/api/v1/bookings/reference/" + req.body.id
        : "https://krn.nexusdmc.com/api/v1/flights/series-book";
      // req.body.type == "checkflight"
      //   ? "https://api.nexusdmc.com/api/v1/flights/series-check-avail"
      //   : req.body.type == "ticket"
      //   ? "https://api.nexusdmc.com/api/v1/bookings/reference/" + req.body.id
      //   : "https://krn.nexusdmc.com/api/v1/flights/series-book";
    methodforapi = req.body.type == "ticket" ? "get" : "post";
  } else if (req.body.sit_type == "4") {
    urlforapi =
      // req.body.type == "checkflight"
      //   ? "https://devapi.flightapi.co.in/v1/fbapi/fare_quote"
      //   : req.body.type == "ticket"
      //   ? "https://devapi.flightapi.co.in/v1/fbapi/booking_details"
      //   : "https://devapi.flightapi.co.in/v1/fbapi/book";
      req.body.type == "checkflight"
        ? "https://api.fareboutique.in/v1/fbapi/fare_quote"
        : req.body.type == "ticket"
        ? "https://api.fareboutique.in/v1/fbapi/booking_details"
        : "https://api.fareboutique.in/v1/fbapi/book";
    methodforapi = "post";
    // dataforapi.end_user_ip = "183.83.43.117";
    // dataforapi.token = "4-2-3721-KRAZY-389-xnewkncBUI8";
    dataforapi.end_user_ip = "89.116.34.212";
    dataforapi.token = "316-597-VIVAAN9809nuewhbnkcuewIYnj";
  }
  // let dataparams = JSON.parse(req.body.data);
  // console.log(dataforapi);
  await axios({
    method: methodforapi,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key":
        req.body.sit_type == "4"
          ? ""
          : // "test_2b2234580819f38a390c903f1665584a595a3736f19d0415",
            "test_2b2234580819f38a390c903f1665584a595a3736f19d0415",
    },
    url: urlforapi,
    data: JSON.stringify(dataforapi),
  })
    .then(function (response) {
      return res.status(200).send({
        status: true,
        message: "Data get successfully",
        data: response.data,
      });
      //  if (response.data.success) {
      //    goflyres = response.data["_data"];
      //  }
    })
    .catch(function (error) {
      if (error.response) {
        const statusCode = error.response.status;

        if (statusCode === 400) {
          return res.status(200).send({
            status: false,
            message: "Bad Request",
            error: error.response.data,
          });
        }
      }
      console.log("CHECKFLIGHT PAYLOAD:", dataforapi);
      return res.status(403).send({ status: false, error: error });
    });
}

module.exports = {
  fetch,
  search,
  search1,
  search2,
  search3,
  search4,
  search5,
  fetch_get,
  razorpayCapture,
  hdfcCreateOrder,
  payment,
  gflight,
  hdfcCallback,

};
