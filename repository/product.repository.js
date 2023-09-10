const { uploadCloudinary } = require("../utils/cloudinary.js");
const { convertFieldsToAggregateObject } = require("../helper/index");
const errorHandler = require("../helper/errorHandler");

const Product = require("../model/product.model");
const productTag = require("../model/product.tags.model");
const productCategory = require("../model/product.category.model");
exports.mongoDBP = async (req, clientIp) => {
  let params = req.query;
  try {
    params.searchValue = params.searchValue || "name,image,price,createdAt";
    params.selectValue = params.selectValue || "name,image,price,createdAt";

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
    const myAggregate2 = Product.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "productcategories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDATA",
        },
      },
      {
        $lookup: {
          from: "producttags",
          localField: "tags",
          foreignField: "_id",
          as: "categorytagDATA",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          image: 1,
          price: 1,
          "categoryDATA.name": 1,
          "categoryDATA.price": 1,
          "categoryDATA.image": 1,
          "categorytagDATA.name": 1,
          "categorytagDATA.price": 1,
          "categorytagDATA.image": 1,
        },
      },
    ]);
    const myAggregate1 = Product.aggregate([
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

    const myAggregate = Product.aggregate([
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
    const data = await Product.aggregatePaginate(myAggregate2, {
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

//
exports.List = async (req) => {
  let params = req.query;
  try {
    const {
      keyword,
      limit = 10,
      offset = 0,
      status = null,
      searchValue = false,
      selectValue = "name price category tags createdAt",
      sortQuery = "-createdBy",
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

    // const myAggregate = User.aggregate([
    //   { $match: query },
    //   {
    //     $lookup: {
    //       from: "teams",
    //       localField: "userId",
    //       foreignField: "_id",
    //       as: "patient",
    //       pipeline: [{ $project: { fullname: 1, email: 1, image: 1 } }],
    //     },
    //   },
    //   { $project: { ...selectProjectParams } },
    // ]);
    const myAggregate2 = Product.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "productcategories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDATA",
        },
      },
      {
        $lookup: {
          from: "producttags",
          localField: "tags",
          foreignField: "_id",
          as: "categorytagDATA",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          image: 1,
          price: 1,

          "categoryDATA.name": 1,
          // "categoryDATA.price": 1,
          // "categoryDATA.price": 1,
          "categorytagDATA.name": 1,
          "categorytagDATA.price": 1,
          "categorytagDATA.image": 1,
        },
      },
    ]);

    const result = await Product.aggregatePaginate(myAggregate2, {
      offset: offset,
      limit: limit,
      sort: sortQuery,
    });

    return { status: 200, message: "list fetch", ...result };
  } catch (error) {
    return errorHandler(error, params);
  }
};

//
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
    let dataImage = new productCategory({
      ...params,
    });
    await dataImage.save();
    let dataImageId = dataImage.id;
    let dataTag = new productTag({
      ...params,
    });
    await dataTag.save();
    let dataTagId = dataTag.id;
    params.category = dataImageId;
    params.tags = dataTagId;
    // console.log(dataImage.id);
    let data = new Product({
      ...params,
    });
    await data.save();
    return { status: 200, data: data };
  } catch (e) {
    return { status: 500, data: "not working" };
  }
};
