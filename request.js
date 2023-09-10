const express = require("express");
const axios = require("axios");
const router = express.Router();

axios.get("/test", (req, res, next) => {
  console.log("'/test' call");
  axios
    .get("https://api.neoscan.io/api/main_net/v1/get_all_nodes")
    .then((data) => res.json(data))
    .catch((err) => res.secn(err));
});
