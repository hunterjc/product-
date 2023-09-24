const express = require("express");
const router = express.Router();
const controller = require("../../controller/csv.controller");
const { acceptFormData, uploadBuffer } = require("../../utils/multer");

router.route("/csv/list").get(controller.csvList);
router.route("/csv/add").post(acceptFormData, controller.csvAdd);
router
  .route("/csv/import")
  .post(uploadBuffer.single("csvFile"), controller.csvImport);
// router
//   .route("/faq-category/edit")
//   .put(uploadBuffer.single("image"), controller.faqEdit);

// router.route("/faq-category/remove/:id").delete(controller.faqRemove);

module.exports = router;
