const { default: mongoose } = require("mongoose");
const { MapLocationType, Status } = require("../helper/typeConfig");

const coordinatesSchema = mongoose.Schema({
  lat: { type: Number, default: null },
  lng: { type: Number, default: null },
});

const locationSchema = mongoose.Schema({
  address1: { type: String, default: null },
  address2: { type: String, default: null },
  city: { type: String, default: null },
  state: { type: String, default: null },
  country: { type: String, default: null },
  zipcode: { type: String, default: null },
  type: {
    type: String,
    enum: Object.values(MapLocationType),
    default: MapLocationType.POINT,
  },
  coordinates: { type: coordinatesSchema, default: null },
});

const socialMediaSchema = mongoose.Schema({
  name: { type: String, default: null },
  icon: { type: String, default: null },
  image: { type: String, default: null },
  url: { type: String, default: null },
  status: { type: Number, enum: Object.values(Status), default: Status.ACTIVE },
});

const fileSchema = mongoose.Schema({
  url: { type: String, default: null },
  filename: { type: String, default: null },
  size: { type: String, default: null },
  extension: { type: String, default: null },
});

module.exports = { locationSchema, socialMediaSchema, fileSchema };
