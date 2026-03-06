const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { settings, updateSettings } = require("../controllers/supportController");
const { uplode } = require('../helpers/file_uplode');

router.get("/settings", uplode.none(), settings);
router.post("/updateSettings", uplode.fields([
    { name: 'admin_logo', maxCount: 1 },
    { name: 'firebase_file', maxCount: 1 }
]), updateSettings);

module.exports = router;
