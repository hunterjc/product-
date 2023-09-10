const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const { ObjectId } = require("mongoose").Types;
const faqSection = require("../model/faq.model");

exports.login = async (req, clientIp) => {
  let params = req.body;

  try {
    const checkUser = await User.findOne({
      //   email: { $regex: new RegExp("^" + params.email, "i") },
      email: params.email,
      deletedAt: null,
    });

    if (!checkUser) {
      return {
        status: 400,
        message: `${params.email} is not registered with us.`,
      };
    }

    if (!checkUser.emailVerified) {
      return { status: 400, message: "Please verify email" };
    }

    const userDetails = checkUser;
    const validPassword = bcrypt.compareSync(
      params.password,
      checkUser.password
    );

    if (!validPassword) {
      return {
        status: 400,
        message: `Hey ${User.name}, you have entered an incorrect password, please try again.`,
      };
    }

    if (userDetails && userDetails.emailVerified === false) {
      return {
        status: 400,
        message: "Account is not verified.",
      };
    } else {
      await User.updateOne({ _id: userDetails._id }, { lastLogin: new Date() });

      const accessToken = jwt.sign(
        {
          _id: userDetails._id,
          email: userDetails.email,
          phone_code: userDetails.phone_code,
          phone: userDetails.phone,
          name: userDetails.name,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );

      return {
        status: 200,
        message: `Hi ${userDetails.email}, you have successfully logged in.`,
        data: [],
        accessToken,
      };
    }
  } catch (err) {
    return { status: 400, message: err.message };
  }
};

exports.posts = async (req, clientIp) => {
  try {
    let params = req.body;
    let accessToken = params.accessToken;
    const data = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    if (!data) return { status: 400, message: `token expire` };
    //  faq creation
    let faqData = new faqSection({
      ...params,
      faqid: params.faqid ? params.faqid : null,
    });
    faqData.save();
    return { status: 200, message: data };

    //
  } catch (e) {
    return { status: 500, message: "invalid access" };
  }
};

exports.changePassword = async (req, clientIp) => {
  try {
    const params = req.body;
    const checkUser = await User.findOne({
      _id: new ObjectId(params.id),
      deletedAt: null,
    }).select("password");

    if (!checkUser) {
      return {
        status: 400,
        message: "User not found.",
      };
    }
    if (params.newPassword !== params.confirmPassword) {
      return {
        status: 400,
        message: "New Password And Confirm Password not match.",
      };
    }

    let reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!reg.test(params.newPassword)) {
      return {
        status: 400,
        message:
          "Minimum eight characters, at least one letter, one number and one special character",
      };
    }
    const compareNewPassword = bcrypt.compareSync(
      params.newPassword,
      checkUser.password
    );

    if (compareNewPassword) {
      return {
        status: 400,
        message: "New Password can not be identical with Old Password",
      };
    }

    const comparePassword = bcrypt.compareSync(
      params.oldPassword,
      checkUser.password
    );
    if (!comparePassword) {
      return {
        status: 400,
        message: "Incorrect old password, please try again.",
      };
    }
    const salt = bcrypt.genSaltSync(12);
    const new_password = bcrypt.hashSync(params.newPassword, salt);
    const updateUser = await User.findByIdAndUpdate(
      params.id,
      { password: new_password },
      { new: true }
    ).lean();
    return {
      status: 200,
      message: "Password successfully updated.",
      data: updateUser,
    };
  } catch (err) {
    console.log(err);
    return { status: 400, message: err.message };
  }
};

exports.allData = async (req, clientIp) => {
  let params = req.body;
  try {
    params.searchValue = params.searchValue || "name,description,categoryId";
    params.selectValue =
      params.selectValue ||
      "_id,name,description,categoryId,createdAt,updatedAt";
    const { selectValue, sortQuery = "-createdAt", offset = 0, limit } = params;
    // const selectedFields = selectValue && selectValue.replaceAll(",", " ");
    const query = { deletedAt: null };

    const myAggregate = faqSection.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "faqtypes",
          localField: "category",
          foreignField: "_id",
          as: "FAQData",
          pipeline: [
            {
              $match: { $expr: { $eq: ["$deletedAt", null] } },
            },
            {
              $project: { typefaq: 1, status: 1 },
            },
          ],
        },
      },
      {
        $project: {
          question: 1,
          answer: 1,
          category: 1,
          ordering: 1,
          FAQData: 1,
        },
      },
    ]);

    const data = await faqSection.aggregatePaginate(myAggregate, {
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

exports.remove = async (req, clientIp) => {
  try {
    let params = req.body;
    let accessToken = params.accessToken;
    const data = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    if (!data) return { status: 400, message: `token expire` };
    const del = await faqSection.updateOne(
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
    return { status: 400, message: err.message };
  }

  return { status: 200, message: "working", data: "working" };
};

exports.edit = async (req, clientIp) => {
  try {
    let params = req.body;
    let accessToken = params.accessToken;
    const data = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    if (!data) return { status: 400, message: `token expire` };

    let newData = await faqSection.findByIdAndUpdate(
      params.id,
      { ...params, updatedBy: null },
      { new: true }
    );
    // params.authUser ? params.authUser._id :
    return { status: 200, message: "edited", data: newData };
  } catch (e) {
    return { status: 400, message: e.message };
  }
};
