import mongoose from "mongoose";

const priceSchema = new mongoose.Schema({
  callPrice: {
    type: Number,
    require: true,
  },
  chatPrice: {
    type: Number,
    require: true,
  },
});

const Price = mongoose.model("Price", priceSchema);
export default Price;

