const User = require("../model/user.model");
const bcrypt = require("bcrypt");
// const { uploadBinaryFile, deleteFile } = require("../utils/upload.js");
const { uploadCloudinary } = require("../utils/cloudinary.js");

exports.List = async (params) => {
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
    const query = { deletedAt: null };

    if (keyword) {
      let searchQuery = searchValue
        ? searchValue.split(",")
        : selectedFields.split(" ");
      query.$or = search(searchQuery, keyword);
    }
    const data = await User.paginate(query, {
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

exports.add = async (req) => {
  try {
    let params = req.body;
    if (params.email) {
      params.email = params.email;
    } else {
      return { status: 500, message: "email not found" };
    }
    //for hashing the password
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(params.password, salt);
    if (params.password) {
      params.password = hashedPassword;
    } else {
      return { status: 500, message: "password  not found" };
    }

    if (req.file) {
      const up = await uploadCloudinary({
        file: req.file,
        folder: "users",
      });
      params.image = up?.secure_url;
    }

    let data = new User({
      ...params,
      password: params.password ? hashedPassword : null,
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
        folder: "users",
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
    return { status: 400, message: "edit is not workng", data: newData };
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
    let userexist = User.findOne({ _id: params.id });
    if (!userexist) {
      return { status: 400, message: "user not found" };
    }
    const data = await User.updateOne({
      status: params.status,
    });
    return { status: 200, message: "status change ", data: data };
  } catch (err) {
    return { status: 500, message: "not change" };
  }
};


