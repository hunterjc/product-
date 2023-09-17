const express = require("express");
const router = express.Router();
const controller = require("../../controller/csv.controller");
const { acceptFormData, uploadBuffer } = require("../../utils/multer");

router.route("/csv/list").get(controller.faqList);
router.route("/csv/add").post(acceptFormData, controller.faqAdd);

// router
//   .route("/faq-category/edit")
//   .put(uploadBuffer.single("image"), controller.faqEdit);

// router.route("/faq-category/remove/:id").delete(controller.faqRemove);

module.exports = router;
