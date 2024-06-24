import mongoose from "mongoose";
const customFieldSchema = new mongoose.Schema({
  fieldBelongs: {
    type: String,
    required: true,
    enum: ["user", "consultant"],
    // default: "User",
  },
  fieldName: {
    type: String,
    required: false,
    default: "User",
  },
  fieldType: {
    type: String,
    required: false,
    enum: [
      "Inputs",
      "Numbers",
      "Buttons",
      "Textarea",
      "DropDowns",
      "Check Box",
      "Multi Select",
      "datepicker",
      "datetimepicker",
      "colorpicker",
      "hyperlinks",
      "email",
      "password",
      "radio",
    ],
  },
  fieldValues: {
    type: String,
    required: false,
    // enum: ["option1", "option2", "option3"],
  },
  grid: {
    type: String,
    required: false,
    min: 1,
    max: 12,
    default: 6,
  },
  Validation: {
    type: Boolean,
    required: false,
  },
  Visibility: {
    type: Boolean,
    required: false,
  },
});
const customField = mongoose.model("UserField", customFieldSchema);
export default customField;
