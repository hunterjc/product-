const express = require("express");
const router = express.Router();
const controller = require("../../controller/job.controller");

router.route("/job/list").get(controller.Job);
router.route("/job/findOne/:id").get(controller.findOne);
router.route("/job/add").post(controller.Add);
router.route("/job/edit").put(controller.Edit);
router.route("/job/remove/:id").delete(controller.Remove);

module.exports = router;
