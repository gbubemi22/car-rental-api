import validator from 'validator';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ACCOUNT_TYPES from '../constant/index.js';


import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema({


  firstname: {
    type: String,
    required: [true, "Please enter your first name"],
  },
  lastname: {
    type: String,
    required: [true, "Please enter your lastname"],
  },
  number: {
    type: String,
    required: [true, "Please enter your phone number"],
    max: 13,
  },
  email: {
    type: String,
    required: [true, "Please enter your email address"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [, "Please provide a valid password"],
  },

  type: {
    type: String,
    type: String,
  enum: Object.values(ACCOUNT_TYPES),
  default: ACCOUNT_TYPES.USER,
  },

  image: {
    type: String,
  },


  image: {
    type: String,
    required: false,

  },
  address: {
    type: String,
    required: false

  },



  blocked: {
    type: Boolean,
    default: false,
  },
  verifiedEmail: {
    type: Boolean,
    default: false,
  },
  verifiedNumber: {
    type: Boolean,
    default: false,
  }

}, { timestamps: true })



UserSchema.pre('save', async function () {

  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, email: this.email, firstname: this.firstname, lastname: this.lastname },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
}

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

UserSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      id: this._id,
      number: this.number,
    },
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );
  return token;
};




const User = mongoose.model("User", UserSchema);
export default User;