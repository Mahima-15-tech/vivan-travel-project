const path = require("path");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder;
    if (file.fieldname === "visa") {
      folder = "oktb_document";
    } else if (file.fieldname === "passport_font_side") {
      folder = "oktb_document";
    } else if (file.fieldname === "passport_back_side") {
      folder = "oktb_document";
    } else if (file.fieldname === "from_ticket") {
      folder = "oktb_document";
    } else if (file.fieldname === "to_ticket") {
      folder = "oktb_document";
    } else if (file.fieldname === "group_zip") {
      folder = "oktb_document";
    } else if (
      file.fieldname.startsWith("front_passport_img") ||
      file.fieldname.startsWith("additional_folder") ||
      file.fieldname.startsWith("back_passport_img") ||
      file.fieldname.startsWith("traveler_photo") ||
      file.fieldname.startsWith("pen_card_photo") ||
      file.fieldname.startsWith("created_file") ||
      file.fieldname.startsWith("insurance_file") ||
      file.fieldname.startsWith("hotal")
    ) {
      folder = "applied_visa_document";
    } else if (file.fieldname === "airline_logo") {
      folder = "airline_logo";
    } else if (file.fieldname === "gst_certificate_photo") {
      folder = "agent_document";
    } else if (file.fieldname === "pan_no_photo") {
      folder = "agent_document";
    } else if (file.fieldname === "proof_photo_font") {
      folder = "agent_document";
    } else if (file.fieldname === "proof_photo_back") {
      folder = "agent_document";
    } else if (file.fieldname === "Office_address_proof_photo") {
      folder = "agent_document";
    } else if (file.fieldname === "logo") {
      folder = "agent_document";
    } else {
      folder = req.body.folder ? req.body.folder : "user_profile";
    }

    const dir = path.join(__dirname, "../public/" + folder);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});
const uplode = multer({ storage: storage });

module.exports = { uplode };
