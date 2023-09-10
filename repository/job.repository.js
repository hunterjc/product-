const Job = require("../model/job.model");
const errorHandler = require("../helper/errorHandler.js");

const { ObjectId } = require("mongoose").Types;

exports.job = async (req, clientIp) => {
  let params = req.body;
  try {
    params.searchValue = params.searchValue || "name,description,categoryId";
    params.selectValue =
      params.selectValue ||
      "_id,name,description,categoryId,createdAt,updatedAt";
    const { selectValue, sortQuery = "-createdAt", offset = 0, limit } = params;
    // const selectedFields = selectValue && selectValue.replaceAll(",", " ");
    const query = { deletedAt: null };

    const myAggregate = Job.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "jobtypes",
          localField: "jobtypes",
          foreignField: "_id",
          as: "JobTypeData",
          pipeline: [
            {
              $match: { $expr: { $eq: ["$deletedAt", null] } },
            },
            {
              $project: { description: 1, price: 1, status: 1, categoryId: 1 },
            },
          ],
        },
      },
      { $project: { name: 1, jobid: 1, JobTypeData: 1 } },
    ]);

    const data = await Job.aggregatePaginate(myAggregate, {
      limit: limit ? limit : 10,
      offset: offset ? offset : 0,
    });

    return {
      status: 200,
      message: "product list fetched successfully",
      data: data,
    };
  } catch (e) {
    return { status: 500, message: e };
  }
};

exports.findOneData = async (req, clientIp) => {
  let params = req.params;

  try {
    const query = { deletedAt: null, _id: new ObjectId(params.id) };
    // const checkData = await Job.aggregate([
    //   { $match: query },
    //   { $project: { deletedAt: 0, deletedBy: 0 } },
    // ]);
    const myAggregate = await Job.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "jobtypes",
          localField: "jobtypes",
          foreignField: "_id",
          as: "JobTypeData",
          pipeline: [
            {
              $match: { $expr: { $eq: ["$deletedAt", null] } },
            },
            {
              $project: { description: 1, price: 1, status: 1, categoryId: 1 },
            },
          ],
        },
      },
      { $project: { name: 1, jobid: 1, JobTypeData: 1 } },
    ]);
    // console.log(myAggregate[0]);
    return { status: 200, message: "Data fetch", data: myAggregate[0] };
  } catch (error) {
    return errorHandler(error, params);
  }
};

exports.add = async (req, clientIp) => {
  try {
    let params = req.body;
    let data = new Job({
      ...params,
      jobid: params.jobid ? params.jobid : null,
    });
    data.save();
    return { status: 200, message: data };
  } catch (e) {
    return { status: 400, message: e.message };
  }
};

exports.edit = async (req, clientIp) => {
  try {
    let params = req.body;
    if (!params.name) return { status: 400, message: "put your name" };

    let newData = await Job.findByIdAndUpdate(
      params.id,
      { ...params, updatedBy: params.authUser ? params.authUser._id : null },
      { new: true }
    );

    return { status: 200, message: "edited", data: newData };
  } catch (e) {
    return { status: 400, message: e.message };
  }
};

exports.remove = async (req, clientIp) => {
  try {
    let params = req.params;
    let userexist = Job.findOne({ _id: params.id });
    if (!userexist) {
      return { status: 400, message: "data not found" };
    }
    const del = await Job.updateOne(
      {
        _id: params.id,
        deletedAt: null,
      },
      {
        deletedAt: new Date(),
      }
    );
    return { status: 200, message: "deleted ", data: del };
  } catch (e) {
    return { status: 400, message: e.message };
  }
};
