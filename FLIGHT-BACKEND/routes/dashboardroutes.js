const express = require('express');
const router = express.Router();

const { home} = require("../controllers/DashboardController");
const { uplode } = require('../helpers/file_uplode');

router.post("/",uplode.none(),home);
module.exports = router;