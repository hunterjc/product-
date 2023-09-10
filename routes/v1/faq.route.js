const express = require("express");
const router = express.Router();
const controller = require("../../controller/faq.controller");
const { acceptFormData, uploadBuffer } = require("../../utils/multer");

router.route("/faq-category/list").get(controller.faqList);
router
  .route("/faq-category/add")
  .post(uploadBuffer.single("image"), controller.faqAdd);

router
  .route("/faq-category/edit")
  .put(uploadBuffer.single("image"), controller.faqEdit);

router.route("/faq-category/remove/:id").delete(controller.faqRemove);

module.exports = router;
