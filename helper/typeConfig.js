exports.Status = { ACTIVE: 1, INACTIVE: 2, DRAFT: 3 };

exports.Featured = { FEATURED: 1, UNFEATURED: 2 };

exports.UserRole = { USER: "user", ADMIN: "admin" };

exports.TopicType = {
  WHYUS: 1,
  FUNDSFOR: 2,
  HOWITWORKS: 3,
  NEESDS: 4,
  MEDICALTREATMENTS: 5,
  NGOCHARITY: 6,
  OTHERCAUSE: 7,
};

exports.TestimonialType = { TESTIMONIAL: 1, TEAM: 2 };

exports.MapLocationType = {
  POINT: "Point",
  LINE_STRING: "LineString",
  PLOYGON: "Polygon",
  MULTI_POINT: "MultiPoint",
};

exports.SelectFields = {
  USER_HIDDEN_FIELDS: {
    password: 0,
    authStrategy: 0,
    refreshTokens: 0,
    createdBy: 0,
    updatedBy: 0,
    deletedAt: 0,
    deletedBy: 0,
    otp: 0,
    otpTime: 0,
    ordering: 0,
    stripeProductId: 0,
  },
  USER_BASIC_FIELDS: { fullname: 1, email: 1, phone: 1, image: 1 },
};

exports.EmailTemplateCode = {
  SEND_OTP_EMAIL: "send-otp-email",
};
