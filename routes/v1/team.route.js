const express = require("express");
const router = express.Router();
const controller = require("../../controller/team.controller");
const { acceptFormData, uploadBuffer } = require("../../utils/multer");

router.route("/team/list").get(controller.List);
router.route("/team/add").post(uploadBuffer.single("image"), controller.Add);

router.route("/team/edit").put(uploadBuffer.single("image"), controller.edit);

router.route("/team/remove/:id").delete(controller.remove);
router.route("/team/details/:id").get(controller.findSingleData);
router
  .route("/team/status-change")
  .put(acceptFormData, controller.statusChange);

module.exports = router;
