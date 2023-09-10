const repository = require("../repository/product.repository");
const Product = async (req, res) => {
  const data = await repository.List({ ...req });
  return res.status(data.status).send(data);
};

const ProductAdd = async (req, res) => {
  const data = await repository.Add(req);
  return res.status(data.status).send(data);
};
module.exports = {
  Product,
  ProductAdd,
};
