const { validationResult, Result } = require("express-validator");
const LanguageModel = require("../models").language;
const mime = require('mime-types');

async function add(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(403).json({ errors: errors.array() });
    }
    const info = { name: req.body.name, status: 'Active' };

    if (req.file) {
        info['icon'] = req.body.folder + "/" + req.file.filename;
    }
    try {
        if (req.body.id) {
            await LanguageModel.update(info, { where: { id: req.body.id } });
        } else {
            await LanguageModel.create(info);
        }

        res.status(200).send({ status: true, message: 'Language added successfully' });
    } catch (error) {
        res.status(500).send({ status: false, message: 'Failed to add Language', error: error.message });
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
    const totaldata = await LanguageModel.count();
    try {
        const data = await LanguageModel.findAll({
            offset: offset,
            limit: limit,
        });

        res.status(200).send({
            status: true,
            message: "Data retrieved successfully",
            data: data,
            pagination: {
                totallist: totaldata,
                currentPage: page,
                totalPages: Math.ceil(totaldata / limit),
                pageSize: limit,
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

    await LanguageModel.destroy({ where: { id: req.body.id } });
    res.status(200).send({ status: true, message: `Language Delete successfully`, });
}

module.exports = {
    add,
    list,
    delet,
};

