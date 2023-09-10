const User = require("../model/team.model");
const bcrypt = require("bcrypt");
const errorHandler = require("../helper/errorHandler");
const { uploadCloudinary } = require("../utils/cloudinary.js");
const { convertFieldsToAggregateObject } = require("../helper/index");

exports.List = async (req) => {
  let params = req.query;
  try {
    const {
      keyword,
      limit = 10,
      offset = 0,
      status = null,
      searchValue = false,
      selectValue = "name email designation phone status socialLink createdAt",
      sortQuery = "ordering",
      _id = "",
    } = params;
    const select = selectValue && selectValue.replaceAll(",", " ");
    const selectProjectParams = convertFieldsToAggregateObject(select, " ");
    let query = { deletedAt: null };
    if (Array.isArray(_id) && _id.length > 0) {
      let ids = _id.map((el) => new ObjectId(el));
      query["_id"] = { $in: ids };
    }
    if (status) query.status = statusSearch(status);
    if (keyword) {
      const searchQuery = searchValue
        ? searchValue.split(",")
        : select.split(" ");
      query.$or = search(searchQuery, keyword);
    }
    const myAggregate = User.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "teams",
          localField: "userId",
          foreignField: "_id",
          as: "patient",
          pipeline: [{ $project: { fullname: 1, email: 1, image: 1 } }],
        },
      },
      { $project: { ...selectProjectParams } },
    ]);
    const result = await User.aggregatePaginate(myAggregate, {
      offset: offset,
      limit: limit,
      sort: sortQuery,
    });
    return { status: 200, message: "list fetch", ...result };
  } catch (error) {
    return errorHandler(error, params);
  }
};

exports.add = async (req) => {
  try {
    let params = req.body;

    if (req.file) {
      const up = await uploadCloudinary({
        file: req.file,
        folder: "teams",
      });
      params.image = up?.secure_url;
    }
    let data = new User({
      ...params,
    });
    data.save();
    return { status: 200, message: "added", data: data };
  } catch (err) {
    return { status: 500, message: "not added" };
  }
};

exports.edit = async (req) => {
  try {
    let params = req.body;
    if (req.file) {
      const up = await uploadCloudinary({
        file: req.file,
        folder: "teams",
      });
      params.image = up?.secure_url;
    }

    let newData = await User.findByIdAndUpdate(
      params.id,
      { ...params, updatedBy: params.authUser ? params.authUser._id : null },
      { new: true }
    );

    return { status: 200, message: "edited", data: newData };
  } catch (error) {
    return { status: 400, message: "edit is not workng" };
  }
};

exports.remove = async (req) => {
  try {
    let params = req.params;
    let userexist = User.findOne({ _id: params.id });
    if (!userexist) {
      return { status: 400, message: "data not found" };
    }
    const del = await User.updateOne(
      {
        _id: params.id,
        deletedAt: null,
      },
      {
        deletedAt: new Date(),
      }
    );
    return { status: 200, message: "deleted ", data: del };
  } catch (err) {
    return { status: 500, message: "not deleted" };
  }
};

exports.statusChange = async (req) => {
  try {
    let params = req.body;
    let newData = await User.findByIdAndUpdate(
      params.id,
      { ...params, updatedBy: params.authUser ? params.authUser._id : null },
      { new: true }
    );
    return { status: 200, message: "edited", data: newData };
  } catch (error) {
    return { status: 400, message: "edit is not workng", data: newData };
  }
};

exports.findOneData = async (req) => {
  try {
    let params = req.params;
    let data = await User.findById({ _id: params.id });
    if (!data) return { status: 400, messag: "data not found" };
    return { status: 200, message: "Data found", data };
  } catch (error) {
    return errorHandler(err, params);
  }
};
