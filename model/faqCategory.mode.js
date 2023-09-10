const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const faqType = new mongoose.Schema(
  {
    typefaq: {
      type: String,
      default: null,
    },
    image: { type: String, default: null },
    ordering: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
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

faqType.plugin(mongoosePaginate);
module.exports = mongoose.model("faqtypes", faqType);
