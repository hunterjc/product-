const repository = require("../repository/productOrganization.repository");

const List = async (req, res) => {
  const data = await repository.mongoDBP({ ...req });
  res.send(data);
};

const Add = async (req, res) => {
  const data = await repository.Add(req);
  return res.status(data.status).send(data);
};

const Edit = async (req, res) => {
  const data = await repository.edit(req);
  return res.status(data.status).send(data);
};

const Remove = async (req, res) => {
  const data = await repository.remove(req);
  return res.status(data.status).send(data);
};

// const statusChange = async (req, res) => {
//   const data = await repository.statusChange(req);
//   return res.status(data.status).send(data);
// };

// const findSingleData = async (req, res) => {
//   const data = await repository.findOneData(req);
//   return res.status(data.status).send(data);
// };
// findSingleData;
module.exports = {
  Add,
  List,
  Edit,
  Remove,
  //   statusChange,
  //   findSingleData,
};
