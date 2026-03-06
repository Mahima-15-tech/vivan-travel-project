    const { validationResult } = require("express-validator");
    const OfflineTicketModel = require("../models").Offline_ticket;
    const AirlineModel = require("../models").airline;
    const CountryModel = require("../models").country;

    async function add(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(403).json({ errors: errors.array() });
        }

        const ticketData = {
            airline: req.body.airline_id,
            from: req.body.from_country_id,
            to: req.body.to_country_id,
            adult_price: req.body.adult_price || 0,
            child_price: req.body.child_price || 0,
            infant_price: req.body.infant_price || 0,
            seat: req.body.seat || 0,
            flight_code: req.body.flight_code || "",
            check_in_bag: req.body.check_in_bag || "",
            cabin_in_bag: req.body.cabin_in_bag || "",
            departure_time: req.body.departure_time ,
            arrived_time: req.body.arrived_time ,
            isrefundable: req.body.isrefundable || "No",
            status: req.body.status || "Active",
        };

        try {
            const created = await OfflineTicketModel.create(ticketData);
            res.status(200).json({
                status: true,
                message: "Offline ticket added successfully",
                data: created,
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: "Failed to add offline ticket",
                error: error.message,
            });
        }
    }

    async function update(req, res) {
        const ticketId = req.body.id;
        if (!ticketId) {
            return res.status(400).json({ status: false, message: "Ticket ID is required" });
        }

        console.log(req.body.departure_time);
        try {
            const updated = await OfflineTicketModel.update(req.body, {
                where: { id: ticketId },
            });

            if (updated[0] === 0) {
                return res.status(404).json({ status: false, message: "No ticket found to update" });
            }

            res.status(200).json({
                status: true,
                message: "Offline ticket updated successfully",
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: "Failed to update ticket",
                error: error.message,
            });
        }
    }

    async function list(req, res) {
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 10;
        const offset = (page - 1) * limit;

        try {
            const { count, rows } = await OfflineTicketModel.findAndCountAll({
                offset,
                limit,
                order: [["createdAt", "DESC"]],
                include: [
                    {
                        model: AirlineModel,
                        as: "airline_details",
                        attributes: ["id", "name", "logo"],
                    },
                    {
                        model: CountryModel,
                        as: "to_airline",
                        attributes: ["id", "country_code", "alpha_2"],
                    },
                    {
                        model: CountryModel,
                        as: "from_airline",
                        attributes: ["id", "country_code", "alpha_2"],
                    },
                ],
            });

            res.status(200).json({
                status: true,
                message: "Offline ticket list fetched successfully",
                data: rows,
                pagination: {
                    total: count,
                    page,
                    totalPages: Math.ceil(count / limit),
                    limit,
                },
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: "Failed to fetch tickets",
                error: error.message,
            });
        }
    }

    module.exports = {
        add,
        update,
        list,
    };
