const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-aggregate-paginate-v2");


const jobScheduleSchema = new mongoose.Schema(
  {
    shift: {
      type: String,
      trim: true,
      required: ["Shift field is required"],
    },
    schedule: {
      type: String,
      trim: true,
      required: ["Schedule field is required"],
    },
    status: {
      type: Number,
      enum:[1,2]
    },
    ordering: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      default: null,
    },
  },
  { timestamps: true }
);

jobScheduleSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("jobschedules", jobScheduleSchema);
