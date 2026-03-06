const express = require("express");
const router = express.Router();
const {
  add,
  list,
  History,
  agent_commission,
  getPaymentHistoryByTxnid,
} = require("../controllers/Wallet");
const { uplode } = require("../helpers/file_uplode");
const auth = require("../middleware/auth");

const {} = require("../helpers/validation");

router.post("/add", uplode.none(), add);
router.post("/list", uplode.none(), list);
router.post("/History", uplode.none(), History);
router.post("/agent_commission", uplode.none(), agent_commission);

router.get("/payment_check", getPaymentHistoryByTxnid);
module.exports = router;
