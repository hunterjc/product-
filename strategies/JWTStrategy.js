const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../model/user.model");

// const opts = {}
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
// opts.secretOrKey = process.env.JWT_SECRET_KEY

// Used by the authenticated requests to deserialize the user,
// i.e., to fetch user details from the JWT.
// Create JWT strategy

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    },
    (jwtPayload, done) => {
      if (jwtPayload.exp < Date.now() / 1000) {
        return done(null, false, { expired: true });
      }

      return User.findOne({
        $or: [{ email: jwtPayload.email }, { _id: jwtPayload._id }],
      })
        .select("-password -refreshTokens")
        .lean()
        .then((user) => {
          //  console.log(user,'user')
          if (!user) {
            return done("not found", {});
          } else {
            return done(null, { ...user, type: "user" });
          }
        })
        .catch((err) => {
          return done(err);
        });
    }
  )
);
