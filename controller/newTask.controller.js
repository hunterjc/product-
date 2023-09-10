const repository = require("../repository/newTask.repository");
const productList = async (req, res) => {
  const data = await repository.List({ ...req });
  return res.status(data.status).send(data);
};

const productAdd = async (req, res) => {
  const data = await repository.Add(req);
  return res.status(data.status).send(data);
};
module.exports = {
  productList,
  productAdd,
};
