import mongoose from "mongoose";
import Astro from "../../model/astrologer/moduleastro.js";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/astrologerImages");
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now() + file.originalname}`;
    cb(null, fileName);
  },
});

 const uploads = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [".jpg", ".jpeg"];
    const extension = path.extname(file.originalname);
    if (!allowedExtensions.includes(extension)) {
      cb(new Error("Only JPEG/JPG images are allowed"));
    } else {
      cb(null, true);
    }
  },
}).single("file");
 
export const addAstrologer = async (req, res) => {
  uploads(req, res, async (err) => {
    if (err) {
      console.log("Error during file upload:", err);
      return res.status(500).json({
        message: "Invalid file format. Only JPEG/JPG images are allowed",
        error: err,
      });
    }

    try {
      console.log("Received data:", req.body.data);
      const data = JSON.parse(req.body.data);

      console.log("tfghghjgj", data);
      const exist = await Astro.findOne({ email: data?.email });

      if (exist) {
        // console.log("Astrologer already exists");
        return res.status(400).json({ message: "Astrologer already exists" });
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(data?.password, saltRounds);
      console.log("hashedPasswordhashedPassword", hashedPassword);

      const fileName = req.file ? req.file.filename : null;

      const astor = new Astro({
        name: data?.name,
        image: fileName,
        gender: data?.gender,
        contactNo: data?.contactNo,
        expertise: data?.expertise,
        languages: data?.languages,
        price: data?.price,
        experience: data?.experience,
        password: hashedPassword,
        userType: "astrologer",
        email: data?.email,
        aboutAstrologer: data?.aboutAstrologer,
        status: data?.status,
        visibility: data?.visibility,
      });
      const response = await astor.save();
      return res.status(200).json({ message: "success", data: response });
    } catch (err) {
      console.log("err", err);
      return res
        .status(500)
        .json({ message: "Internal server error", error: err });
    }
  });
};


export const addRating = async (req, res) => {
  try {
    const ratings = req.body;
    console.log(ratings);
    const astrologer = await Astro.findByIdAndUpdate(
      ratings.astrologerId,
      { $push: { ratings: { rating: ratings.rating } } },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Rating added successfully", data: astrologer });
  } catch (err) {
    console.error("Error adding rating:", err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
};
export const getAllAstrologer = async (req, res) => {
  try {
    let sortCriteria = {};

    if (req.query.experienceSortOrder) {
      sortCriteria.experience =
        req.query.experienceSortOrder === "desc" ? -1 : 1;
    } else if (req.query.priceSortOrder) {
      sortCriteria.price = req.query.priceSortOrder === "desc" ? -1 : 1;
    }

    const languageToSort = req.query.language;
    const expertiseToSort = req.query.expertise;

    let astrologersQuery = { userType: "astrologer" };

    if (expertiseToSort) {
      astrologersQuery.expertise = expertiseToSort;
    }

    if (languageToSort) {
      astrologersQuery.languages = languageToSort;
    }

    const astrologers = await Astro.find(astrologersQuery).sort(sortCriteria);
    const totalAstrologers = await Astro.countDocuments(astrologersQuery);

    console.log("astrologers", astrologers);
    return res.status(200).json({ 
      message: "success", 
      data: astrologers, 
      total: totalAstrologers 
    });
  } catch (err) {
    console.error("Error fetching astrologers:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
};

export const getRating = async (req, res) => {
  try {
    const { astrologerId } = req.body;
    const astrologer = await Astro.findById(astrologerId);

    if (!astrologer) {
      return res.status(404).json({ message: "Astrologer not found" });
    }
    const ratings = astrologer.ratings;

    if (!ratings || ratings.length === 0) {
      return res
        .status(200)
        .json({ message: "No ratings available", averageRating: 0 });
    }
    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRating / ratings.length;

    res.status(200).json({
      message: "Average rating retrieved successfully",
      averageRating,
    });
  } catch (err) {
    console.error("Error retrieving average rating:", err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
};

export const updateAstrologer = async (req, res) => {
  uploads(req, res, async (err) => {
    if (err) {
      console.error("Error uploading file:", err);
      return res
        .status(500)
        .json({ message: "Internal server error", error: err });
    }

    try {
      const { id } = req.params;
      const data = JSON.parse(req.body.data);

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ message: "Invalid or missing ID format" });
      }

      let fileName = null;
      if (req.file) {
        fileName = req.file.filename;
      } else {
        const existingAstrologer = await Astro.findById(id);
        if (existingAstrologer) {
          fileName = existingAstrologer.image;
        }
      }

      const updatedAstrologer = await Astro.findByIdAndUpdate(
        { _id: id },
        {
          name: data?.name,
          image: fileName,
          gender: data?.gender,
          contactNo: data?.contactNo,
          expertise: data?.expertise,
          languages: data?.languages,
          price: data?.price,
          experience: data?.experience,
          aboutAstrologer: data?.aboutAstrologer,
          status: data?.status,
          visibility: data?.visibility,
        },
        { new: true }
      );

      if (!updatedAstrologer) {
        return res.status(404).json({ message: "Astrologer not found" });
      }

      res.status(200).json({
        message: "Astrologer details updated successfully",
        data: updatedAstrologer,
      });
    } catch (err) {
      console.error("Error updating Astrologer details:", err);
      return res
        .status(500)
        .json({ message: "Internal server error", error: err });
    }
  });
};

export const deleteAstrologer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const deleteAstrologer = await Astro.findByIdAndDelete(id);
    if (!deleteAstrologer) {
      return res.status(404).json({ message: "Astrologer not found" });
    }
    res.status(200).json({
      message: "Astrologer deleted successfully",
      data: deleteAstrologer,
    });
  } catch (err) {
    console.error("Error deleting Astrologer:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
};

export const visibility = async (req, res) => {
  try {
    // const { astrologerId, visibility } = req.body;
    const { astrologerId } = req.body;
    let { visibility } = req.body;

    if (visibility === undefined) {
      visibility = false;
    }
    if (!astrologerId) {
      return res.status(400).json({ message: "astrologerId is required" });
    }

    const updatedAstrologer = await Astro.findByIdAndUpdate(
      astrologerId,
      { visibility },
      { new: true }
    );

    if (!updatedAstrologer) {
      return res.status(404).json({ message: "Astrologer not found" });
    }

    res.status(200).json({
      message: "Visibility status updated successfully",
      data: updatedAstrologer,
    });
  } catch (error) {
    console.error("Error updating visibility status:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

export const visibilityStatus = async (req, res) => {
  try {
    const { astrologerId } = req.params;

    if (!astrologerId) {
      return res.status(400).json({ message: "Astrologer ID is required" });
    }

    const astrologer = await Astro.findById(astrologerId);

    if (!astrologer) {
      return res.status(404).json({ message: "Astrologer not found" });
    }

    res.status(200).json({
      message: "Visibility status retrieved successfully",
      data: { isVisible: astrologer.visibility },
    });
  } catch (error) {
    console.error("Error retrieving visibility status:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

export const activity = async (req, res) => {
  try {
    const astrologerId = req.user?.user;
    // const { astrologerId } = req.body;
    let { status } = req.body;
    // const { astrologerId, status } = req.body;
    console.log("ddddddddddddddddddddddddd", astrologerId);
    console.log("ddddddddddddddddddddddddd", status);
    if (status === undefined) {
      status = false;
    }

    if (!astrologerId) {
      return res.status(400).json({ message: "astrologerId is required" });
    }
    console.log("dddddddddddddddddddddddddgo", status);
    const updatedStatus = await Astro.findByIdAndUpdate(
      astrologerId,
      { status },
      { new: true }
    );

    if (!updatedStatus) {
      return res.status(404).json({ message: "Astrologer not found" });
    }
    // res.status(200).json({
    //   message: "Active status updated successfully",
    //   data: updatedStatus,
    // });
    console.log("updatedStatus.modifiedCount", updatedStatus);
    if (updatedStatus) {
      res.status(200).json({
        message: "Active status updated successfully",
        data: updatedStatus,
      });
    } else {
      res.status(400).json({ message: "update failed please try again later" });
    }
  } catch (error) {
    console.error("Error updating active status:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

export const getStatus = async (req, res) => {
  try {
    const { astrologerId } = req.params;

    if (!astrologerId) {
      return res.status(400).json({ message: "astrologerId is required" });
    }

    const astrologer = await Astro.findOne({ _id: astrologerId });

    if (!astrologer) {
      return res.status(404).json({ message: "Astrologer not found" });
    }

    res.status(200).json({
      message: "Status retrieved successfully",
      data: { status: astrologer.status },
    });
  } catch (error) {
    console.error("Error retrieving status:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

export const getAstrologerById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const astrologer = await Astro.findById(id);

    if (!astrologer) {
      return res.status(404).json({ message: "Astrologer not found" });
    }

    res.status(200).json({ message: "Astrologer found", data: astrologer });
  } catch (error) {
    console.error("Error fetching astrologer:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
