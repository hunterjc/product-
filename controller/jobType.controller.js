const repository = require("../repository/jobType.repository");
const JobType = async (req, res) => {
  const data = await repository.jobType(req);
  return res.status(data.status).send(data);
};

module.exports = {
    JobType,
};
