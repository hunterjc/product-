const repository = require("../repository/team.repository");

const List = async (req, res) => {
  const data = await repository.List({ ...req });
  res.send(data);
};

const Add = async (req, res) => {
  const data = await repository.add(req);
  return res.status(data.status).send(data);
};

const edit = async (req, res) => {
  const data = await repository.edit(req);
  return res.status(data.status).send(data);
};

const remove = async (req, res) => {
  const data = await repository.remove(req);
  return res.status(data.status).send(data);
};

const statusChange = async (req, res) => {
  const data = await repository.statusChange(req);
  return res.status(data.status).send(data);
};

const findSingleData = async (req, res) => {
  const data = await repository.findOneData(req);
  return res.status(data.status).send(data);
};
findSingleData;
module.exports = {
  Add,
  List,
  edit,
  remove,
  statusChange,
  findSingleData,
};
