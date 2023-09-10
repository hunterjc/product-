const repository = require("../repository/job.repository");
const Job = async (req, res) => {
  const data = await repository.job(req);
  return res.status(data.status).send(data);
};

const findOne = async (req, res) => {
  const data = await repository.findOneData(req);
  return res.status(data.status).send(data);
};

const Add = async (req, res) => {
  const data = await repository.add(req);
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
module.exports = {
  Job,
  findOne,
  Add,
  Edit,
  Remove,
};
