const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const Users = require("./models/users.model");

require("dotenv").config();

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }

  return token;
};

// Authorization
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.PASSPORTJS_KEY,
    },
    (payload, done) => {
      Users.findById({ _id: payload.sub }, (err, user) => {
        if (err) return done(err, false);

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    }
  )
);

// Authentication password local strategy using username and password
passport.use(
  new LocalStrategy((username, password, done) => {
    Users.findOne({ username }, (err, user) => {
      //something went wrong databese error
      if (err) return done(err);

      //if no user error exits
      if (!user) return done(null, false);
      user.comparePassword(password, done);
    });
  })
);
