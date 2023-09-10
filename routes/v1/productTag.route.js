const express = require("express");
const router = express.Router();
const controller = require("../../controller/productTag.controller");
const { acceptFormData, uploadBuffer } = require("../../utils/multer");

router.route("/productTag/list").get(controller.List);
router
  .route("/productTag/add")
  .post(uploadBuffer.single("image"), controller.Add);
module.exports = router;

router
  .route("/productTag/edit")
  .put(uploadBuffer.single("image"), controller.Edit);
module.exports = router;

router
  .route("/productTag/remove")
  .delete(uploadBuffer.single("image"), controller.Remove);
module.exports = router;
