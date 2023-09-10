const repository = require("../repository/auth.repository");

const Login = async (req, res) => {
  const data = await repository.login(req);
  return res.status(data.status).send(data);
};

const posts = async (req, res) => {
  const data = await repository.posts(req);
  return res.status(data.status).send(data);
};

const resetPassword = async (req, res) => {
  const data = await repository.changePassword(req);
  return res.status(data.status).send(data);
};

// const faqType = async (req, res) => {
//   const data = await repository.typeFaq(req);
//   return res.status(data.status).send(data);
// };

const findAll = async (req, res) => {
  const data = await repository.allData(req);
  return res.status(data.status).send(data);
};

const remove = async (req, res) => {
  const data = await repository.remove(req);
  return res.status(data.status).send(data);
};

const blogEdit = async (req, res) => {
  const data = await repository.edit(req);
  return res.status(data.status).send(data);
};


module.exports = {
  Login,
  posts,
  resetPassword,
  remove,
  findAll,
  blogEdit,
};
