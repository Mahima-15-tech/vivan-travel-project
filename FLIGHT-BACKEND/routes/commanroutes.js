const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { send_notification, uplode_media, add_chat, update_chat, chat_history, generate_Token, call_history, call_history_list, get_api, save_api_logs } = require("../controllers/Comman");
const { uplode } = require('../helpers/file_uplode');

router.post("/send_notification", uplode.none(), send_notification);
router.post("/uplode_media", uplode.single('file'), uplode_media);
router.post("/add_chat", uplode.none(), add_chat);
router.post("/update_chat", uplode.none(), update_chat);
router.post("/generate_Token", uplode.none(), generate_Token);
router.post("/chat_history", auth.isAuthorize, uplode.none(), chat_history);
router.post("/call_history", uplode.none(), call_history);
router.get("/call_history_list", auth.isAuthorize, uplode.none(), call_history_list);
router.post("/get_api", uplode.none(), get_api);
router.post("/save_api_logs", uplode.none(), save_api_logs);


module.exports = router;