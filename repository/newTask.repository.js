const Model = require("../model/product.model");
const { uploadCloudinary } = require("../utils/cloudinary.js");
const { convertFieldsToAggregateObject } = require("../helper/index");
const errorHandler = require("../helper/errorHandler");
const productOrganizations = require("../model/product.organizatin");
const Add = async (req) => {
  try {
    let params = req.body;
    if (req.file) {
      const up = await uploadCloudinary({
        file: req.file,

        folder: "teams",
      });
      params.image = up?.secure_url;
    }
    console.log(params.image);
    // if (params.id) {
    //   const newData = await Model.findByIdAndUpdate(
    //     params.id,
    //     {
    //       $push: { organization: organizationData },
    //     },
    //     { new: true }
    //   );
    //   return { status: 200, data: newData };
    // } else {
    if (params.id) {
      if (params.organization) {
        const newData = await Model.findByIdAndUpdate(
          params.id,
          {
            $push: {
              organization: params.organization,
            },
          },
          { new: true }
        );
      }
      if (params.category) {
        const newData = await Model.findByIdAndUpdate(
          params.id,
          {
            $push: {
              category: params.category,
            },
          },
          { new: true }
        );
      }
      if (params.tag) {
        const newData = await Model.findByIdAndUpdate(
          params.id,
          {
            $push: {
              tag: params.tag,
            },
          },
          { new: true }
        );
      }
      return { status: 200, data: "updated" };
    }

    console.log("working");
    console.log(params.image);

    let data = await new Model({
      ...params,
      tags: params.tag,
      category: params.category,
      organization: params.organization,
    });
    data.save();

    return { status: 200, data: data };
  } catch (e) {
    return { status: 500, data: "not working" };
  }
};
const Edit = async (params) => {
  try {
    return { status: 200, data: "working" };
  } catch (er) {
    return { status: 400, data: "not working" };
  }
};
const List = async (params) => {
  try {
    const {
      keyword,
      limit = 30,
      offset = 0,
      status = null,
      searchValue = false,
      selectValue = "name, description, createdAt",
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
    const myAggregate2 = Model.aggregate([
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
          as: "tagData",
        },
      },
      {
        $lookup: {
          from: "productorganizations",
          localField: "organization",
          foreignField: "_id",
          as: "organizationDATA",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          image: 1,
          price: 1,

          "categoryDATA.name": 1,
          "categoryDATA.description": 1,
          "tagData.name": 1,
          "tagData.description": 1,
          "organizationDATA.name": 1,
          "organizationDATA.description": 1,
        },
      },
    ]);

    const result = await Model.aggregatePaginate(myAggregate2, {
      offset: offset,
      limit: limit,
      sort: sortQuery,
    });

    return { status: 200, message: "list fetch", ...result };
  } catch (error) {
    return errorHandler(error, params);
  }
};
const Delete = async (req) => {
  try {
    let params = req.params;
    let userexist = productTag.findOne({ _id: params.id });
    if (!userexist) {
      return { status: 400, message: "data not found" };
    }
    const del = await productTag.updateOne(
      {
        _id: params.id,
        deletedAt: null,
      },
      {
        deletedAt: new Date(),
      }
    );
    return { status: 200, message: "deleted ", data: del };
  } catch (er) {
    return { status: 400, data: "not working" };
  }
};

module.exports = {
  Add,
  Edit,
  List,
  Delete,
};
// let dataCategory = new productCategory({
//   ...params.category,
// });
// let dataTag = new productTag({
//   ...params.tag,
// });
// let dataOrganization = new productOrganizations({
//   ...params.organization,
// });
// await dataCategory.save();
// await dataTag.save();
// await dataOrganization.save();
// params.category = dataCategory;
// params.tags = dataTag;
// params.organization = dataOrganization;

// console.log(dataImage.id);
