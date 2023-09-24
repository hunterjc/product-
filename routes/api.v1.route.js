const express = require("express");
const router = express.Router();

// router.use("/", require("./v1/team.route.js"));
// router.use("/", require("./v1/auth.route"));
//faq for user
// router.use("/", require("./v1/login.route.js"));

// faq category admin
// router.use("/", require("./v1/faq.route.js"));

// router.use("/", require("./v1/jobType.route.js"));

// router.use("/", require("./v1/job.route.js"));

router.use("/", require("./v1/product.route.js"));

// router.use("/", require("./v1/productTag.route.js"));

// router.use("/", require("./v1/productCollection.route.js"));

// router.use("/", require("./v1/productOrganization.route.js"));

// router.use("/", require("./v1/product.route.js"));

router.use("/", require("./v1/csv.route.js"));

module.exports = router;
