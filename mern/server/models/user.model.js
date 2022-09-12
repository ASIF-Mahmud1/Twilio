const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please provide an Email!"],
    unique: [true, "Email Exist"],
  },

  password: {
    type: String,
    required: [true, "Please provide a password!"],
    unique: false,
  },
  admin: {
    type: Boolean,
    default: false,
    unique: false,
  },
})

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);