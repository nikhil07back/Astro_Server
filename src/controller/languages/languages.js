import mongoose from "mongoose";
import Lang from "../../model/language/modulelang.js";

export const addLanguage = async (req, res) => {
    try {
        const data = req.body;
        console.log(req.body);
        const exist = await Lang.findOne({ lang: data?.lang });
        if (exist) {
            return res.status(400).json({ message: "Language already exists" });
        }
        const newLanguage = new Lang({
            lang: data?.lang,
        });
        const response = await newLanguage.save();
        return res.status(200).json({ message: "Success", data: response });
    } catch (err) {
        console.error("Error adding language:", err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
};  

export const getAllLanguage = async (req, res) => {
    try {
        const languages = await Lang.find();
        return res.status(200).json({ message: "Success", data: languages });
    } catch (err) {
        console.error("Error fetching languages:", err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
};

export const updateLanguage = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid or missing ID format" });
        }
        const existingLanguage = await Lang.findByIdAndUpdate(id, data, {
            new: true,
        });
        if (!existingLanguage) {
            return res.status(404).json({ message: "Language not found" });
        }
        res.status(200).json({ message: "Language updated successfully", data: existingLanguage });
    } catch (err) {
        console.error("Error updating language:", err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
};

export const deleteLanguage = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        const deletedLanguage = await Lang.findByIdAndDelete(id);
        if (!deletedLanguage) {
            return res.status(404).json({ message: "Language not found" });
        }
        res.status(200).json({ message: "Language deleted successfully", data: deletedLanguage });
    } catch (err) {
        console.error("Error deleting language:", err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
};
