const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  add,
  list,
  update,
  submit_feedback,
  feedbacklist,
  deleteFeedback,
} = require("../controllers/supportController");
const { uplode } = require('../helpers/file_uplode');
const { support ,feedback, update_support} = require("../helpers/validation");

router.post("/add",uplode.none(),support,add);
router.post("/submitfeedback", uplode.none(), feedback, submit_feedback);
router.post("/list",uplode.none(),list);
router.post("/feedbacklist", uplode.none(), feedbacklist);
router.post("/deleteFeedback", uplode.none(), deleteFeedback);
router.put("/update",uplode.none(),update_support,update);
module.exports = router;
