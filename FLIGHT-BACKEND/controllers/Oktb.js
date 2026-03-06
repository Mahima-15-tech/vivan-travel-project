const { validationResult, Result } = require("express-validator");
const OktbModel = require("../models").oktb;
const { Sequelize, Op, fn, col } = require('sequelize');
const UserModel = require("../models").users;
const SettingModel = require("../models").setting;
const { sendMail } = require("../helpers/send_mail");


const AirlineModel = require("../models").airline;
const AirlinepriceModel = require("../models").airlineprice;

async function add(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(403).json({ errors: errors.array() });
    }
    const settingdata = await SettingModel.findOne({ where: { id: "1" } });

    const info = {
        refrense_no: Math.floor(Math.random() * (999999999 - 111111111 + 1)) + 111111111,
        user_id: req.body.user_id,
        country: req.body.country,
        name: req.body.name,
        pnr: req.body.pnr,
        dob: req.body.dob,
        airlines: req.body.airlines,
        amount: req.body.amount,
        otb_type: req.body.otb_type,
    };

    if (req.files) {
        if (req.files.passport_font_side) {
            info.passport_font_side = "oktb_document/" + req.files.passport_font_side[0].filename;
        }
        if (req.files.passport_back_side) {
            info.passport_back_side = "oktb_document/" + req.files.passport_back_side[0].filename;
        }
        if (req.files.visa) {
            info.visa = "oktb_document/" + req.files.visa[0].filename;
        }
        if (req.files.from_ticket) {
            info.from_ticket = "oktb_document/" + req.files.from_ticket[0].filename;
        }
        if (req.files.to_ticket) {
            info.to_ticket = "oktb_document/" + req.files.to_ticket[0].filename;
        }
        if (req.files.group_zip) {
            info.group_zip = "oktb_document/" + req.files.group_zip[0].filename;
        }
    }
    info.working_status = 'In Process';
    info.status = 'In Process';
    try {
        if (req.body.id) {
            await OktbModel.update(info, { where: { id: req.body.id } });
            return res.status(200).send({ status: true, message: 'OTB Update successfully' });
        } else {
            await OktbModel.create(info);

            const emailHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTB Application Submitted</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #ececf2; margin: 0; padding: 0;">
    <table style="width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px;">
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #ffa85d; color: #ffffff; border-radius: 8px 8px 0 0;">
                <img src="https://vivantravels.com/static/media/logo.7d19d5194296db63d18a.png" alt="Vivan Travels Logo" style="max-width: 150px; margin-bottom: 10px;">
                <h1 style="margin: 0;">OTB Application Submitted</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
                <p style="margin: 0 0 10px; font-size: 16px; color: #333333;">Dear ${req.body.name},</p>
                <p style="margin: 0 0 15px; font-size: 16px; color: #333333;">
                    Your <b>OTB (OK To Board)</b> application has been <b>successfully submitted</b> and is currently under process.
                </p>
                <table style="width:100%; border-collapse: collapse; margin-top: 15px;">
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; font-size: 15px;">Reference No:</td>
                        <td style="padding: 8px; border: 1px solid #ddd; font-size: 15px;">${info.refrense_no}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">PNR:</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${req.body.pnr}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">Airline:</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${req.body.airlines}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">Country:</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${req.body.country}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">Amount:</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">₹${req.body.amount}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">Status:</td>
                        <td style="padding: 8px; border: 1px solid #ddd;"><b>In Process</b></td>
                    </tr>
                </table>
                <p style="margin: 20px 0 0; font-size: 16px; color: #333333;">
                    Thank you for choosing <b>Vivan Travels</b>. We will notify you once your OTB is approved.
                </p>
                <p style="margin: 10px 0 0; font-size: 14px; color: #666666;">
                    If you have any questions, feel free to contact us.
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; background-color: #f4f4f4; text-align: center; border-radius: 0 0 8px 8px;">
                <p style="margin: 0; font-size: 14px; color: #666666;">
                    Website: <a href="https://vivantravels.com" style="color: #ffa85d; text-decoration: none;">vivantravels.com</a>
                </p>
                <p style="margin: 0; font-size: 14px; color: #666666;">Contact: ${settingdata?.support_no || "N/A"}</p>
                <p style="margin: 10px 0 0; font-size: 14px; color: #666666;">&copy; 2025 Vivan Travels. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>`;


            if (req.body.email) {
                await sendMail(
                    req.body.email,
                    "OTB Application Submitted Successfully",
                    emailHtml
                );
            }


            // Send to Agent (if agent email available)
            const agentEmailHtml = emailHtml.replace(
                `Dear ${req.body.name}`,
                `Dear Agent,`
            );

            await sendMail(
                'Visas@vivantravels.com',
                "A New OTB Application Submitted by Your Client",
                agentEmailHtml
            );


            return res.status(200).send({ status: true, message: 'OTB Create successfully' });
        }
    } catch (error) {
        res.status(500).send({ status: false, message: 'Failed to processing request', error: error.message });
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

    const mobile_no = req.body.mobile_no || '';
    const email = req.body.email || "";

    let userWhereCondition = {};
    if (mobile_no || email) {
        //   userWhereCondition[Op.or] = [];

        //   if (mobile_no) {
        //     userWhereCondition[Op.or].push({
        //       mobile_no: { [Op.like]: `${mobile_no}%` },
        //     });
        //   }

        //   if (email) {
        //     userWhereCondition[Op.or].push({ email: { [Op.like]: `${email}%` } });
        //   }
        userWhereCondition = {
            [Op.or]: [
                ...(mobile_no ? [{ mobile_no: { [Op.like]: `${mobile_no}%` } }] : []),
                ...(email ? [{ email: { [Op.like]: `${email}%` } }] : []),
            ],
        };
        // }
    }
    const { pnr, airlines, user_id, status } = req.body;
    const whereClause = {};
    if (pnr) {
        whereClause.pnr = { [Op.like]: `%${pnr}%` };
    }
    if (airlines) {
        whereClause.airlines = { [Op.like]: `%${airlines}%` };
    }
    if (user_id) {
        whereClause.user_id = { [Op.like]: `%${user_id}%` };
    }
    if (status) {
        whereClause.status = { [Op.like]: `%${status}%` };
    }


    try {
        const { count, rows: list } = await OktbModel.findAndCountAll({
            where: whereClause,
            offset: offset,
            limit: limit,
            include: [
                {
                    model: UserModel,
                    as: 'applieduser',
                    required: true,
                    where: userWhereCondition,
                },
                {
                    model: AirlineModel,
                    as: 'airlinedata',   // 👈 ab sahi se chalega
                    required: true,
                }
            ],

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

async function applied_list(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(403).json({ errors: errors.array() });
    }
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const { count, rows: list } = await OktbModel.findAndCountAll({
            where: { user_id: req.body.id },
            offset: offset,
            limit: limit,
            include: [
                {
                    model: UserModel,
                    as: 'applieduser',
                    required: true,
                },
                {
                    model: AirlineModel,
                    as: "airlinedata",
                    required: true,
                    include: [
                        {
                            model: AirlinepriceModel,
                            as: "prices",
                            required: true,
                        },
                    ],
                    //   AirlinepriceModel,
                },
            ],
            order: [['createdAt', 'DESC']],
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

    if (req.body.travelDate == req.body.returnDate) {
        return res.status(403).send({
            status: false,
            message: "Please select diffrent date to travel Date"
        });
    }

    try {
        const { count, rows: list } = await VisaModel.findAndCountAll({
            where: {
                [Op.and]: [
                    Sequelize.where(fn('LOWER', col('going_from')), req.body.going_from.toLowerCase()),
                    Sequelize.where(fn('LOWER', col('going_to')), req.body.going_to.toLowerCase())
                ],
                status: 'Active',
            },
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

async function delet(req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(403).json({ errors: errors.array() });
    }

    await VisaModel.destroy({ where: { id: req.body.id } });
    res.status(200).send({ status: true, message: `Record Delete successfully`, });
}

async function update_status(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(403).json({ errors: errors.array() });
    }
    let image = "";
    if (req.files) {
        if (req.files.created_file) {
            image = "applied_visa_document/" + req.files.created_file[0].filename;
        }
    }
    //   try {
    //     await Applied_visaModel.update(
    //       image == ""
    //         ? { status: req.body.status }
    //         : { created_file: image, status: req.body.status },
    //       { where: { id: req.body.id } }
    //     );
    try {
        await OktbModel.update(
            image == ""
                ? { working_status: req.body.status }
                : { created_file: image, working_status: req.body.status },
            { where: { id: req.body.id } }
        );

        res.status(200).send({ status: true, message: "OTB " + req.body.status + " Successfully" });
    } catch (err) {
        res.status(500).send({ status: false, message: "Internal server error" });
    }

}

async function get_details(req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(403).json({ errors: errors.array() });
    }

    const response = await OktbModel.findOne({
        where: { id: req.body.id }
    });
    if (!response) {
        return res.status(403).send({ status: true, message: 'Details not found' });
    } else {
        return res.status(200).send({
            status: true,
            message: "Details get successfully",
            data: response
        });
    }
}

module.exports = {
    add,
    list,
    search,
    delet,
    update_status,
    get_details,
    applied_list
};