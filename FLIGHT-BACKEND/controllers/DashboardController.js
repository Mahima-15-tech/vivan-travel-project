const UsersModel = require("../models").users;
const visaModel = require("../models").visa;
const AgentModel = require("../models").agent;
const applied_visaModel = require("../models").applied_visa;
const oktbModel = require("../models").oktb;
const languageModel = require("../models").language;

const { Op } = require('sequelize');

async function home(req, res) {
    const { statistics_type } = req.body;

    let dateFilter = {};

    if (statistics_type === 'today') {
        dateFilter = {
            createdAt: {
                [Op.gte]: new Date().setHours(0, 0, 0, 0), // Start of today
                [Op.lt]: new Date().setHours(23, 59, 59, 999) // End of today
            }
        };
    } else if (statistics_type === 'this_month') {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        dateFilter = {
            createdAt: {
                [Op.gte]: startOfMonth,
                [Op.lt]: endOfMonth
            }
        };
    }

    try {
                const totalusers = await UsersModel.count({
          where: { ...dateFilter, type:1 },
        });
        const total_visa = await visaModel.count({ where: dateFilter });
        const total_agent = await AgentModel.count({ where: dateFilter });
        const total_avis = await applied_visaModel.count({ where: dateFilter });
        const total_oktb = await oktbModel.count({ where: dateFilter });
        /// visa
        const visainprocess = await applied_visaModel.count({
          where: {
            ...dateFilter,
            status: "In Process",
          },
        });
        const visaadd_doc_req = await applied_visaModel.count({
          where: {
           ...dateFilter,
            status: "Additional Document Required",
          },
        });
        const visareject = await applied_visaModel.count({
          where: {
           ...dateFilter,
            status: "Reject",
          },
        });
        const visa_approved = await applied_visaModel.count({
          where: {
           ...dateFilter,
            status: "Approved",
          },
        });

        ///OKTB
        const oktbinprocess = await oktbModel.count({
          where: {
            ...dateFilter,
            working_status: "In Process",
          },
        });
        const oktbadd_doc_req = await oktbModel.count({
          where: {
            ...dateFilter,
            working_status: "Additional Document Required",
          },
        });
        const oktbreject = await oktbModel.count({
          where: {
            ...dateFilter,
            working_status: "Rejected",
          },
        });
        const oktb_approved = await oktbModel.count({
          where: {
            ...dateFilter,
            working_status: "Approved",
          },
        });
        const oktb_onhold = await oktbModel.count({
          where: {
            ...dateFilter,
            working_status: "On Hold",
          },
        });

        res.status(200).send({
          status: true,
          message: "Data retrieved successfully",
          data: {
            totalusers: totalusers,
            total_visa: total_visa,
            total_avis: total_avis,
            total_oktb: total_oktb,
            total_agent: total_agent,
            visainprocess: visainprocess,
            visaadd_doc_req: visaadd_doc_req,
            visareject: visareject,
            visa_approved: visa_approved,
            oktbinprocess: oktbinprocess,
            oktbadd_doc_req: oktbadd_doc_req,
            oktbreject: oktbreject,
            oktb_approved: oktb_approved,
            oktb_onhold: oktb_onhold,
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

module.exports = {
    home
};