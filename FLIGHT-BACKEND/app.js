const express = require("express");
const app = express();
require("dotenv").config();

const apiRouter = require("./routes/apiroutes");
const cors = require("cors");
const path = require("path");
const { uplode } = require("./helpers/file_uplode");
const { addfromsucessapi, payment_history } = require("./controllers/Wallet");


app.use(cors());

app.get("/server-ip", async (req, res) => {
  try {
    const axios = require("axios");
    const response = await axios.get("https://api.ipify.org?format=json");
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Unable to fetch IP" });
  }
});

app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded body
app.use("/api", apiRouter);
app.use("/public", express.static(path.join(__dirname, "public")));

app.post("/sucess", (req, res) => {
  const jsonData = Object.fromEntries(new URLSearchParams(req.body));
  const { udf1, udf2, amount, status, productinfo, txnid } = jsonData; // extract parameters from POST body
  // console.log(jsonData);
  if (status && status.toLowerCase() === "success") {
    payment_history({
      user_id: udf2,
      order_id: txnid,
      transaction_type: productinfo,
      details: JSON.stringify(jsonData),
    });
  }
  if (
    status &&
    udf1 &&
    status.toLowerCase() === "success" &&
    udf1.startsWith("wallet_")
  ) {
    addfromsucessapi({
      user_id: udf2,
      order_id: txnid,
      transaction_type: productinfo,
      amount: amount,
      payment_getway: "Rezorpay",
      details: JSON.stringify(jsonData),
      type: "1",
      status: "Success",
    });
    // console.log("Action triggered for wallet payment!");
  } else {
    // console.log("hdsisghjg");
  }
  const params = new URLSearchParams(req.body).toString();
  res.redirect(
    `https://vivan-frontend.vercel.app/#/success?status=${status}&order_id=${txnid}&amount=${amount}`
    );
});

app.listen(4000, () => {
  console.log("working server now");
});
