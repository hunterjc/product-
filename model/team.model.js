const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-aggregate-paginate-v2");
const socialLinkSchema = new mongoose.Schema({
  site: {
    type: String,
    default: null,
  },
  link: {
    type: String,
    default: null,
  },
});

const nameSchema = new mongoose.Schema({
  firstName: {
    type: String,
    default: null,
  },
  lastName: {
    type: String,
    default: null,
  },
});
const userSchema = new mongoose.Schema(
  {
    name: { type: nameSchema, default: null },
    email: {
      type: String,
      lowercase: true,
    },
    designation: {
      type: String,
    },
    socialLink: { type: [socialLinkSchema], default: null },
    phone: {
      type: Number,
      default: null,
    },

    image: { type: String, default: null },
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
userSchema.plugin(mongoosePaginate);
const User = mongoose.model("teams", userSchema);

module.exports = User;
