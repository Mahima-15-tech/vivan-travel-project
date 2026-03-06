const { validationResult, Result } = require("express-validator");
const { where } = require("sequelize");
const UserModel = require("../models").users;
const ChatroomModel = require("../models").chatroom;
const CallhistoryModel = require("../models").call_history;
const ApilogsModel = require("../models").api_logs;
const ApisModel = require("../models").apis;
const { Sequelize, Op } = require("sequelize");
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');


async function send_notification(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(403).json({ errors: errors.array() });
    }

    try {
        // Determine the type of notification to send (single or multiple users)
        const { sendToType, userId, message, other } = req.body;
        let users;

        if (sendToType === 'single' && userId) {
            // Send to a single user
            users = await UserModel.findAll({
                where: { id: userId },
                attributes: ['fcm']
            });
        } else {
            // Send to all users
            users = await UserModel.findAll({
                attributes: ['fcm']
            });
        }

        if (users.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No users found"
            });
        }

        // Extract FCM tokens from the users
        const tokens = users.map(user => user.fcm).filter(token => token);

        if (tokens.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No valid FCM tokens found"
            });
        }

        // Send notifications
        tokens.forEach(token => {
            // sendNotification(token, message, other);
        });

        res.status(200).send({
            status: true,
            message: "Notification sent successfully",
        });

    } catch (error) {
        console.error('Error sending notifications:', error);
        res.status(500).send({
            status: false,
            message: "Error sending notifications"
        });
    }
}

async function call_history(req, res) {
    const info = {
        member_id: `${req.body.user_id},${req.body.to_user_id}`,
        call_by: req.body.user_id,
        call_type: req.body.call_type, // #1audio  #2video 
        status: '1', // #incoming #outgoing #notanswer
    };
    await CallhistoryModel.create(info);
    return res.status(200).send({
        status: true,
        message: "Added successfully",
    });
}

async function call_history_list(req, res) {

    try {
        const Callhistorys = await CallhistoryModel.findAll({
            where: {
                member_id: {
                    [Op.like]: `%${req.user.id}%`
                }
            },
            group: ['id', 'call_by', 'call_type', 'createdAt']
        });
        const results = [];

        for (const Callhistory of Callhistorys) {
            const members = Callhistory.member_id ? Callhistory.member_id.split(',') : [];
            const otherMembers = members.filter(memberId => memberId !== req.user.id.toString());

            // Fetch user details of other members
            const users = await UserModel.findAll({
                where: {
                    id: {
                        [Op.in]: otherMembers // Only fetch users who are other members of the chatroom
                    }
                },
                attributes: ['id', 'name', 'profile']
            });

            // Attach chatroom info to each user
            const usersWithCall = users.map(user => ({
                ...user.toJSON(),
                Callhistory: Callhistory
            }));

            results.push(...usersWithCall);
        }

        res.status(200).send({ status: true, message: 'Successfully fetched history', data: results });
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: false, message: 'Error fetching history' });
    }
}

async function uplode_media(req, res) {
    if (req.file) {
        const uplodefile = "users_images/" + req.file.filename;
        res.status(200).send({
            status: true,
            message: "Successfully",
            data: uplodefile,
        });
    } else {
        res.status(502).send({
            status: true,
            message: "Server error",
        });
    }
}

async function add_chat(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(403).json({ errors: errors.array() });
    }

    const info = {
        roomcode: req.body.roomcode,
        member_id: req.body.member_id,
        last_message: req.body.last_message,
    };

    try {
        // Check if a chatroom with the given roomcode already exists
        const existingChatroom = await ChatroomModel.findOne({
            where: { roomcode: info.roomcode }
        });

        if (existingChatroom) {
            // Update the existing chatroom
            await ChatroomModel.update(info, {
                where: { roomcode: info.roomcode }
            });
            return res.status(200).send({
                status: true,
                message: "Updated successfully",
            });
        } else {
            // Create a new chatroom
            await ChatroomModel.create(info);
            return res.status(200).send({
                status: true,
                message: "Added successfully",
            });
        }
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "An error occurred",
            error: error.message,
        });
    }
}

async function update_chat(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(403).json({ errors: errors.array() });
    }
    info = { last_message: req.body.last_message };
    await ChatroomModel.update(info, { where: { roomcode: req.body.roomcode } });
    res.status(200).send({ status: true, message: `Update successfully`, });
}

async function chat_history(req, res) {
    try {
        // Fetch all chatrooms the current user is part of
        const chatrooms = await ChatroomModel.findAll({
            where: {
                member_id: {
                    [Op.like]: `%${req.user.id}%` // Check if current user is part of the chatroom
                }
            },
            group: ['id', 'roomcode']
        });

        const results = [];

        for (const chatroom of chatrooms) {
            // Get members of the chatroom excluding the current user
            const members = chatroom.member_id ? chatroom.member_id.split(',') : [];
            const otherMembers = members.filter(memberId => memberId !== req.user.id.toString());

            // Fetch user details of other members
            const users = await UserModel.findAll({
                where: {
                    id: {
                        [Op.in]: otherMembers // Only fetch users who are other members of the chatroom
                    }
                },
                attributes: ['id', 'name', 'profile']
            });

            // Attach chatroom info to each user
            const usersWithChatroom = users.map(user => ({
                ...user.toJSON(),
                chatroom: chatroom
            }));

            results.push(...usersWithChatroom);
        }

        res.status(200).send({ status: true, message: 'Successfully fetched chat history', data: results });
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: false, message: 'Error fetching chat history' });
    }
}

function generateRtcToken(appID, appCertificate, channelName, uid) {
    const role = RtcRole.PUBLISHER; // or RtcRole.SUBSCRIBER
    const expirationTimeInSeconds = 6000; // Token validity: 100 minutes
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // Build the token
    return RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);
}

async function generate_Token(req, res) {
    try {
        const { appID, appCertificate, channelName, uid } = req.body;

        if (!appID || !appCertificate || !channelName || !uid) {
            return res.status(400).json({
                message: 'Missing required parameters',
                status: 400,
            });
        }

        const rtcToken = generateRtcToken(appID, appCertificate, channelName, uid);

        return res.status(200).json({
            rtcToken: rtcToken,
            status: 200,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: 500,
        });
    }
}

async function get_api(req, res) {
    try {
        const { party_name } = req.body;
        if (!party_name) {
            return res.status(400).json({
                message: 'Missing required parameters',
                status: 400,
            });
        }
        const response = await ApisModel.findOne({ where: { party_name: party_name } });
        res.status(200).send({ status: true, message: 'Data fetched Successfully', data: response });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: 500,
        });
    }
}


async function save_api_logs(req, res) {
    try {
        await ApilogsModel.create(req.body);
        return res.status(200).json({
            message: 'API log saved successfully',
            status: 200,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: 500,
        });
    }
}


module.exports = {
    send_notification,
    uplode_media,
    add_chat,
    update_chat,
    chat_history,
    generate_Token,
    call_history,
    call_history_list,
    get_api,
    save_api_logs,

};
