const express = require("express");
const router = express.Router();
const controller = require("../../controller/jobType.controller");
const { acceptFormData, uploadBuffer } = require("../../utils/multer");

router.route("/jobType/list").get(controller.JobType);

module.exports = router;
