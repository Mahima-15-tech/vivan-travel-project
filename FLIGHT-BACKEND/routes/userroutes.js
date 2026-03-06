const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const {
  account_login,
  users_list,
  users_profile,
  update_password,
  update_profile,
  forget_update_password,
  create_account,
  deactivate_account,
  update_user_status,
  send_Mail,
  update_user_wallet,
  logout,
  withdraw,
  withdrawupdate,
  withdrawlist,
  forget_password
} = require("../controllers/userController");
const { uplode } = require("../helpers/file_uplode");
const { emailpassword, pagnation, Del, status, update_wallet } = require("../helpers/validation");



router.post("/create_account", uplode.fields([
  { name: 'gst_certificate_photo', maxCount: 1 },
  { name: 'pan_no_photo', maxCount: 1 },
  { name: 'proof_photo_font', maxCount: 1 },
  { name: 'proof_photo_back', maxCount: 1 },
  { name: 'Office_address_proof_photo', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
]), create_account);


router.post("/account_login", uplode.none(), emailpassword, account_login);
router.post("/users_list", uplode.none(), pagnation, users_list);
router.get("/users_profile", auth.isAuthorize, uplode.none(), users_profile);
// router.post("/update_account", auth.isAuthorize, uplode.single('user_profile'), update_profile);


router.post("/update_account", auth.isAuthorize, uplode.fields([
  { name: 'user_profile', maxCount: 1 },
  { name: 'gst_certificate_photo', maxCount: 1 },
  { name: 'pan_no_photo', maxCount: 1 },
  { name: 'proof_photo_font', maxCount: 1 },
  { name: 'proof_photo_back', maxCount: 1 },
  { name: 'Office_address_proof_photo', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
]), update_profile);


router.post("/update_password", auth.isAuthorize, uplode.none(), update_password);
router.post("/update_user_wallet", auth.isAuthorize, uplode.none(), update_wallet, update_user_wallet);
router.put("/forget_update_password", auth.isAuthorize, uplode.none(), forget_update_password);
router.post("/decative_account", auth.isAuthorize, uplode.none(), deactivate_account);
router.post("/update_user_status", uplode.none(), status, update_user_status);
router.post("/send_Mail", uplode.none(), send_Mail);
router.post("/logout", auth.isAuthorize, uplode.none(), logout);
router.post("/withdraw", auth.isAuthorize, uplode.none(), withdraw);
router.post("/withdrawupdate", auth.isAuthorize, uplode.none(), withdrawupdate);
router.post("/withdrawlist", auth.isAuthorize, uplode.none(), withdrawlist);
router.post("/forget_password",  uplode.none(), forget_password);

module.exports = router;
