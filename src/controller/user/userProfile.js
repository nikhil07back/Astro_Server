import Reg from "../../model/registration/modulereg.js";
import mongoose from "mongoose";

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("idddddd",id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const user = await Reg.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User found", data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid or missing ID format" });
    }

    const updatedUser = await Reg.findByIdAndUpdate(
      { _id: id },
      {
        name: userData.name,
        gender: userData.gender,
        dateOfBirth: userData.dateOfBirth,
        timeOfBirth: userData.timeOfBirth,
        placeOfBirth: userData.placeOfBirth,
        // email: userData.email,
        // password: userData.password,
        phoneNumber: userData.phoneNumber,
        // userType: userData.userType,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
