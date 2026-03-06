const express = require('express');
const router = express.Router();

const { add, list,delet} = require("../controllers/LanguageController");
const { uplode } = require('../helpers/file_uplode');
const { add_language,pagnation,Del,add_faqs } = require("../helpers/validation");


router.post("/add",uplode.single('icon'),add_language,add);
router.post("/list",uplode.none(),pagnation,list);
router.delete("/delete",uplode.none(),Del,delet);


module.exports = router;