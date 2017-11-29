const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { Schema } = mongoose;

const userSchema = new Schema({
  method: {
    type: String,
    enum: ["local", "google", "facebook"],
    required: "Method is required",
  },
  local: {
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
  },
  google: {
    id: String,
    email: {
      type: String,
      lowercase: true,
    },
  },
  facebook: {
    id: String,
    email: {
      type: String,
      lowercase: true,
    },
  },
});

userSchema.pre("save", async function(next) {
  try {
    if (this.method !== "local") {
      return next();
    }

    bcrypt.hash(
      this.local.password,
      saltRounds,
      async (err, hashedPassword) => {
        this.local.password = hashedPassword;
        next();
      },
    );
  } catch (e) {
    next(e);
  }
});

userSchema.methods.isValidPassword = function(plainPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, this.local.password, (err, response) => {
      if (err) {
        reject(err);
      }

      resolve(response);
    });
  });
};

module.exports = mongoose.model("user", userSchema);
