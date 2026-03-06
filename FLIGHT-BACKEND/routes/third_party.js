const express = require("express");
const router = express.Router();

const {
  fetch,
  fetch_get,
  razorpayCapture,
  hdfcCreateOrder,
  payment,
  search,
  search1,
  search2,
  search3,
  search4,
  search5,
  gflight,
  hdfcCallback,
} = require("../controllers/Third_party");

const { uplode } = require("../helpers/file_uplode");
const auth = require("../middleware/auth");

router.post("/fetch", uplode.none(), fetch);
router.post("/search", auth.isAuthorize, uplode.none(), search);
router.post("/search1", auth.isAuthorize, uplode.none(), search1);
router.post("/search2", auth.isAuthorize, uplode.none(), search2);
router.post("/search3", auth.isAuthorize, uplode.none(), search3);
router.post("/search4", auth.isAuthorize, uplode.none(), search4);
router.post("/search5", auth.isAuthorize, uplode.none(), search5);
router.post("/fetch_get", uplode.none(), fetch_get);
// router.post("/razorpaycapture", uplode.none(), razorpayCapture);
router.post("/hdfc-create-order", uplode.none(), hdfcCreateOrder);
router.post("/hdfc-callback", uplode.none(), hdfcCallback);

router.post("/payment", uplode.none(), payment);
router.post("/gflight", uplode.none(), gflight);

module.exports = router;
