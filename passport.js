const passport = require("passport");
const { JWT_SECRET, oauth } = require("./configuration");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { Strategy: LocalStrategy } = require("passport-local");
const GooglePlusTokenStrategy = require("passport-google-plus-token");
const FacebookTokenStrategy = require("passport-facebook-token");
const User = require("./models/User");

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        // find the user specified in token
        const user = await User.findById(payload.sub);

        // if user doesn't exist handle it
        if (!user) {
          return done(null, false);
        }
        // otherwise retunr the user
        done(null, user);
      } catch (e) {
        done(e, false);
      }
    },
  ),
);

passport.use(
  "googleToken",
  new GooglePlusTokenStrategy(
    {
      clientID: oauth.google.clientID,
      clientSecret: oauth.google.clientSecret,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ "google.id": profile.id });

        if (existingUser) {
          console.log("user already exist in our DB");

          return done(null, existingUser);
        }

        console.log("user doesn't exist in our DB");
        const newUser = new User({
          method: "google",
          google: {
            id: profile.id,
            email: profile.emails[0].value,
          },
        });
        await newUser.save();

        done(null, newUser);
      } catch (e) {
        done(e, false, e.message);
      }
    },
  ),
);

passport.use(
  "facebookToken",
  new FacebookTokenStrategy(
    {
      clientID: oauth.facebook.clientID,
      clientSecret: oauth.facebook.clientSecret,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("done = ", done);
      console.log("profile = ", profile);
      console.log("refreshToken = ", refreshToken);
      console.log("accessToken = ", accessToken);
      try {
        const existingUser = await User.findOne({ "facebook.id": profile.id });

        if (existingUser) {
          console.log("user already exist in our DB");

          return done(null, existingUser);
        }

        console.log("user doesn't exist in our DB");
        const newUser = new User({
          method: "facebook",
          facebook: {
            id: profile.id,
            email: profile.emails[0].value,
          },
        });
        await newUser.save();

        done(null, newUser);
      } catch (e) {
        done(e, false, e.message);
      }
    },
  ),
);

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, passowrd, done) => {
      try {
        const user = await User.findOne({ "local.email": email });

        if (!user) {
          return done(null, false);
        }

        const isMatch = await user.isValidPassword(passowrd);

        if (!isMatch) {
          return done(null, false);
        }

        done(null, user);
      } catch (e) {
        done(e, false);
      }
    },
  ),
);
