const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  add,
  list,
  update,
  mainadd,
  mainlist,
  mainupdate,
} = require("../controllers/Country");
const { uplode } = require('../helpers/file_uplode');
const {  pagnation,status} = require("../helpers/validation");

router.post("/add",uplode.none(),add);
router.post("/list",uplode.none(),pagnation,list);
router.post("/update",uplode.none(),status,update);
router.post("/mainadd", uplode.none(), mainadd);
router.post("/mainlist", uplode.none(), pagnation, mainlist);
router.post("/mainupdate", uplode.none(),  mainupdate);
module.exports = router;
