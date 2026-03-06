const { validationResult, Result } = require("express-validator");
const OTPModel = require("../models").otp;
const AdminModel = require("../models").admin;
const JWT_SECRET = "rdk0786";
const UserModel = require("../models").users;
const InterestModel = require("../models").interest;
const LanguageModel = require("../models").language;
const Userlike = require("../models").likeduser;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { userimage } = require("../models");
const saltRounds = 10;
const { Op } = require('sequelize');

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

async function sendotp(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  let info = {
    value: req.body.mobile_no,
    otp: generateOTP(),
  };

  const existingUser = await UserModel.findOne({
    where: {
      mobile_no: req.body.mobile_no,
    },
  });
  if (existingUser) {
    return res.status(403).send({ status: false, message: "This users already exist in the database" })

  }

  try {
    const otp = await OTPModel.create(info);
    res
      .status(200)
      .send({ status: true, message: "OTP Sent Successfully", data: otp });
  } catch (err) {
    console.error("Error inserting OTP into database:", err);
    res.status(500).send({ status: false, message: err });
    // You can customize the error handling and response as per your application's needs
  }
}

async function reg_verify_otp(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  try {
    data = await OTPModel.findOne({
      where: {
        value: req.body.mobile_no,
      },
      order: [["id", "DESC"]],
    });

    if (data == null) {
      res.status(502).send({ status: false, message: "Invaild Request" });
    } else if (data.otp == req.body.otp) {

      info = {
        mobile_no: req.body.mobile_no,
        status: '1',
      }
      const model = await UserModel.create(info);
      const token = jwt.sign({ id: model.id }, JWT_SECRET);

      await OTPModel.destroy({
        where: {
          value: req.body.mobile_no,
        },
      });



      await UserModel.update({ fcm: req.body.fcm }, { where: { id: model.id } });

      res
        .status(200)
        .send({ status: true, message: "OTP Verify Successfully", data: { token: token } });
    } else {
      res.status(502).send({ status: false, message: "OTP Wrong" });
    }
  } catch (err) {
    console.error("Error inserting OTP into database:", err);
    res.status(500).send({ status: false, message: "Internal server error" });
    // You can customize the error handling and response as per your application's needs
  }
}

async function profile_update(req, res) {
  let info;
  try {
    // Check if req.body.data exists and is a valid JSON string
    if (req.body.data) {
      try {
        updateData = JSON.parse(req.body.data);
      } catch (e) {
        return res.status(400).send({ status: false, message: "Invalid JSON data" });
      }
    } else {
      updateData = {}; // Initialize as empty object if data is not provided
    }

    if (req.file) {
      updateData.profile = "users_images/" + req.file.filename;
    }


    // Check if password needs to be updated
    if (updateData.password) {
      const hashedPassword = await bcrypt.hash(info.password, saltRounds);
      updateData.password = hashedPassword;
    }

    // Check if there are any updates to perform
    if (Object.keys(updateData).length > 0) {
      // Update the user model with the new data
      await UserModel.update(updateData, { where: { id: req.user.id } });
    }

    res.status(200).send({
      status: true,
      message: "Profile Updated Successfully",
      data: updateData, // Send updated data in response
    });
  } catch (err) {
    console.error("Error Updating Profile:", err);
    res.status(500).send({ status: false, message: err.message });
  }
}

async function upload_user_photos(req, res) {
  try {
    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => {
        const relativePath = 'users_images/' + file.filename;

        return {
          user_id: req.user.id,
          image: relativePath,
        };
      });

      await userimage.bulkCreate(images);
    }

    res.status(200).send({
      status: true,
      message: "Image Uplode Successfully",
      data: req.files,
    });
  } catch (err) {
    console.error("Error Insert Image:", err);
    res.status(500).send({ status: false, message: err.message });
  }
}

async function getprofile(req, res) {
  try {
    let uid;

    if (req.body && req.body.user_id) {
      uid = req.body.user_id;
    } else {
      uid = req.user.id;
    }
    let self;
    let another;

    const model = await UserModel.findOne({ where: { id: uid } });
    const preference = ''
    if ((req.body && req.body.user_id) && (req.body.user_id != req.user.id)) {
      const model1 = await Userlike.findOne({ where: { liked_user_id: req.body.user_id, user_id: req.user.id, } });
      const model2 = await Userlike.findOne({ where: { user_id: req.body.user_id, liked_user_id: req.user.id, type: '1' } });
      self = model1;
      another = model2;

    }
    if (model != null) {
      const interestIds = model.interest ? model.interest.split(',').map(id => id.trim()) : [];
      const languageIds = model.language_i_know ? model.language_i_know.split(',').map(id => id.trim()) : [];

      const interests = await InterestModel.findAll({
        where: {
          id: {
            [Op.in]: interestIds,
          },
        },
      });

      const languages = await LanguageModel.findAll({
        where: {
          id: {
            [Op.in]: languageIds,
          },
        },
      });

      res.status(200).send({
        status: true,
        message: "Profile Get Successfully",
        data: {
          token: '',
          model: model,
          preference: preference,
          interests: interests,
          languages: languages, self: self, another: another,
        },
      });
    } else {
      res.status(401).send({
        status: false,
        message: "User not found"
      });
    }
  } catch (err) {
    console.error("Error Profile Get:", err);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
}

module.exports = {
  sendotp,
  reg_verify_otp,
  profile_update,
  getprofile,
  upload_user_photos
};
