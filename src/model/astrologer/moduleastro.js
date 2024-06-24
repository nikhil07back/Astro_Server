import mongoose from "mongoose";

const astroSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    trim: false,
  },
  email: {
    type: String,
    required: true,
    trim: false,
  },
  image: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  contactNo: {
    type: String,
    required: false,
  },
  expertise: {
    type: [String],
    required: false,
  },
  languages: {
    type: [String],
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  experience: {
    type: Number,
    required: false,
  },
  ratings: [
    {
      rating: { type: Number, required: false, min: 1, max: 5 },
      //   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  orders: {
    type: Number,
    default: 0,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  aboutAstrologer: {
    type: String,
    required: false,
  },
  status: {
    type: Boolean,
    required: false,
  },
  visibility: {
    type: Boolean,
    require: false,
  }
});

const Astro = mongoose.model("Astrologer", astroSchema);
export default Astro;
