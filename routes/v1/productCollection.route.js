const express = require("express");
const router = express.Router();
const controller = require("../../controller/productCollection.controller");
const { acceptFormData, uploadBuffer } = require("../../utils/multer");

router.route("/collection/list").get(controller.List);
router
  .route("/collection/add")
  .post(uploadBuffer.single("image"), controller.Add);
module.exports = router;

router
  .route("/collection/edit")
  .put(uploadBuffer.single("image"), controller.Edit);
module.exports = router;

router
  .route("/collection/remove")
  .delete(uploadBuffer.single("image"), controller.Remove);
module.exports = router;
