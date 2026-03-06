const { validationResult, Result } = require("express-validator");
const VisaModel = require("../models").visa;
const UserModel = require("../models").users;
const Applied_visaModel = require("../models").applied_visa;
const applied_visa_files = require("../models").applied_visa_files;
const SettingModel = require("../models").setting;
const { visasendMail } = require("../helpers/send_mail");
const Agent = require("../models").agent;
const { Sequelize, Op, fn, col, where, or } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { agent } = require("../models");
const VisaAgentCharges = require("../models").visa_agent_charges;

async function add(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  const info = {
    going_from: req.body.going_from,
    going_to: req.body.going_to,
    description: req.body.description,
    about: req.body.about,
    spec: req.body.spec,
    entry: req.body.entry,
    validity: req.body.validity,
    duration: req.body.duration,
    documents: req.body.documents,
    processing_time: req.body.processing_time,
    amount: req.body.amount,
    child_amount: req.body.child_amount,
    absconding_fees: req.body.absconding_fees,
  };

  try {
    let msg;
    if (req.body.id) {
      await VisaModel.update(info, { where: { id: req.body.id } });
      msg = "Update";
    } else {
      await VisaModel.create(info);
      msg = "Create";
    }

    res
      .status(200)
      .send({ status: true, message: "Visa " + msg + " successfully" });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Failed to add Visa",
      error: error.message,
    });
  }
}

