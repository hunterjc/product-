const express = require("express");
const router = express.Router();
const controller = require("../../controller/login.controllers");
const { acceptFormData, uploadBuffer } = require("../../utils/multer");

router.route("/blog/login").post(controller.Login);

router.route("/blog/auth-post").post(controller.posts);

router.route("/blog/forget-password").post(controller.resetPassword);

router.route("/blog/allData/").get(controller.findAll);

router.route("/blog/remove/").delete(controller.remove);

router.route("/blog/edit").put(controller.blogEdit);

module.exports = router;
