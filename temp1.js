//  const myAggregate1=Job.aggregate([
//       {$match:query},
//       {$lookup:{
//         from: "jobtypes",
//         localField: "jobtype",
//         foreignField: "_id",
//         as: "JobType",
//         pipeline:[
//           {
//             $match: { $expr: { $eq: ["$createdAt", null] } },
//           },{
//             $project: { description: 1, price: 1, status: 1, categoryId: 1 },
//           },{$lookup:{
//             from: "jobcategories",
//             localField: "categoryId",
//             foreignField: "_id",
//             as: "JobType",
//             pipeline:[
//               {
//                 $match: { $expr: { $eq: ["$deletedAt", null] } },
//               },{
//                 $project: { description: 1, price: 1, status: 1, categoryId: 1 },
//               },
//             ]
//           }}
//         ]
//       }}
//     ])

const { db } = require("./model/job.model");

// // stage 2
//     const myAggregate1 = Job.aggregate([
//       { $match: query },
//       {
//         $lookup: {
//           from: "jobtypes",
//           localField: "jobtype",
//           foreignField: "_id",
//           as: "JobType",
//           pipeline: [
//             {
//               $match: { $expr: { $eq: ["$createdAt", null] } },
//             },
//             {
//               $project: { description: 1, price: 1, status: 1, categoryId: 1 },
//             },
//             {
//               $lookup: {
//                 from: "jobcategories",
//                 localField: "categoryId",
//                 foreignField: "_id",
//                 as: "JobType",
//                 pipeline: [
//                   {
//                     $match: { $expr: { $eq: ["$deletedAt", null] } },
//                   },
//                   {
//                     $project: {
//                       description: 1,
//                       price: 1,
//                       status: 1,
//                       categoryId: 1,
//                     },
//                   },
//                 ],
//               },
//             },
//           ],
//         },
//       },
//     ]);

//     {$lookup:{
//       from:"jobcategories",
//       localField:"",
//       foreignField:"",
//       as:"",
//       pipeline:[
//           {
//               $match:{$expr:{$eq:["$createdAt", null]}}
//           }
//       ]
//     }}

// db.employees.aggregate([
//   {$match:{name:"chinmoy"}}
// ])

// _id: new ObjectId(params.authUser._id),


