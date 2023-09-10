const express = require("express");
const router = express.Router();
const controller = require("../../controller/product.controller");
const { acceptFormData, uploadBuffer } = require("../../utils/multer");

router.route("/product/list").get(controller.Product);
router
  .route("/product/add")
  .post(uploadBuffer.single("image"), controller.ProductAdd);
module.exports = router;
