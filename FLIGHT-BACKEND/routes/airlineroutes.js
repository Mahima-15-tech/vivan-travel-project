const express = require('express');
const router = express.Router();
const {
  add,
  list,
  singledata,
  createOrUpdateAirlinePrice,
  listAirlinePrices,
  getairlineprice,
} = require("../controllers/Airline");
const { uplode } = require('../helpers/file_uplode');
const auth = require('../middleware/auth');


router.post(
  "/add",
  uplode.fields([{ name: "airline_logo", maxCount: 1 }]),
  add
);
router.post("/singledata", uplode.none(), singledata);
router.post('/list', uplode.none(),list);
router.post('/listAirlinePrices', uplode.none(),listAirlinePrices);
router.post("/getairlineprice", uplode.none(), getairlineprice);
router.post('/createOrUpdateAirlinePrice', uplode.none(),createOrUpdateAirlinePrice);
module.exports = router;