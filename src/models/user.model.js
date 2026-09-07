const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { userType, userTypeValues } = require("../constant/user-type");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
      select: false,
    },

    name: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: userTypeValues,
      default: userType.customer,
      required: true,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_document, returnedUser) => {
        delete returnedUser.password;
      },
    },
    toObject: {
      transform: (_document, returnedUser) => {
        delete returnedUser.password;
      },
    },
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
