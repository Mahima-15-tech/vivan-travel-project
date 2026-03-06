const express = require('express');
const router = express.Router();
const { add, list, search, delet, update_status, get_details, applied_list } = require("../controllers/Oktb");
const { uplode } = require('../helpers/file_uplode');
const auth = require('../middleware/auth');

const { newoktb, pagnation, searchvisa, Del, status } = require("../helpers/validation");

router.post('/add', uplode.fields([
    { name: 'passport_font_side', maxCount: 1 },
    { name: 'passport_back_side', maxCount: 1 },
    { name: 'visa', maxCount: 1 },
    { name: 'from_ticket', maxCount: 1 },
    { name: 'to_ticket', maxCount: 1 },
    { name: 'group_zip', maxCount: 1 },
]), newoktb, add);

router.post('/list', uplode.none(), pagnation, list);
router.post('/search', uplode.none(), searchvisa, search);
router.post('/applied_list', uplode.none(), pagnation, applied_list);
router.post('/delet', uplode.none(), Del, delet);
router.post('/update_status', uplode.fields([{ name: "created_file", maxCount: 1 }]), status, update_status);
router.post('/get_details', uplode.none(), Del, get_details);

module.exports = router;