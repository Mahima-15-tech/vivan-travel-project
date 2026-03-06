const express = require("express");
const router = express.Router();
const {
  add,
  list,
  search,
  delet,
  update_status,
  get_details,
  apply_visa,
  apply_visa_bulk,
  applied_list,
  update_applied_status,
  applied_visa_details,
  save_as_draft,
  get_applied_visa_details,
  visa_delete,
} = require("../controllers/Visa");
const { uplode } = require("../helpers/file_uplode");
const auth = require("../middleware/auth");

const {
  newvisa,
  pagnation,
  searchvisa,
  Del,
  status,
} = require("../helpers/validation");

router.post("/add", uplode.none(), newvisa, add);
router.post("/list", uplode.none(), pagnation, list);
router.post("/search", uplode.none(), auth.isAuthorize, searchvisa, search);
router.post("/delet", uplode.none(), Del, delet);
router.get("/visa_delete/:id", uplode.none(), visa_delete);
router.post("/update_status", uplode.none(), status, update_status);
router.post("/get_details", uplode.none(), auth.isAuthorize, Del, get_details);
router.post(
  "/get_applied_visa_details",
  uplode.none(),
  auth.isAuthorize,
  get_applied_visa_details
);

router.post(
  "/apply_visa",
  uplode.fields([
    { name: "front_passport_img", maxCount: 1 },
    { name: "back_passport_img", maxCount: 1 },
    { name: "traveler_photo", maxCount: 1 },
    { name: "pen_card_photo", maxCount: 1 },
    { name: "created_file", maxCount: 1 },
    { name: "additional_folder", maxCount: 1 },
    { name: "hotal", maxCount: 1 },
  ]),
  apply_visa
);
router.post(
  "/apply_visa_bulk",
  uplode.fields(
    Array.from({ length: 10 }).flatMap((_, i) => [
      { name: `front_passport_img_${i + 1}`, maxCount: 1 },
      { name: `back_passport_img_${i + 1}`, maxCount: 1 },
      { name: `traveler_photo_${i + 1}`, maxCount: 1 },
      { name: `pen_card_photo_${i + 1}`, maxCount: 1 },
      { name: `created_file_${i + 1}`, maxCount: 1 },
      { name: `additional_folder_${i + 1}`, maxCount: 1 },
      { name: `hotal_${i + 1}`, maxCount: 1 },
    ])
  ),
  apply_visa_bulk
);

router.post(
  "/applied_list",
  uplode.none(),
  auth.isAuthorize,
  pagnation,
  applied_list
);
router.post(
  "/update_applied_status",
  uplode.fields([
    { name: "created_file", maxCount: 1 },
    { name: "insurance_file", maxCount: 1 },
  ]),
  status,
  update_applied_status
);

router.post("/applied_visa_details", uplode.none(), applied_visa_details);

router.post(
  "/save_as_draft",
  uplode.fields([
    { name: "front_passport_img", maxCount: 1 },
    { name: "back_passport_img", maxCount: 1 },
    { name: "traveler_photo", maxCount: 1 },
    { name: "pen_card_photo", maxCount: 1 },
    { name: "created_file", maxCount: 1 },
    { name: "additional_folder", maxCount: 1 },
    { name: "hotal", maxCount: 1 },
  ]),
  save_as_draft
);

module.exports = router;
