const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    avatar: { type: String },
    email: { type: String, lowercase: true, trim: true },
    phoneNumber: { type: String, trim: true },
    password: { type: String },
    resetLink: { type: String, default: null },
    isVerifiedPhoneNumber: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    status: { type: Number, required: true, default: 1, enum: [0, 1, 2] }, // 0, 1, 2
    role: { type: String, default: "USER" },
    level: {
      _id: false,
      type: {
        0: [{ type: String }],
        1: [{ type: String }],
        2: [{ type: String }],
        3: [{ type: String }],
        4: [{ type: String }],
      },
      default: {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// UserSchema.virtual("avatarUrl").get(function () {
//   if (this.avatar) return `${process.env.SERVER_URL}/${this.avatar}`;
//   return null;
// });

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.avatar;
  return obj;
};

UserSchema.index({
  name: "text",
  email: "text",
  phoneNumber: "text",
  username: "text",
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
