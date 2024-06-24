import mongoose from "mongoose";
import Exp from "../../model/modules/moduleexp.js";

export const addExpertise = async (req, res) => {
  try {
    const data = req.body;
    console.log(req.body);

    if (!data?.skills) {
      return res.status(400).json({ message: "Skills field is required" });
    }

    const existingExp = await Exp.findOne({ skills: data.skills });

    if (existingExp) {
      return res.status(400).json({ message: "Expertise already exists" });
    }

    const newExp = new Exp({
      skills: data.skills,
      // active: data.active,
    });  

    const response = await newExp.save();

    return res.status(200).json({ message: "Success", data: response });
  } catch (err) {
    console.error("Error:", err);

    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", error: err.message });
    }

    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

export const getAllExpertise = async (req, res) => {
  try {
    const expertises = await Exp.find();
    return res.status(200).json({ message: "sucess", data: expertises });
  } catch (err) {
    console.error("Error fetching expertises:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
};

export const updateExpertise = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid or missing ID format" });
    }
    const existingExpertise = await Exp.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!existingExpertise) {
      return res.status(404).json({ message: "Expertise not found" });
    }
    res
      .status(200)
      .json({
        message: "Expertise updated successfully",
        data: existingExpertise,
      });
  } catch (err) {
    console.error("Error updating expertises:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
};

export const deleteExpertise = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id123", id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const deletedExpertise = await Exp.findByIdAndDelete(id);
    if (!deletedExpertise) {
      return res.status(404).json({ message: "Module not found" });
    }
    res.status(200).json({
      message: "Expertise deleted successfully",
      data: deletedExpertise,
    });
  } catch (err) {
    console.error("Error updating expertises:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
};
