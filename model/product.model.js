const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-aggregate-paginate-v2");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    category: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "productCategories",
      default: null,
    },
    tags: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "productTags",
      default: null,
    },
    organization: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "productOrganizations",
      default: null,
    },
    price: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      enum: [1, 2],
      default: 1,
    },
    featured: {
      type: Boolean,
      default: false,
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
      default: null,
      ref: "categories",
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

productSchema.plugin(mongoosePaginate);
const Products = mongoose.model("products", productSchema);

module.exports = Products;
