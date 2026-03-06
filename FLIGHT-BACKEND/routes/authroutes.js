const express = require('express');
const router = express.Router();
const {
  sendotp, reg_verify_otp, profile_update, upload_user_photos, getprofile} = require("../controllers/AuthController");
const { uplode } = require('../helpers/file_uplode');
const auth = require('../middleware/auth');

const {
  sendOtpValidation,
  verifyOtpValidation
} = require("../helpers/validation");

router.post('/sendotp', uplode.none(), sendOtpValidation, sendotp);
router.post('/reg_verify_otp', uplode.none(), verifyOtpValidation, reg_verify_otp);
router.put("/update_profile", auth.isAuthorize, uplode.single("profile_image"), profile_update);
router.put("/upload_user_photos", auth.isAuthorize, uplode.array("users_images", 6), upload_user_photos);
router.post("/", auth.isAuthorize, uplode.none(), getprofile);

module.exports = router;