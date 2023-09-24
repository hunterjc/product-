const faqType = require("../model/faqCategory.mode");
const { uploadCloudinary } = require("../utils/cloudinary.js");
const { Parser } = require("json2csv");
const csvParser = require("csv-parser");
const fs = require("fs");

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
    //
    console.log(params);
    // var information = [
    //   { country: "india", population: "205m", continent: "Asia" },
    //   { country: "uk", population: "206m", continent: "England" },
    // ];
    const json2csvParser = new Parser();
    const logData = json2csvParser.parse(information);
    fs.writeFile("./csv/information.csv", logData, function (er) {
      if (er) {
        throw er;
      }
      console.log("csv is made");
    });
    // res.attachment("information.csv");
    //
    return { status: 200, message: "added", data: params };
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

exports.csvImport = async (req) => {
  try {
    if (!req.file) {
      return { status: 400, data: "no csv file uploaded" };
    }

    const csvData = req.file.buffer;
    const results = [];

    // Create a readable stream from the CSV data
    const readableStream = require("stream").Readable.from(csvData);

    readableStream
      .pipe(csvParser({ separator: "," })) // Use csv() to parse the CSV data
      .on("data", (row) => {
        results.push(row);
      })
      .on("end", () => {
        console.log("CSV parsing is complete.");
      })
      .on("error", (error) => {
        console.error("An error occurred:", error.message);
        return { status: 500, data: "An error occurred during CSV parsing." };
      });
    return {
      status: 200,
      message: "working",
      data: results,
    };
  } catch (error) {
    // try {
    //   return {
    //     status: 200,
    //     message: "working",
    //     data: "results",
    //   };}
    console.error(error);
    return { status: 500, message: "CSV file not imported." };
  }
};
