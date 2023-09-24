const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/csv.model");
const { ObjectId } = require("mongoose").Types;
const faqSection = require("../model/faq.model");
const faqType = require("../model/faqCategory.mode");
const { uploadCloudinary } = require("../utils/cloudinary.js");
const { convertFieldsToAggregateObject } = require("../helper/index");
const { Parser } = require("json2csv");
const csvParser = require("csv-parser");
const fs = require("fs");
const multer = require("multer");
const os = require("os");
const upload = multer({ dest: os.tmpdir() });
const { promisify } = require("util");
const parseCsv = promisify(csvParser);

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

// exports.List = async (req, res) => {
//   try {
//     const params = req.query;
//     params.searchValue = params.searchValue || "typefaq,status,image,ordering";
//     params.selectValue = params.selectValue || "typefaq,status,image,ordering";

//     const {
//       keyword,
//       searchValue,
//       selectValue,
//       sortQuery = "-createdAt",
//       offset = 0,
//       limit,
//     } = params;

//     const selectedFields = selectValue && selectValue.replaceAll(",", " ");
//     const query = { deletedAt: null };

//     if (keyword) {
//       let searchQuery = searchValue
//         ? searchValue.split(",")
//         : selectedFields.split(" ");
//       query.$or = search(searchQuery, keyword);
//     }

//     const data = await faqType.paginate(query, {
//       select: selectedFields,
//       sort: sortQuery,
//       limit: limit ? limit : 10,
//       offset: offset ? offset : 0,
//     });

//     // Now, let's generate and send the CSV response
//     const information = [
//       { country: "india", population: "205m", continent: "Asia" },
//       { country: "uk", population: "206m", continent: "England" },
//     ];
//     const fields = ["country", "population", "continent"];
//     const json2csvParser = new Parser({ fields });
//     const dat23 = json2csvParser.parse(information);

//     // Set the appropriate headers for a CSV file response
//     // res.setHeader("Content-Type", "text/csv");
//     // res.set({
//     //   "Content-Type": "text/csv",
//     //   "Content-Disposition": "attachment; filename=information.csv",
//     // });

//     // Send the CSV data as the response
//     res.status(200).send("dat23");
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ status: 500, message: err.message });
//   }
// };

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
exports.csvImport1 = async (req) => {
  try {
    if (!req.file) {
      return { status: 400, data: "No CSV file uploaded." };
    }

    const csvData = req.file.buffer.toString("utf-8");
    const results = [];

    // Use 'await' to parse the CSV data as a promise
    await parseCsv(csvData, { separator: "," })
      .on("data", (row) => {
        results.push(row);
      })
      .on("end", () => {
        console.log("CSV parsing is complete.");
      })
      .on("error", (error) => {
        console.error("An error occurred:", error.message);
        throw { status: 500, data: "An error occurred during CSV parsing." };
      });

    return { status: 200, message: "CSV parse completed.", data: results };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "CSV file not imported." };
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
// // try {
//     // Retrieve data from your database or any source
//     const faqData = await faqType.find({ deletedAt: null });

//     // Define the fields you want to export to CSV
//     const fields = ["typefaq", "status", "image", "ordering"];

//     // Transform your data into an array of objects
//     const dataToExport = faqData.map((item) => ({
//       typefaq: item.typefaq,
//       status: item.status,
//       image: item.image,
//       ordering: item.ordering,
//     }));

//     // Create a CSV parser and convert data to CSV format
//     const json2csvParser = new Parser({ fields });
//     const csvData = json2csvParser.parse(dataToExport);

//     // Set the appropriate headers for a CSV file response
//     res.setHeader("Content-Type", "text/csv");
//     res.setHeader("Content-Disposition", "attachment; filename=faqData.csv");

//     // Send the CSV data as the response
//     res.status(200).send(csvData);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ status: 500, message: "Internal Server Error" });
//   }
// });
