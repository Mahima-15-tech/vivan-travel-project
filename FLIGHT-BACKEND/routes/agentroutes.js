const express = require('express');
const router = express.Router();
const { add, login, list, delet, update_status, agent_profile, flight_apis, visa_agent_charge, visa_agent_charge_add } = require("../controllers/Agent");
const { uplode } = require('../helpers/file_uplode');
const auth = require('../middleware/auth');

const { emailpassword, pagnation, Del, status } = require("../helpers/validation");

router.post('/add', uplode.fields([
    { name: 'gst_certificate_photo', maxCount: 1 },
    { name: 'pan_no_photo', maxCount: 1 },
    { name: 'proof_photo_font', maxCount: 1 },
    { name: 'proof_photo_back', maxCount: 1 },
    { name: 'Office_address_proof_photo', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
]), add);

router.post("/login", uplode.none(), emailpassword, login);
router.post('/list', uplode.none(), pagnation, list);
router.post('/delet', uplode.none(), Del, delet);
router.post('/update_status', uplode.none(), status, update_status);
router.post('/get_details', uplode.none(), agent_profile);
router.get('/flight_apis', uplode.none(), flight_apis);
router.post('/visa_agent_charge', uplode.none(), visa_agent_charge);
router.post('/visa_agent_charge_add', uplode.none(), visa_agent_charge_add);

module.exports = router;