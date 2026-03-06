const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { add,list } = require("../controllers/ReportController");
const { uplode } = require('../helpers/file_uplode');
const {add_report,pagnation } = require("../helpers/validation");

router.post("/add",auth.isAuthorize,uplode.none(),add_report,add);
router.post("/list",uplode.none(),pagnation,list);
module.exports = router;
