import mongoose from "mongoose";
import bcrypt from "bcrypt";

const subscriptionSchema = new mongoose.Schema(
  {
    amount: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  timeOfBirth: {
    type: String,
    required: true,
  },
  placeOfBirth: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    // match: /^\d{10}$/
  },

  userType: {
    type: String,
    required: true,
    // match: /^\d{10}$/
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  timeOfBirth: {
    type: String,
    required: true,
  },
  placeOfBirth: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    // match: /^\d{10}$/
  },
  userType: {
    type: String,
    required: true,
  },
  paymentHistory: [subscriptionSchema],

  wailet: {
    type: Number,
    required: true,
    default: 0,
  },
});
const Reg = mongoose.model("Registration", registrationSchema);
export default Reg;
  