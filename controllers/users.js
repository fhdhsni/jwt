const JWT = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../configuration");

signToken = user => {
  return JWT.sign(
    {
      iss: "farhad",
      sub: user._id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1), // current time + 1 day ahead
    },
    JWT_SECRET,
  );
};

module.exports = {
  signUp: async (req, res, next) => {
    const { email, password } = req.value.body;
    // check if there's a user with the same email
    const foundUser = await User.findOne({ "local.email": email });

    if (foundUser) {
      return res.status(403).json({ error: "email already in use" });
    }
    // create a new user
    const newUser = new User({
      method: "local",
      local: {
        email,
        password,
      },
    });
    const user = await newUser.save();
    // respond with token
    const token = signToken(user);

    res.status(200).json({ token });
  },
  signIn: async (req, res, next) => {
    const token = signToken(req.user);
    res.json({ token });
  },
  secret: async (req, res, next) => {
    res.json({ secret: "resource" });
  },

  googleOAuth: async (req, res, next) => {
    console.log(req.user);
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  facebookOAuth: async (req, res, next) => {
    console.log(req.user);
    const token = signToken(req.user);
    res.status(200).json({ token });
  },
};
