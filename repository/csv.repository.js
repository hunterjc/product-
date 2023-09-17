const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/csv.model");
const { ObjectId } = require("mongoose").Types;
const faqSection = require("../model/faq.model");
const faqType = require("../model/faqCategory.mode");
const { uploadCloudinary } = require("../utils/cloudinary.js");
const { convertFieldsToAggregateObject } = require("../helper/index");

exports.List = async (params) => {
  try {
    params.searchValue = params.searchValue || "typefaq,status,image,ordering";
    params.selectValue = params.selectValue || "typefaq,status,image,ordering";

    const {
      keyword,
      searchValue,
      selectValue,
      sortQuery = "-createdAt",
      offset = 0,
      limit,
    } = params;

    const selectedFields = selectValue && selectValue.replaceAll(",", " ");
    const query = { deletedAt: null };

    if (keyword) {
      let searchQuery = searchValue
        ? searchValue.split(",")
        : selectedFields.split(" ");
      query.$or = search(searchQuery, keyword);
    }
    const data = await faqType
      .paginate(query, {
        select: selectedFields,
        sort: sortQuery,
        limit: limit ? limit : 10,
        offset: offset ? offset : 0,
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
    return { status: 200, message: "found", data: data };
  } catch (err) {
    return { status: 500, message: err };
  }
};

exports.Add = async (req) => {
  try {
    let params = req.body;
    const checkData = User.findOne({ typefaq: req.body.typefaq });
    // if(checkData&&1==false )
    if (req.file) {
      const up = await uploadCloudinary({
        file: req.file,
        folder: "faq",
      });
      params.image = up?.secure_url;
    }
    const totalCount = await faqType
      .find({
        deletedAt: null,
      })
      .countDocuments();
    let data = new faqType({
      ...params,
      ordering: totalCount + 1,
    });
    data.save();
    return { status: 200, message: "added", data: data };
  } catch (err) {
    return { status: 500, message: "not added" };
  }
};

exports.Edit = async (req) => {
  try {
    let params = req.body;
    if (req.file) {
      const up = await uploadCloudinary({
        file: req.file,
        folder: "faq",
      });
      params.image = up?.secure_url;
    }

    let newData = await faqType.findByIdAndUpdate(
      params.id,
      { ...params, updatedBy: null },
      { new: true }
    );

    return { status: 200, message: "edited", data: newData };
  } catch (error) {
    return { status: 400, message: "edit is not workng", data: newData };
  }
};

exports.Remove = async (req) => {
  try {
    let params = req.params;
    let userexist = faqType.findOne({ _id: params.id });
    if (!userexist) {
      return { status: 400, message: "data not found" };
    }
    const del = await faqType.updateOne(
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
