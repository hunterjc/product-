const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-aggregate-paginate-v2");

const jobSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    jobid: {
      type: Number,
      required: true,
    },
    jobtypes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "jobtypes",
      default: null,
    },
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
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

jobSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("job", jobSchema);
