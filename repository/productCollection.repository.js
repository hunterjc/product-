const { uploadCloudinary } = require("../utils/cloudinary.js");
const Product = require("../model/product.model");
const productTag = require("../model/product.tags.model");

const productCategory = require("../model/product.category.model");
exports.mongoDBP = async (req, clientIp) => {
  let params = req.body;
  try {
    params.searchValue = params.searchValue || "firstName,lastName,email,limit";
    params.selectValue =
      params.selectValue ||
      "_id,firstName,lastName,email,limit,createdAt,updatedAt";

    const {
      keyword,
      searchValue,
      selectValue,
      sortQuery = "-createdAt",
      offset = 0,
      limit,
    } = params;

    const selectedFields = selectValue && selectValue.replaceAll(",", " ");
    const query = { createdAt: null };

    if (keyword) {
      let searchQuery = searchValue
        ? searchValue.split(",")
        : selectedFields.split(" ");
      query.$or = search(searchQuery, keyword);
    }
    let findAA = find;
    const myAggregate1 = productCategory.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDATA",
          pipeline: [
            { $match: { $expr: { $eq: ["$deletedAt", null] } } },
            {
              $project: {
                name: 1,
                status: 1,
              },
            },
          ],
        },
      },
      { $project: { name: 1, price: 1, categoryDATA: 1 } },
    ]);

    const myAggregate = productCategory.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "jobcategories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
          pipeline: [
            { $match: { $expr: { $eq: ["$deletedAt", null] } } },
            {
              $project: {
                name: 1,
                description: 1,
                status: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          categoryData: 1,
          price: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
    const data = await productCategory.aggregatePaginate(myAggregate1, {
      select: selectedFields,
      sort: sortQuery,
      limit: limit ? limit : 10,
      offset: offset ? offset : 0,
    });
    return {
      status: 200,
      message: "product list fetched successfully",
      data: data,
    };
  } catch (err) {
    return { status: 500, message: err };
  }
};

exports.Add = async (req, clientIp) => {
  try {
    let params = req.body;
    if (req.file) {
      const up = await uploadCloudinary({
        file: req.file,
        folder: "teams",
      });
      params.image = up?.secure_url;
    }
    let data = new productCategory({
      ...params,
    });
    data.save();
    return { status: 200, data: data };
  } catch (e) {
    return { status: 500, data: "not working" };
  }
};

exports.edit = async (req, clientIp) => {
  try {
    let params = req.body;
    if (!params.name) return { status: 400, message: "put your name" };
    if (req.file) {
      const up = await uploadCloudinary({
        file: req.file,
        folder: "teams",
      });
      params.image = up?.secure_url;
    }
    let newData = await productCategory.findByIdAndUpdate(
      params.id,
      { ...params, image: params.image },
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
    let userexist = productCategory.findOne({ _id: params.id });
    if (!userexist) {
      return { status: 400, message: "data not found" };
    }
    const del = await productCategory.updateOne(
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
