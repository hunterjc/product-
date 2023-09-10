const express = require("express");
const router = express.Router();
const controller = require("../../controller/auth.controller");
const { acceptFormData, uploadBuffer } = require("../../utils/multer");

router.route("/user/add").post(uploadBuffer.single("image"), controller.Add);

router.route("/user/edit").put(uploadBuffer.single("image"), controller.edit);
router.route("/user/list").get(controller.List);
router.route("/user/remove/:id").delete(controller.remove);

router.route("/user/statusChange").put(acceptFormData, controller.statusChange);
router.route("/user/findOneData/:id").get(controller.List);

router.route("/user/mondbP").post(acceptFormData, controller.mondbp);


module.exports = router;
