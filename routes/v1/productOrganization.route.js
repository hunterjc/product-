const express = require("express");
const router = express.Router();
const controller = require("../../controller/productOrganization");
const { acceptFormData, uploadBuffer } = require("../../utils/multer");

router.route("/organization/list").get(controller.List);
router
  .route("/organization/add")
  .post(uploadBuffer.single("image"), controller.Add);
module.exports = router;

router
  .route("/organization/edit")
  .put(uploadBuffer.single("image"), controller.Edit);
module.exports = router;

router
  .route("/organization/remove")
  .delete(uploadBuffer.single("image"), controller.Remove);
module.exports = router;
