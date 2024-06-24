import mongoose from "mongoose";
const generalSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  phone: {
    type: Number,
    require: false,
  },    
  currency: {
    type: String,
    require: false,
  },
  siteCode: {
    type: Number,
    require: false,
  },
  email: {
    type: String,
    require: false,
  },
  currencySymbol: {
    type: String,
    require: false,
  },
  logo: {
    type: String,
    require: false,
  },
  smallLogo: {
    type: String,
    require: false,
  },
});
const generalSetting = mongoose.model("Setting", generalSchema);
export default generalSetting;
