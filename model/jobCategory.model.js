const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-aggregate-paginate-v2");
const { Status } = require("../helper/typeConfig");

const jobCategorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      trim: true,
      required: ["Category field is required"],
    },
    status: {
      type: Number,
      enum: Object.values(Status),
      default: Status.ACTIVE,
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
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

jobCategorySchema.plugin(mongoosePaginate);
module.exports = mongoose.model("jobcategories", jobCategorySchema);
