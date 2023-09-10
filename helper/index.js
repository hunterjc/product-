const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
const DEFAULT_IMAGE = process.env.BASE_URL + "storage/no-data-found.jpg";

const generateJwtAccessToken = async (params) => {
  return jwt.sign({ ...params }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

const verifyJwtToken = async (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

const checkPassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
};

const createHashPassword = (password) => {
  const salt = bcrypt.genSaltSync(12);
  return bcrypt.hashSync(password, salt);
};

const convertFieldsToAggregateObject = (fields, demilater = ",") => {
  if (!fields) return { deletedAt: 0, deletedBy: 0 };
  if (typeof fields == "string") {
    fields = fields.trim();
    fields = fields.split(demilater);
  }
  let obj = {};
  for (let el of fields) if (el) obj[el] = 1;

  return obj;
};

const aggregateFileConcat = (column) => {
  return {
    $cond: [column, { $concat: [process.env.BASE_URL, column] }, DEFAULT_IMAGE],
  };
};

const generateOTP = () => {
  const min = 1000;
  const max = 9999;
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  return otp;
};

const dateDiffInMinutes = (date1, date2) => {
  const total = date1.getTime() - date2.getTime();
  return Math.floor(total / 1000 / 60);
};

const validatePassword = async (password) => {
  const REG = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return REG.test(password);
};

module.exports = {
  generateJwtAccessToken,
  PASSWORD_REGEX,
  checkPassword,
  createHashPassword,
  convertFieldsToAggregateObject,
  verifyJwtToken,
  generateOTP,
  dateDiffInMinutes,
  aggregateFileConcat,
  validatePassword,
};
