import customField from "../../model/customField/custommFIeld.js";
import customFieldConsultant from "../../model/customField/customFieldConsultant.js";
import mongoose from "mongoose";

export const customFieldUser = async (req, res) => {
  try {
    const {
      fieldName,
      fieldType,
      fieldValues,
      grid,
      Validation,
      Visibility,
      fieldBelongs,
    } = req.body;

    const validFieldTypes = [
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
    ];
    if (!validFieldTypes.includes(fieldType)) {
      return res.status(400).json({ error: "Invalid fieldType" });
    }

    let gridValue;
    if (grid === undefined || grid === "") {
      gridValue = 6;
    } else {
      gridValue = parseInt(grid, 10);
      if (isNaN(gridValue) || gridValue < 1 || gridValue > 12) {
        return res.status(400).json({
          error: "Invalid grid value, must be a number between 1 and 12",
        });
      }
    }

    const newCustomField = new customField({
      fieldBelongs: fieldBelongs, // === "User" ? "User" : "consultant",
      fieldName,
      fieldType,
      fieldValues,
      grid: gridValue,
      Validation,
      Visibility,
    });
    const savedCustomField = await newCustomField.save();
    res.status(201).json(savedCustomField);
  } catch (error) {
    console.error("Error creating customFields:", error);
    return res.status(500).json({ error: "Could not create customFields" });
  }
};

export const customFieldConsultants = async (req, res) => {
  try {
    const {
      //   fieldBelongs,
      //   fieldName,
      fieldType,
      fieldValues,
      //   grid,
      Validation,
      Visibility,
    } = req.body;

    const validFieldTypes = [
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
    ];
    if (!validFieldTypes.includes(fieldType)) {
      return res.status(400).json({ error: "Invalid fieldType" });
    }

    const fieldValueTypes = ["option1", "option2", "option3"];
    if (!fieldValueTypes.includes(fieldValues)) {
      return res.status(400).json({ error: "Invalid fieldValues" });
    }
    if (Validation !== undefined && typeof Validation !== "boolean") {
      return res
        .status(400)
        .json({ error: "Invalid Validation value, must be a boolean" });
    }
    if (Visibility !== undefined && typeof Visibility !== "boolean") {
      return res
        .status(400)
        .json({ error: "Invalid Visibility value, must be a boolean" });
    }

    let { fieldBelongs, fieldName, grid } = req.body;
    // if (!fieldBelongs || fieldBelongs.trim() === "") {
    //   fieldBelongs = "Consultant";
    // }
    if (!fieldName || fieldName.trim() === "") {
      fieldName = "Please enter a field name";
    }
    if (!grid || grid.trim() === "") {
      grid = 6;
    }
    if (!grid || isNaN(grid) || grid < 2 || grid > 11) {
      return res.status(400).json({
        error: "Invalid grid value, must be a number between 2 and 11",
      });
    }

    const newcustomFieldConsultant = new customFieldConsultant({
      fieldName,
      fieldType,
      fieldValues,
      grid,
      Validation,
      Visibility,
    });

    const savedCustomField = await newcustomFieldConsultant.save();

    res.status(201).json(savedCustomField);
  } catch (error) {
    console.error("Error creating customFields:", error);
    return res.status(500).json({ error: "Could not create customFields" });
  }
};

export const getUserCustomField = async (req, res) => {
  try {
    let fieldBelongs = req.query.fieldBelongs || "User";

    // If fieldBelongs is neither "User" nor "Consultant", default to "User"
    if (fieldBelongs !== "User" && fieldBelongs !== "consultant") {
      fieldBelongs = "User" ? "consultant" : fieldName;
    }

    let CustomFieldModel;

    if (fieldBelongs === "User") {
      CustomFieldModel = customField;
    } else if (fieldBelongs === "consultant") {
      CustomFieldModel = customFieldConsultant;
    } else {
      CustomFieldModel = customFieldConsultant;
    }

    // Query the selected model for custom fields
    const getCustomField = await CustomFieldModel.find();

    return res.status(200).json({ message: "Success", data: getCustomField });
  } catch (error) {
    console.error("Error fetching customField:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
};

export const getConsultantCustomField = async (req, res) => {
  try {
    const getCustomField = await customFieldConsultant.find();
    return res.status(200).json({ message: "Success", data: getCustomField });
  } catch (error) {
    console.error("Error fetching customField:", error);
    return res
      .status(500)
      .json({ message: "internal server error", error: error });
  }
};

export const deleteCustomField = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.query , "123456787654321234567654321")
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const deletedCustomField = await customField.findByIdAndDelete(id);
    if (!deletedCustomField) {
      return res.status(404).json({ message: "CustomField not found" });
    }
    res.status(200).json({ message: "CustomField deleted successfully" });
  } catch (err) {
    console.error("Error deleting CustomField:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
};
