const express = require('express');
const router = express.Router();
const {
    admin_login,
    admin_create,
    admin_profile,
    send_otp_to_password,
    Verify_otp_to_password,
    forget_update_password,
    admin_profile_update,
    admin_password_update,
    logout} = require("../controllers/Admin");

const { uplode } = require('../helpers/file_uplode');
const auth = require('../middleware/auth');

const {
  sendOtpValidation,
  verifyOtpValidation
} = require("../helpers/validation");

router.post('/admin_login', uplode.none(), admin_login);
router.post('/admin_create', uplode.none(), admin_create);
router.get('/admin_profile',auth.isAuthorize, uplode.none(), admin_profile);
router.put('/admin_password_update',auth.isAuthorize, uplode.none(), admin_password_update);
router.put("/admin_profile_update",auth.isAuthorize,uplode.none(),admin_profile_update);
module.exports = router;