const log4js = require("log4js");
const fs = require("fs");
const path = require("path");

const date = new Date();
const fileName = path.join(
  __dirname,
  "../logs/error-" + (date.getMonth() + 1) + "-" + date.getFullYear() + ".log"
);

!fs.existsSync(fileName) && fs.appendFile(fileName, "", (e) => {});

log4js.configure({
  appenders: { monthly: { type: "file", filename: fileName } },
  categories: { default: { appenders: ["monthly"], level: "error" } },
});

const logger = log4js.getLogger("monthly");

exports.error = (...params) => {
  logger.error(params);
};
exports.info = (...params) => {
  logger.info(params);
};
exports.trace = (...params) => {
  logger.trace(params);
};
exports.debug = (...params) => {
  logger.debug(params);
};
