import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Reg from "../../model/registration/modulereg.js";
// import Admin from "../../model/registration/adminModel.js";
// import Astrologer from "../../model/registration/astrologerModel.js";

export const addRegistration = async (req, res) => {
  try {
    const data = req.body;
    console.log("Received data:", data.email);
    const exist = await Reg.findOne({ email: data?.email });
    if (exist) {
      return res.status(400).json({ message: "Registration already exists" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data?.password, saltRounds);
    console.log("hashedPasswordhashedPassword", hashedPassword);

    const newRegistration = new Reg({
      name: data?.name,
      gender: data?.gender,
      dateOfBirth: data?.dateOfBirth,
      timeOfBirth: data?.timeOfBirth,
      placeOfBirth: data?.placeOfBirth,
      email: data?.email,
      password: hashedPassword,
      phoneNumber: data?.phoneNumber,
      userType: "user",
    });
    const response = await newRegistration.save();

    return res.status(201).json({
      message: "Registration successful",
      data: {
        registration: response,
        // admin: adminResponse,
        // astrologer: astrologerResponse,
      },
    });
  } catch (err) {
    console.error("Error during registration:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

export const updateRegistration = async (req, res) => {
  try {
    const { id } = req.body;
    const data = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid or missing ID format" });
    }

    const updatedRegistration = await Reg.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updatedRegistration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    return res.status(200).json({
      message: "Registration updated successfully",
      data: updatedRegistration,
    });
  } catch (err) {
    console.error("Error updating registration:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await Reg.find();
    const totalUsers = await Reg.countDocuments();
    return res.status(200).json({ message: 'success', data: users, totalUsers });
  } catch (err) {
    console.error('Error fetching users:', err);
    return res
      .status(500)
      .json({ message: 'Internal server error', error: err });
  }
};