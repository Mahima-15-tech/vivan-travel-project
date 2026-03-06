const express = require('express');
const router = express.Router();
const { add, update, list } = require("../controllers/Offline_ticket");
const { uplode } = require('../helpers/file_uplode');
const auth = require('../middleware/auth');

router.post('/add', uplode.none(), add);
router.post('/update', uplode.none(), update);
router.post('/list', uplode.none(), list);

module.exports = router;