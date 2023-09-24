const repository = require("../repository/csv.repository");
const csvList = async (req, res) => {
  const data = await repository.List(req);
  return res.status(data.status).send(data);
};

const csvAdd = async (req, res) => {
  const data = await repository.Add(req);
  return res.status(data.status).send(data);
};

// const faqEdit = async (req, res) => {
//   const data = await repository.Edit(req);
//   return res.status(data.status).send(data);
// };
// const faqRemove = async (req, res) => {
//   const data = await repository.Remove(req);
//   return res.status(data.status).send(data);
// };

module.exports = {
  csvList,
  csvAdd,
  //   faqEdit,
  //   faqRemove,
};
