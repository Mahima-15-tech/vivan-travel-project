const { validationResult, Result } = require("express-validator");
const QuestionModel = require("../models").question;
const SubmitedQuestionModal = require("../models").submitedquestion;
const { Sequelize, Op } = require('sequelize');

async function add(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(403).json({ errors: errors.array() });
    }

    const info = {
        question: req.body.question,
        answer: req.body.answer,
        option: req.body.option,
        private: req.body.private,
        status: 'Active'
    };

    try {
        if (req.body.id) {
            await QuestionModel.update(info, { where: { id: req.body.id } });
        } else {
            await QuestionModel.create(info);
        }

        res.status(200).send({ status: true, message: 'Question added successfully' });
    } catch (error) {
        res.status(500).send({ status: false, message: 'Failed to add Question', error: error.message });
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

    try {
        // Fetch the IDs of questions that the user has already submitted answers for
        const submittedQuestions = await SubmitedQuestionModal.findAll({
            where: { user_id: req.user.id },
            attributes: ['question_id'],
        });

        // Extract the question IDs into an array
        const submittedQuestionIds = submittedQuestions.map(sq => sq.question_id);

        // Fetch the total number of questions excluding those that are already submitted
        const totaldata = await QuestionModel.count({
            where: {
                id: {
                    [Sequelize.Op.notIn]: submittedQuestionIds
                }
            }
        });

        // Fetch the questions with pagination and excluding submitted questions
        const data = await QuestionModel.findAll({
            where: {
                id: {
                    [Sequelize.Op.notIn]: submittedQuestionIds
                }
            },
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

    await QuestionModel.destroy({ where: { id: req.body.id } });
    res.status(200).send({ status: true, message: `Question Delete successfully`, });
}

async function submited_question(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(403).json({ errors: errors.array() });
    }

    const info = {
        question_id: req.body.question_id,
        option: req.body.option,
        private: req.body.private,
        user_id: req.user.id,
        status: 'Active'
    };

    try {
        await SubmitedQuestionModal.create(info);

        res.status(200).send({ status: true, message: 'Question submit successfully' });
    } catch (error) {
        res.status(500).send({ status: false, message: 'Failed to submit Question', error: error.message });
    }
}

async function submited_question_list(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(403).json({ errors: errors.array() });
    }

    try {
        // Get page and limit from request body, default to page 1 and limit 10
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 10;
        const offset = (page - 1) * limit;

        // Fetch the total number of users matching the filter criteria
        const totallist = await SubmitedQuestionModal.count();

        // Fetch the users with pagination and filters
        const SubmitedQuestion = await SubmitedQuestionModal.findAll({
            where: { user_id: req.user.id },
            offset: offset,
            limit: limit,
        });

        const userPromises = SubmitedQuestion.map(async (ans) => {
            const use = await QuestionModel.findOne({ where: { id: ans.question_id }, attributes: ['question', 'option'] });
            return {
                ...ans.toJSON(),
                Question: use,
            };
        });
        const AnswerWith = await Promise.all(userPromises);

        res.status(200).send({
            status: true,
            message: "Data retrieved successfully",
            data: AnswerWith,
            pagination: {
                totallist: totallist,
                currentPage: page,
                totalPages: Math.ceil(totallist / limit),
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

module.exports = {
    add,
    list,
    delet,
    submited_question,
    submited_question_list
};