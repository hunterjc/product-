const JobType = require("../model/jobType.model");

exports.jobType = async (req, clientIp) => {
  let params = req.body;
  try {
    params.searchValue = params.searchValue || "name,description,categoryId";
    params.selectValue =
      params.selectValue ||
      "_id,name,description,categoryId,createdAt,updatedAt";
    const { selectValue, sortQuery = "-createdAt", offset = 0, limit } = params;
    const selectedFields = selectValue && selectValue.replaceAll(",", " ");
    const query = { createdAt: null };
    // if (keyword) {
    //   let searchQuery = searchValue
    //     ? searchValue.split(",")
    //     : selectedFields.split(" ");
    //   query.$or = search(searchQuery, keyword);
    // }

    const myAggregate = JobType.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "jobcategories",
          localField: "categoryId",
          foreignField: "_id",
          as: "jobCategoryData",
          pipeline: [
            {
              $match: { $expr: { $eq: ["$createdAt", null] } },
            },
            { $project: { category: 1, status: 1, ordering: 1 } },
          ],
        },
      },
      { $project: { name: 1, price: 1, categoryId: 1, jobCategoryData: 1 } },
    ]);

    const data = await JobType.aggregatePaginate(myAggregate, {
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
