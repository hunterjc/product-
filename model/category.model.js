const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-aggregate-paginate-v2");

const categorySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      ref: "user",
      required: true,
      unique: true,
    },
    description: String,
    status: {
      type:Number,
      enum: [1, 2],
      default: 1,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "user",
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

categorySchema.plugin(mongoosePaginate);
const Category = mongoose.model("categories", categorySchema);

module.exports = Category;
