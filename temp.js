db.collection('users').aggregate([
    { $match: cond },
    { $lookup: {
      from: 'rooms',
      let: { "user_id": "$_id" },
      pipeline: [
       { $match:{ $expr: { $eq: ["$user", "$$user_id"] } } },
       { $lookup: {
         from: 'room_prices',
         let: { 'name': '$name' },
         pipeline: [
           { $match: { $expr: { $eq: [ '$room', '$$name'] } } },
           { $project: { _id: 0, morning: 1, afternoon: 1 } }
         ],
         as: 'room_prices'
       }}
      ],
      as: "rooms"
    }}
  ])


   const myAggregate = Job.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "jobtypes",
          localField: "jobtype",
          foreignField: "_id",
          as: "JobType",
          pipeline: [
            {
              $match: { $expr: { $eq: ["$createdAt", null] } },
            },
            {
              $project: { description: 1, price: 1, status: 1, categoryId: 1 },
            },
          ],
        },
      },
      { $project: { name: 1, jobid: 1, jobtype: 1, JobType: 1 } },
    ]);


    db.jobs.aggregate({
      $lookup:{
        from: "jobtypes",
          localField: "jobtype",
          foreignField: "_id",
          as: "JobType"
      }
    })