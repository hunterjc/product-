const express = require("express");
const router = express.Router();
const controller = require("../../controller/newTask.controller");
const { acceptFormData, uploadBuffer } = require("../../utils/multer");

router.route("/product/list").get(controller.productList);
router
  .route("/product/add")
  .post(uploadBuffer.single("image"), controller.productAdd);
module.exports = router;
