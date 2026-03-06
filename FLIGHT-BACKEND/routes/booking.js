const express = require('express');
const router = express.Router();
const {
  add,
  addv2,
  searchbooking, update,
  list,
  get_ticket_details,
  applied_list,
  cancle_booking,
  update_status,
  cancle_list,
  cancle_booking_update,
  Series_Booking,
  Series_Booking_list,
  Series_Booking_details,
  S_Booking_list,
  Series_update_status,
  ticket_Details,
} = require("../controllers/Booking");
const { uplode } = require('../helpers/file_uplode');
const auth = require('../middleware/auth');

const { pagnation } = require("../helpers/validation");

router.post('/add', uplode.none(), add);
router.post('/addv2', uplode.none(), addv2);
router.post('/searchbooking', uplode.none(), searchbooking);
router.post('/update', uplode.none(), update);
router.post('/list', uplode.none(), list);
router.post('/applied_list', uplode.none(), applied_list);
router.post('/cancle_booking', uplode.none(), cancle_booking);
router.post('/update_status', uplode.none(), update_status);
router.post('/cancle_list', uplode.none(), pagnation, cancle_list);
router.post('/cancle_booking_update', uplode.none(), cancle_booking_update);
router.post('/Series_Booking', uplode.none(), Series_Booking);
router.post('/Series_Booking_list', uplode.none(), Series_Booking_list);
router.post('/Series_Booking_details', uplode.none(), Series_Booking_details);
router.post('/S_Booking_list', uplode.none(), S_Booking_list);
router.post('/Series_update_status', uplode.none(), Series_update_status);
router.post('/get_ticket_details', uplode.none(), get_ticket_details);
router.post('/s_ticket_Details', uplode.none(), ticket_Details);

module.exports = router;