async function list(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  const page = parseInt(req.body.page) || 1;
  const limit = parseInt(req.body.limit) || 10;
  const offset = (page - 1) * limit;

  // Get filter criteria from request body
  const { going_from, going_to, status } = req.body;

  const whereClause = {};
  if (going_from) {
    whereClause.going_from = { [Op.like]: `%${going_from}%` };
  }
  if (going_to) {
    whereClause.going_to = { [Op.like]: `%${going_to}%` };
  }
  if (status) {
    whereClause.status = status; // exact match
  }

  try {
    const { count, rows: list } = await VisaModel.findAndCountAll({
      where: whereClause,
      offset: offset,
      limit: limit,
    });
    res.status(200).send({
      status: true,
      message: "Data retrieved successfully",
      data: list,
      pagination: {
        totallist: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        limit: limit,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "An error occurred while retrieving data",
      error: error.message,
    });
  }
}

async function search(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  const page = parseInt(req.body.page) || 1;
  const limit = parseInt(req.body.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    // const user = await UserModel.findOne({ where: { id: req.user.id } });
    // const user_type = user.type;

    const { count, rows: list } = await VisaModel.findAndCountAll({
      where: {
        [Op.and]: [
          Sequelize.where(
            fn("LOWER", col("going_from")),
            req.body.going_from.toLowerCase()
          ),
          Sequelize.where(
            fn("LOWER", col("going_to")),
            req.body.going_to.toLowerCase()
          ),
        ],
        status: "Active",
      },
      include: [
        {
          model: VisaAgentCharges,
          as: "visa_agent_charges",
          where: { agent_id: req.user.id },
          required: false,
        },
      ],
      offset: offset,
      limit: limit,
    });

    // if (user_type === 2) {
    //   const visaIds = list.map(v => v.id);
    //   const charges = await VisaAgentCharges.findAll({
    //     where: { visa_id: { [Op.in]: visaIds } }
    //   });
    //   const chargesMap = {};
    //   charges.forEach(c => {
    //     chargesMap[c.visa_id] = c.amount;
    //   });
    //   list.forEach(v => {
    //     if (chargesMap[v.id] !== undefined) {
    //       v.amount = chargesMap[v.id];
    //     }
    //   });
    // }

    res.status(200).send({
      status: true,
      message: "Data retrieved successfully",
      data: list,
      pagination: {
        totallist: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        limit: limit,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "An error occurred while retrieving data",
      error: error.message,
    });
  }
}

async function delet(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  await VisaModel.destroy({ where: { id: req.body.id } });
  res.status(200).send({ status: true, message: `Record Delete successfully` });
}

async function update_status(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  try {
    await VisaModel.update(
      { status: req.body.status },
      { where: { id: req.body.id } }
    );

    res.status(200).send({
      status: true,
      message: "Visa " + req.body.status + " Successfully",
    });
  } catch (err) {
    res.status(500).send({ status: false, message: "Internal server error" });
  }
}

async function get_details(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  const include = [];
  if (req.user && req.user.id) {
    include.push({
      model: VisaAgentCharges,
      as: "visa_agent_charges",
      where: { agent_id: req.user.id },
      required: false,
    });
  }
  const response = await VisaModel.findOne({
    where: { id: req.body.id },
    include,
  });
  if (!response) {
    return res.status(403).send({ status: true, message: "Details not found" });
  } else {
    return res.status(200).send({
      status: true,
      message: "Details get successfully",
      data: response,
    });
  }
}

async function get_applied_visa_details(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  // Support searching by either id or refrense_no
  let where = {};
  if (req.body.id) {
    where.id = req.body.id;
  } else if (req.body.refrense_no) {
    where.refrense_no = req.body.refrense_no;
  }

  const response = await applied_visa_files.findOne({
    where,
    include: [
      {
        model: Applied_visaModel,
        as: "applied_visa_list",
        required: true,
        where: {
          status: {
            [Op.ne]: "deleted", // status is NOT "deleted"
          },
        },
        order: [["id", "DESC"]],
      },
      {
        model: UserModel,
        as: "visa_applied_user",
        required: true,
        include: [
          {
            model: Agent,
            as: "agents",
          },
        ],
      },
      {
        model: VisaModel,
        as: "appliedvisa",
        required: true,
        include:
          req.body.needcharges === "yes"
            ? [
              {
                model: VisaAgentCharges,
                as: "visa_agent_charges",
                where: { agent_id: req.user.id },
                required: false,
              },
            ]
            : [],
      },
    ],
  });

  if (!response) {
    return res.status(403).send({ status: true, message: "Details not found" });
  } else {
    return res.status(200).send({
      status: true,
      message: "Details get successfully",
      data: response,
    });
  }
}

async function apply_visa(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  const info = {
    refrense_no:
      Math.floor(Math.random() * (999999999 - 111111111 + 1)) + 111111111,
    user_id: req.body.user_id,
    visa_id: req.body.visa_id,
    visa_type: req.body.visa_type,
    internal_ID: req.body.internal_ID,
    group_name: req.body.group_name,
    passport_no: req.body.passport_no,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    nationality: req.body.nationality,
    sex: req.body.sex,
    dob: req.body.dob,
    pen_card_no: req.body.pen_card_no,
    additional_question: req.body.additional_question,
    is_insurance: req.body.is_insurance,
    motherName: req.body.motherName,
    fatherName: req.body.fatherName,
    placeOfBirth: req.body.placeOfBirth,
    spouseName: req.body.spouseName,
    travelDate: req.body.travelDate,
    // returnDate: req.body.returnDate,
    entryPoint: req.body.entryPoint,
    exitPoint: req.body.exitPoint,
    additional_folder_label: req.body.additional_folder_label,
    amount: req.body.amount,
    hotal_name: req.body.hotal_name,
  };

  if (req.files) {
    if (req.files.front_passport_img) {
      info.front_passport_img =
        "applied_visa_document/" + req.files.front_passport_img[0].filename;
    }
    if (req.files.back_passport_img) {
      info.back_passport_img =
        "applied_visa_document/" + req.files.back_passport_img[0].filename;
    }
    if (req.files.traveler_photo) {
      info.traveler_photo =
        "applied_visa_document/" + req.files.traveler_photo[0].filename;
    }
    if (req.files.pen_card_photo) {
      info.pen_card_photo =
        "applied_visa_document/" + req.files.pen_card_photo[0].filename;
    }
    if (req.files.created_file) {
      info.created_file =
        "applied_visa_document/" + req.files.created_file[0].filename;
    }
    if (req.files.additional_folder) {
      info.additional_folder =
        "applied_visa_document/" + req.files.additional_folder[0].filename;
    }
    if (req.files.hotal) {
      info.hotal = "applied_visa_document/" + req.files.hotal[0].filename;
    }
  }

  try {
    if (req.body.id) {
      await Applied_visaModel.update(info, { where: { id: req.body.id } });

      return res
        .status(200)
        .send({ status: true, message: "Applied Visa Update successfully" });
    } else {
      info.working_status = "In Process";
      info.status = "In Process";

      await Applied_visaModel.create(info);

      const settingdata = await SettingModel.findOne({ where: { id: "1" } });

      const applieduserdata = await UserModel.findOne({
        where: { id: req.body.user_id },
      });
      const visaData = await VisaModel.findOne({
        where: { id: req.body.visa_id },
      });
      const emailHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visa Application Received</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #ececf2; margin: 0; padding: 0;">
    <table style="width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px;">
        <!-- Header Section -->
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #ffa85d; color: #ffffff; border-radius: 8px 8px 0 0;">
                <img src="https://vivantravels.com/static/media/logo.7d19d5194296db63d18a.png" alt="Vivan Travels Logo" style="max-width: 150px; margin-bottom: 10px;">
                <h1 style="margin: 0;">Visa Application Received</h1>
            </td>
        </tr>
        <!-- Content Section -->
        <tr>
            <td style="padding: 20px;">
                <p style="margin: 0 0 10px; font-size: 16px; color: #333333;">Dear ${info.first_name} ${info.last_name},</p>
                <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">Thank you for submitting your visa application. We have received your request and it is currently under review.</p>
                <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">Here are the details of your application:</p>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                        <td style="padding: 8px; border: 1px solid #dddddd; font-size: 16px; color: #333333;">Reference Number:</td>
                        <td style="padding: 8px; border: 1px solid #dddddd; font-size: 16px; color: #333333;">${info.refrense_no}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #dddddd; font-size: 16px; color: #333333;">Visa Type:</td>
                        <td style="padding: 8px; border: 1px solid #dddddd; font-size: 16px; color: #333333;">${info.visa_type}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #dddddd; font-size: 16px; color: #333333;">Description:</td>
                        <td style="padding: 8px; border: 1px solid #dddddd; font-size: 16px; color: #333333;">${visaData.description}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #dddddd; font-size: 16px; color: #333333;">Passport Number:</td>
                        <td style="padding: 8px; border: 1px solid #dddddd; font-size: 16px; color: #333333;">${info.passport_no}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #dddddd; font-size: 16px; color: #333333;">Nationality:</td>
                        <td style="padding: 8px; border: 1px solid #dddddd; font-size: 16px; color: #333333;">${info.nationality}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #dddddd; font-size: 16px; color: #333333;">Visa Validity:</td>
                        <td style="padding: 8px; border: 1px solid #dddddd; font-size: 16px; color: #333333;">${visaData.validity}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #dddddd; font-size: 16px; color: #333333;">Visa Duration:</td>
                        <td style="padding: 8px; border: 1px solid #dddddd; font-size: 16px; color: #333333;">${visaData.duration}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #dddddd; font-size: 16px; color: #333333;">Processing Time:</td>
                        <td style="padding: 8px; border: 1px solid #dddddd; font-size: 16px; color: #333333;">${visaData.processing_time}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #dddddd; font-size: 16px; color: #333333;">Visa Fee:</td>
                        <td style="padding: 8px; border: 1px solid #dddddd; font-size: 16px; color: #333333;">${visaData.amount}</td>
                    </tr>
                </table>
                <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">Our team will review your application and notify you of any updates via email. If additional information is required, we will reach out to you.</p>
                <p style="margin: 20px 0 0; font-size: 16px; color: #333333;">Thank you for choosing our services.</p>
                <p style="margin: 10px 0 0; font-size: 14px; color: #666666;">If you have any questions, feel free to contact us.</p>
            </td>
        </tr>
        <!-- Footer Section -->
        <tr>
            <td style="padding: 20px; background-color: #f4f4f4; text-align: center; border-radius: 0 0 8px 8px;">
                <p style="margin: 0; font-size: 14px; color: #666666;">Website: <a href="https://vivantravels.com" style="color: #ffa85d; text-decoration: none;">vivantravels.com</a></p>
                <p style="margin: 0; font-size: 14px; color: #666666;">Contact: ${settingdata.support_no}</p>
                <p style="margin: 10px 0 0; font-size: 14px; color: #666666;">&copy; 2025 Vivan Travels. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>`;
      visasendMail(
        applieduserdata.email,
        "Visa Application Received",
        emailHtml
      );
      return res
        .status(200)
        .send({ status: true, message: "Visa applied successfully" });
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Failed to processing request",
      error: error.message,
    });
  }
}


async function apply_visa_bulk(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  const reference_no =
    Math.floor(Math.random() * (999999999 - 111111111 + 1)) + 111111111;
  // Collect all bulk applicants (up to 10, can be increased if needed)
  const applicants = [];
  for (let i = 1; i <= 10; i++) {
    try {
      if (req.body[`user_id_${i}`]) {
        let info = {
          user_id: req.body[`user_id_${i}`],
          mylastid: req.body[`mylastid_${i}`],
          visa_id: req.body[`visa_id_${i}`] || req.body.visa_id,
          visa_type: req.body[`visa_type_${i}`] || req.body.visa_type,
          internal_ID: req.body[`internal_ID_${i}`] || req.body.internal_ID,
          group_name: req.body[`group_name_${i}`] || req.body.group_name,
          passport_no: req.body[`passport_no_${i}`],
          first_name: req.body[`first_name_${i}`],
          last_name: req.body[`last_name_${i}`],
          nationality: req.body[`nationality_${i}`],
          sex: req.body[`sex_${i}`],
          dob: req.body[`dob_${i}`] ? req.body[`dob_${i}`] : null,
          pen_card_no: req.body[`pen_card_no_${i}`],
          additional_question: req.body[`additional_question_${i}`],
          is_insurance: req.body[`is_insurance_${i}`],
          motherName: req.body[`motherName_${i}`],
          fatherName: req.body[`fatherName_${i}`],
          placeOfBirth: req.body[`placeOfBirth_${i}`],
          spouseName: req.body[`spouseName_${i}`],
          travelDate: req.body[`travelDate_${i}`],
          // returnDate: req.body[`returnDate_${i}`],
          entryPoint: req.body[`entryPoint_${i}`],
          exitPoint: req.body[`exitPoint_${i}`],
          additional_folder_label: req.body[`additional_folder_label_${i}`],
          amount: req.body[`amount_${i}`],
          hotal_name: req.body[`hotal_name_${i}`],
          working_status: "In Process",
        };
        if (req.body.submit_type == "apply") {
          info["status"] = "In Process";
        } else if (req.body.submit_type == "resubmit") {
          if (
            (req.body[`last_status_${i}`] || "").toLowerCase().trim() ===
            "additional document required"
          ) {
            console.log(req.body[`last_status_${i}`]);
            info["status"] = "Re Submited";
          }
        } else {
          info["status"] = req.body.submit_type;
        }

        if (!req.body.mylastappliedid || req.body.mylastappliedid === "") {
          info["refrense_no"] = reference_no;
        }
        if (req.files) {
          // Handle files for each applicant
          const fileFields = [
            "front_passport_img",
            "back_passport_img",
            "traveler_photo",
            "pen_card_photo",
            "created_file",
            "additional_folder",
            "hotal",
          ];
          fileFields.forEach((field) => {
            const fileKey = `${field}_${i}`;
            if (req.files[fileKey]) {
              info[field] =
                "applied_visa_document/" + req.files[fileKey][0].filename;
            }
          });
        }

        applicants.push(info);
      }
    } catch (error) {
      console.error(`Error processing applicant ${i}:`, error.message);
    }
  }

  // If no bulk, fallback to single (for backward compatibility)
  // if (applicants.length === 0 && req.body.user_id) {
  //   const info = {
  //     reference_no: reference_no,
  //     user_id: req.body.user_id,
  //     visa_id: req.body.visa_id,
  //     visa_type: req.body.visa_type,
  //     internal_ID: req.body.internal_ID,
  //     group_name: req.body.group_name,
  //     passport_no: req.body.passport_no,
  //     first_name: req.body.first_name,
  //     last_name: req.body.last_name,
  //     nationality: req.body.nationality,
  //     sex: req.body.sex,
  //     dob: req.body.dob,
  //     pen_card_no: req.body.pen_card_no,
  //     additional_question: req.body.additional_question,
  //     is_insurance: req.body.is_insurance,
  //     motherName: req.body.motherName,
  //     fatherName: req.body.fatherName,
  //     placeOfBirth: req.body.placeOfBirth,
  //     spouseName: req.body.spouseName,
  //     travelDate: req.body.travelDate,
  //     returnDate: req.body.returnDate,
  //     entryPoint: req.body.entryPoint,
  //     exitPoint: req.body.exitPoint,
  //     additional_folder_label: req.body.additional_folder_label,
  //     amount: req.body.amount,
  //     hotal_name: req.body.hotal_name,
  //     working_status: "In Process",
  //     status: "In Process",
  //   };

  //   if (req.files) {
  //     if (req.files.front_passport_img) {
  //       info.front_passport_img =
  //         "applied_visa_document/" + req.files.front_passport_img[0].filename;
  //     }
  //     if (req.files.back_passport_img) {
  //       info.back_passport_img =
  //         "applied_visa_document/" + req.files.back_passport_img[0].filename;
  //     }
  //     if (req.files.traveler_photo) {
  //       info.traveler_photo =
  //         "applied_visa_document/" + req.files.traveler_photo[0].filename;
  //     }
  //     if (req.files.pen_card_photo) {
  //       info.pen_card_photo =
  //         "applied_visa_document/" + req.files.pen_card_photo[0].filename;
  //     }
  //     if (req.files.created_file) {
  //       info.created_file =
  //         "applied_visa_document/" + req.files.created_file[0].filename;
  //     }
  //     if (req.files.additional_folder) {
  //       info.additional_folder =
  //         "applied_visa_document/" + req.files.additional_folder[0].filename;
  //     }
  //     if (req.files.hotal) {
  //       info.hotal = "applied_visa_document/" + req.files.hotal[0].filename;
  //     }
  //   }

  //   applicants.push(info);
  // }

  // Bulk create all applicants
  if (applicants.length > 0) {
    // Create applied_visa_files entry for each applicant
    // for (const applicant of applicants) {
    if (!req.body.mylastappliedid || req.body.mylastappliedid === "") {
      await applied_visa_files.create({
        refrense_no: reference_no,
        user_id: applicants[0].user_id,
        visa_id: applicants[0].visa_id,
        citizen_id: applicants[0].citizen_id || null,
      });
      await Applied_visaModel.bulkCreate(applicants);
    } else {
      const alreadyvisafiles = await applied_visa_files.findOne({
        where: { id: req.body.mylastappliedid },
      });
      const updateIds = applicants.map((applicant) => applicant.mylastid);

      await Applied_visaModel.update(
        { status: "deleted" }, // Replace with actual field and value
        {
          where: {
            refrense_no: alreadyvisafiles.refrense_no,
            id: {
              [Op.notIn]: updateIds,
            },
          },
        }
      );
      for (const applicant of applicants) {
        const updateid = applicant.mylastid;
        delete applicant.mylastid;
        if (req.body.submit_type == "resubmit") {
          delete applicant.amount;
        }
        await Applied_visaModel.update(applicant, {
          where: { id: updateid },
        });
      }
    }
  }

  try {
    if (req.body.id) {
      await Applied_visaModel.update(info, { where: { id: req.body.id } });


      return res
        .status(200)
        .send({ status: true, message: "Applied Visa Update successfully" });
    } else {
      info.working_status = "In Process";
      info.status = "In Process";

      await Applied_visaModel.create(info);

      const settingdata = await SettingModel.findOne({ where: { id: "1" } });

      const applieduserdata = await UserModel.findOne({
        where: { id: req.body.user_id },
      });

      const visaData = await VisaModel.findOne({
        where: { id: req.body.visa_id },
      });


      // Determine action type for email display
      const actionType =
        req.body.submit_type === "apply" ? "Applied" : "Resubmitted";

      // === Always send email to Agent (both apply & resubmit) ===
      const agentEmailHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visa Application ${actionType}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #ececf2; margin: 0; padding: 0;">
    <table style="width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px;">
        <!-- Header Section -->
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #ffa85d; color: #ffffff; border-radius: 8px 8px 0 0;">
                <img src="https://vivantravels.com/static/media/logo.7d19d5194296db63d18a.png" alt="Vivan Travels Logo" style="max-width: 150px; margin-bottom: 10px;">
                <h1 style="margin: 0;">Visa Application ${actionType}</h1>
            </td>
        </tr>
        <!-- Content Section -->
        <tr>
            <td style="padding: 20px;">
                <p style="margin: 0 0 10px; font-size: 16px; color: #333333;">Dear Team,</p>
                <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">
                    A visa application has been <strong>${actionType.toLowerCase()}</strong> by <strong>${info.first_name} ${info.last_name}</strong>.
                </p>
                <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">Application Details:</p>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr><td style="padding: 8px; border: 1px solid #dddddd;">Reference Number:</td><td style="padding: 8px; border: 1px solid #dddddd;">${info.refrense_no}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #dddddd;">Visa Type:</td><td style="padding: 8px; border: 1px solid #dddddd;">${info.visa_type}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #dddddd;">Description:</td><td style="padding: 8px; border: 1px solid #dddddd;">${visaData.description}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #dddddd;">Passport Number:</td><td style="padding: 8px; border: 1px solid #dddddd;">${info.passport_no}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #dddddd;">Nationality:</td><td style="padding: 8px; border: 1px solid #dddddd;">${info.nationality}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #dddddd;">Visa Validity:</td><td style="padding: 8px; border: 1px solid #dddddd;">${visaData.validity}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #dddddd;">Visa Duration:</td><td style="padding: 8px; border: 1px solid #dddddd;">${visaData.duration}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #dddddd;">Processing Time:</td><td style="padding: 8px; border: 1px solid #dddddd;">${visaData.processing_time}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #dddddd;">Visa Fee:</td><td style="padding: 8px; border: 1px solid #dddddd;">${visaData.amount}</td></tr>
                </table>
                <p style="font-size: 16px; color: #333333;">Please review and take necessary action.</p>
            </td>
        </tr>
        <!-- Footer -->
        <tr>
            <td style="padding: 20px; background-color: #f4f4f4; text-align: center; border-radius: 0 0 8px 8px;">
                <p style="margin: 0; font-size: 14px; color: #666666;">Website: <a href="https://vivantravels.com" style="color: #ffa85d;">vivantravels.com</a></p>
                <p style="margin: 0; font-size: 14px; color: #666666;">Contact: ${settingdata.support_no}</p>
                <p style="margin: 10px 0 0; font-size: 14px; color: #666666;">&copy; 2025 Vivan Travels. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>`;

      // Send to Agent (always)
      visasendMail(
        "Visas@vivantravels.com",
        `Visa Application ${actionType}`,
        agentEmailHtml
      );


      // === Send to user only when 'apply' ===
      if (req.body.submit_type === "apply") {
        const userEmailHtml = `<!DOCTYPE html>
  <html>
  <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Visa Application Received</title></head>
  <body style="font-family: Arial, sans-serif; background-color: #ececf2; margin: 0; padding: 0;">
      <table style="width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px;">
          <tr>
              <td style="padding: 20px; text-align: center; background-color: #ffa85d; color: #ffffff; border-radius: 8px 8px 0 0;">
                  <img src="https://vivantravels.com/static/media/logo.7d19d5194296db63d18a.png" alt="Vivan Travels Logo" style="max-width: 150px; margin-bottom: 10px;">
                  <h1 style="margin: 0;">Visa Application Received</h1>
              </td>
          </tr>
          <tr>
              <td style="padding: 20px;">
                  <p style="font-size: 16px;">Dear ${info.first_name} ${info.last_name},</p>
                  <p style="font-size: 16px;">Thank you for submitting your visa application. We have received your request and it is currently under review.</p>
                  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                      <tr><td style="padding: 8px; border: 1px solid #dddddd;">Reference Number:</td><td style="padding: 8px; border: 1px solid #dddddd;">${info.refrense_no}</td></tr>
                      <tr><td style="padding: 8px; border: 1px solid #dddddd;">Visa Type:</td><td style="padding: 8px; border: 1px solid #dddddd;">${info.visa_type}</td></tr>
                      <tr><td style="padding: 8px; border: 1px solid #dddddd;">Description:</td><td style="padding: 8px; border: 1px solid #dddddd;">${visaData.description}</td></tr>
                  </table>
                  <p style="font-size: 16px;">Our team will review your application and notify you of any updates via email.</p>
              </td>
          </tr>
          <tr>
              <td style="padding: 20px; background-color: #f4f4f4; text-align: center; border-radius: 0 0 8px 8px;">
                  <p style="margin: 0; font-size: 14px; color: #666666;">Website: <a href="https://vivantravels.com" style="color: #ffa85d;">vivantravels.com</a></p>
                  <p style="margin: 0; font-size: 14px; color: #666666;">Contact: ${settingdata.support_no}</p>
                  <p style="margin: 10px 0 0; font-size: 14px; color: #666666;">&copy; 2025 Vivan Travels. All rights reserved.</p>
              </td>
          </tr>
      </table>
  </body>
  </html>`;

        visasendMail(
          applieduserdata.email,
          "Visa Application Received",
          userEmailHtml
        );
      }

      return res
        .status(200)
        .send({ status: true, message: "Visa applied successfully" });
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Failed to processing request",
      error: error.message,
    });
  }
}

async function applied_list(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  const page = parseInt(req.body.page) || 1;
  const limit = parseInt(req.body.limit) || 10;
  const offset = (page - 1) * limit;
  const whereClause = {};
  let userWhereCondition = {};
  // Always exclude deleted
  const baseStatusCondition = { [Op.ne]: "deleted" };

  // Handle Tab filters
  if (req.body.Tab === "draft") {
    whereClause.status = {
      [Op.and]: [baseStatusCondition, { [Op.eq]: "draft" }],
    };
  } else if (req.body.Tab === "applied") {
    whereClause.status = {
      [Op.and]: [baseStatusCondition, { [Op.ne]: "draft" }],
    };
  } else if (req.body.status) {
    // Custom status filter
    whereClause.status = {
      [Op.and]: [baseStatusCondition, { [Op.like]: `%${req.body.status}%` }],
    };
  } else {
    // Default case: just exclude deleted
    whereClause.status = baseStatusCondition;
  }

  if (req.body.isadmin !== "yes") {
    whereClause.user_id = req.user.id;
  } else {
    whereClause.status = {
      [Op.and]: [baseStatusCondition, { [Op.ne]: "draft" }],
    };
  }
  if (req.body.mobile_no) {
    userWhereCondition = {
      [Op.or]: [{ mobile_no: { [Op.like]: `${req.body.mobile_no}%` } }],
    };
  }
  let appliedvisaWhereCondition = {};
  // if (req.body.mobile_no) {
  //   appliedvisaWhereCondition = {
  //     [Op.or]: [{ mobile_no: { [Op.like]: `${req.body.mobile_no}%` } }],
  //   };
  // }
  const going_from = req.body.going_from || "";
  const going_to = req.body.going_to || "";
  if (going_from || going_to) {
    appliedvisaWhereCondition = {
      [Op.or]: [
        ...(going_from
          ? [{ going_from: { [Op.like]: `${going_from}%` } }]
          : []),
        ...(going_to ? [{ going_to: { [Op.like]: `${going_to}%` } }] : []),
      ],
    };
  }
  try {
    const { count, rows: list } = await applied_visa_files.findAndCountAll({
      offset,
      limit,
      distinct: true,
      include: [
        {
          model: Applied_visaModel,
          as: "applied_visa_list",
          required: true,
          where: whereClause,
        },
        {
          model: UserModel,
          as: "visa_applied_user",
          required: true,
          where: userWhereCondition,
          include: [
            {
              model: Agent,
              as: "agents",
            },
          ],
        },
        {
          model: VisaModel,
          as: "appliedvisa",
          where: appliedvisaWhereCondition,
          required: true,
          include: [
            {
              model: VisaAgentCharges,
              as: "visa_agent_charges",
              where: { agent_id: req.user.id },
              required: false,
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // const { count, rows: list } = await Applied_visaModel.findAndCountAll({
    //   where: whereClause,
    //   offset: offset,
    //   limit: limit,
    //   include: [
    //     {
    //       model: UserModel,
    //       as: "applieduser",
    //       required: true,
    //       where: userWhereCondition,
    //       include: [
    //         {
    //           model: Agent,
    //           as: "agents",
    //         },
    //       ],
    //     },
    //     {
    //       model: VisaModel,
    //       as: "appliedvisa",
    //       where: appliedvisaWhereCondition,
    //       required: true,
    //     },
    //   ],
    //   order: [["createdAt", "DESC"]],
    // });
    // const { count, rows: list } = await applied_visa_files.findAndCountAll({
    //   offset: offset,
    //   limit: limit,
    //   include: [
    //     {
    //       model: Applied_visaModel,
    //       as: "applied_visa_users",
    //       required: true,
    //       // where: whereClause,
    //       include: [
    //         {
    //           model: UserModel,
    //           as: "applieduser",
    //           required: true,
    //           // where: userWhereCondition,
    //           include: [
    //             {
    //               model: Agent,
    //               as: "agents",
    //             },
    //           ],
    //         },
    //         {
    //           model: VisaModel,
    //           as: "appliedvisa",
    //           where: appliedvisaWhereCondition,
    //           required: true,
    //         },
    //       ],
    //     },
    //   ],
    //   order: [["createdAt", "DESC"]],
    // });
    res.status(200).send({
      status: true,
      message: "Data retrieved successfully",
      data: list,
      pagination: {
        totallist: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        limit: limit,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "An error occurred while retrieving data",
      error: error.message,
    });
  }
}

async function update_applied_status(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(403).json({ errors: errors.array() });
    }
    let image = "";
    let image_final = "";
    let insurance_file = "";
    if (req.files) {
      if (req.files.created_file) {
        image = "applied_visa_document/" + req.files.created_file[0].filename;
      }
      if (req.files.insurance_file) {
        insurance_file =
          "applied_visa_document/" + req.files.insurance_file[0].filename;
      }
    }

    let savePath = "";
    if (image !== "") {
      const data = await SettingModel.findOne({ where: { id: "1" } });
      if (data.aitool_url) {
        const response = await axios.get(data.aitool_url, {
          headers: {
            "Content-Type": "application/json",
            username: data.aitool_username,
            password: data.aitool_password,
            url: "https://api.vivantravels.com/public/" + image,
          },
          responseType: "arraybuffer",
        });
        //  .then((response) => {
        // Example byte data (replace this with your actual API response data)
        const fileData = Buffer.from(response.data, "binary"); // Example byte buffer
        const fileName =
          "applied_visa_document/" +
          "visa_" +
          req.files.created_file[0].filename; // File name to save
        savePath = path.join(__dirname, "../public/", fileName); // Path to save the file

        try {
          await fs.promises.writeFile(savePath, fileData);
          image_final = fileName;
          console.log(`File saved successfully to ${savePath}`);
        } catch (err) {
          console.error("Error saving the file:", err);
        }
      } else {
        image_final = image;
      }
      //  })
      //  .catch((error) => {
      //    console.error("Error:", error);
      //  });

      if (image_final !== "" && req.body.status == "Approved") {
        const settingdata = await SettingModel.findOne({ where: { id: "1" } });
        const applieddatamodeldata = await Applied_visaModel.findOne({
          where: { id: req.body.id },
        });
        const applieduserdata = await UserModel.findOne({
          where: { id: applieddatamodeldata.user_id },
        });
        const emailHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visa Application Approved</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #ececf2; margin: 0; padding: 0;">
    <table style="width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px;">
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #ffa85d; color: #ffffff; border-radius: 8px 8px 0 0;">
                <img src="https://vivantravels.com/static/media/logo.7d19d5194296db63d18a.png" alt="Vivan Travels Logo" style="max-width: 150px; margin-bottom: 10px;">
                <h1 style="margin: 0;">Visa Application Approved</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
                <p style="margin: 0 0 10px; font-size: 16px; color: #333333;">Dear ${applieddatamodeldata.first_name},</p>
                <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">Congratulations! Your visa application has been approved. The approved visa document is attached to this email for your convenience.</p>
                <p style="margin: 20px 0 0; font-size: 16px; color: #333333;">Thank you for choosing our services. We look forward to assisting you again in the future.</p>
                <p style="margin: 10px 0 0; font-size: 14px; color: #666666;">If you have any questions, feel free to contact us.</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; background-color: #f4f4f4; text-align: center; border-radius: 0 0 8px 8px;">
                <p style="margin: 0; font-size: 14px; color: #666666;">Website: <a href="https://vivantravels.com" style="color: #ffa85d; text-decoration: none;">vivantravels.com</a></p>
                <p style="margin: 0; font-size: 14px; color: #666666;">Contact: ${settingdata.support_no}</p>
                <p style="margin: 10px 0 0; font-size: 14px; color: #666666;">&copy; 2025 Vivan Travels. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>`;
        const filenameforsend = `${applieddatamodeldata.first_name}-visa.pdf`;
        visasendMail(
          applieduserdata.email,
          "Visa Application Approved",
          emailHtml,
          [{ filename: filenameforsend, path: savePath }]
        );
      }
    }

    if (req.body.status == "Rejected") {
      const settingdata = await SettingModel.findOne({ where: { id: "1" } });
      const applieddatamodeldata = await Applied_visaModel.findOne({
        where: { id: req.body.id },
      });
      const applieduserdata = await UserModel.findOne({
        where: { id: applieddatamodeldata.user_id },
      });
      const emailHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visa Application Rejected</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #ececf2; margin: 0; padding: 0;">
    <table style="width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px;">
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #ffa85d; color: #ffffff; border-radius: 8px 8px 0 0;">
                <img src="https://vivantravels.com/static/media/logo.7d19d5194296db63d18a.png" alt="Vivan Travels Logo" style="max-width: 150px; margin-bottom: 10px;">
                <h1 style="margin: 0;">Visa Application Approved</h1>
            </td>
        </tr>
        <tr>
			 <td style="padding: 20px;">
                <p style="margin: 0 0 10px; font-size: 16px; color: #333333;">Dear ${applieddatamodeldata.first_name},</p>
                <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">We regret to inform you that your visa application has been rejected. Please review the reason below:</p>
                <p style="margin: 0 0 20px; font-size: 16px; font-weight: bold; color: #ff5d5d;">${req.body.remark}</p>
                <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">If you have any questions or need further clarification, you can reply directly to this email or send an email to <a href="mailto:${settingdata.support_email}" style="color: #ff5d5d; text-decoration: none;">${settingdata.support_email}</a>.</p>
			</td>

        </tr>
        <tr>
            <td style="padding: 20px; background-color: #f4f4f4; text-align: center; border-radius: 0 0 8px 8px;">
                <p style="margin: 0; font-size: 14px; color: #666666;">Website: <a href="https://vivantravels.com" style="color: #ffa85d; text-decoration: none;">vivantravels.com</a></p>
                <p style="margin: 0; font-size: 14px; color: #666666;">Contact: ${settingdata.support_no}</p>
                <p style="margin: 10px 0 0; font-size: 14px; color: #666666;">&copy; 2025 Vivan Travels. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>`;
      visasendMail(
        applieduserdata.email,
        "Visa Application Rejected",
        emailHtml
      );
    }
    //await Applied_visaModel.update(
    //  image == "" || image_final == ""
    //    ? { status: req.body.status, remark: req.body.remark }
    //    : {
    //      created_file_orignal: image,
    //      created_file: image_final,
    //      insurance_file: insurance_file ? insurance_file : null,
    //      status: req.body.status,
    //      remark: req.body.remark,
    //    },
    //  { where: { id: req.body.id } }
    //);
    let updateData = {
      status: req.body.status,
      remark: req.body.remark,
    };

    // Conditionally add fields
    if (image !== "") {
      updateData.created_file_orignal = image;
    }

    if (image_final !== "") {
      updateData.created_file = image_final;
    }

    if (insurance_file) {
      updateData.insurance_file = insurance_file;
    }

    // If insurance_file is not uploaded and already exists in DB, keep it unchanged.
    // Optional: Set explicitly to null if required
    if (!insurance_file) {
      updateData.insurance_file = null;
    }

    await Applied_visaModel.update(updateData, {
      where: { id: req.body.id },
    });

    // try {
    //     await VisaModel.update(
    //         { working_status: req.body.status },
    //         { where: { id: req.body.id } }
    //     );

    res.status(200).send({
      status: true,
      message: "Visa " + req.body.status + " Successfully",
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Internal server error",
      error: err?.message || err,
    });
  }
}

async function applied_visa_details(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  const response = await Applied_visaModel.findOne({
    where: { id: req.body.id },
  });
  if (!response) {
    return res.status(403).send({ status: true, message: "Details not found" });
  } else {
    return res.status(200).send({
      status: true,
      message: "Details get successfully",
      data: response,
    });
  }
}

async function save_as_draft(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }

  const info = {
    refrense_no:
      Math.floor(Math.random() * (999999999 - 111111111 + 1)) + 111111111,
    user_id: req.body.user_id,
    visa_id: req.body.visa_id,
    visa_type: req.body.visa_type,
    internal_ID: req.body.internal_ID,
    group_name: req.body.group_name,
    passport_no: req.body.passport_no,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    nationality: req.body.nationality,
    sex: req.body.sex,
    dob: req.body.dob,
    pen_card_no: req.body.pen_card_no,
    additional_question: req.body.additional_question,
    is_insurance: req.body.is_insurance,
    motherName: req.body.motherName,
    fatherName: req.body.fatherName,
    placeOfBirth: req.body.placeOfBirth,
    spouseName: req.body.spouseName,
    travelDate: req.body.travelDate,
    // returnDate: req.body.returnDate,
    entryPoint: req.body.entryPoint,
    exitPoint: req.body.exitPoint,
    additional_folder_label: req.body.additional_folder_label,
    amount: req.body.amount,
    hotal_name: req.body.hotal_name,
  };

  if (req.files) {
    if (req.files.front_passport_img) {
      info.front_passport_img =
        "applied_visa_document/" + req.files.front_passport_img[0].filename;
    }
    if (req.files.back_passport_img) {
      info.back_passport_img =
        "applied_visa_document/" + req.files.back_passport_img[0].filename;
    }
    if (req.files.traveler_photo) {
      info.traveler_photo =
        "applied_visa_document/" + req.files.traveler_photo[0].filename;
    }
    if (req.files.pen_card_photo) {
      info.pen_card_photo =
        "applied_visa_document/" + req.files.pen_card_photo[0].filename;
    }
    if (req.files.created_file) {
      info.created_file =
        "applied_visa_document/" + req.files.created_file[0].filename;
    }
    if (req.files.additional_folder) {
      info.additional_folder =
        "applied_visa_document/" + req.files.additional_folder[0].filename;
    }
    if (req.files.hotal) {
      info.hotal = "applied_visa_document/" + req.files.hotal[0].filename;
    }
  }

  try {
    info.working_status = "Draft";
    info.status = "Draft";
    await Applied_visaModel.create(info);
    return res
      .status(200)
      .send({ status: true, message: "Visa saved successfully" });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Failed to processing request",
      error: error.message,
    });
  }
}

async function visa_delete(req, res) {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ status: false, message: "ID is required" });
  }

  try {
    await applied_visa_files.destroy({ where: { refrense_no: id } });
    await Applied_visaModel.destroy({ where: { refrense_no: id } });
    res
      .status(200)
      .send({ status: true, message: `Record deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
}

module.exports = {
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
  get_applied_visa_details,
  save_as_draft,
  visa_delete,
};
