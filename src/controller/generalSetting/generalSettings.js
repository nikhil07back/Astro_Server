import generalSetting from "../../model/generalSetting/generalSetting.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/settingImages");
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now() + file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

export const addSetting = async (req, res) => {
  try {
    upload.fields([
      { name: "logo", maxCount: 1 },
      { name: "smallLogo", maxCount: 1 },
    ])(req, res, async (err) => {
      if (err) {
        console.error("Error during file upload:", err);
        return res.status(500).json({
          message: "Error uploading files",
          error: err,
        });
      }

      const data = JSON.parse(req.body.data);
      console.log("Received data:", data);

      const newSetting = new generalSetting({
        siteName: data.siteName,
        address: data.address,
        phone: data.phone,
        currency: data.currency,
        siteCode: data.siteCode,
        email: data.email,
        currencySymbol: data.currencySymbol,
        logo: req.files["logo"] ? req.files["logo"][0].filename : null,
        smallLogo: req.files["smallLogo"]
          ? req.files["smallLogo"][0].filename
          : null,
      });

      await newSetting.save();

      console.log("Setting added successfully:", newSetting);
      return res
        .status(200)
        .json({ message: "Setting added successfully", data: newSetting });
    });
  } catch (err) {
    console.error("Error adding setting:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
};

export const getSettings = async (req, res) => {
  try {
    const settings = await generalSetting.find();
    return res.status(200).json({ message: "success", data: settings });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "internal server  error", error: err });
  }
};

export const updateSetting = async (req, res) => {
  try {
    upload.fields([
      { name: "logo", maxCount: 1 },
      { name: "smallLogo", maxCount: 1 },
    ])(req, res, async (err) => {
      if (err) {
        console.error("Error during file upload:", err);
        return res.status(500).json({
          message: "Error uploading files",
          error: err,
        });
      }

      const data = JSON.parse(req.body.data);
      console.log("Received data:", data);

      const settingId = req.params.id;
      const updatedSettingData = {
        siteName: data.siteName,
        address: data.address,
        phone: data.phone,
        currency: data.currency,
        siteCode: data.siteCode,
        email: data.email,
        currencySymbol: data.currencySymbol,
      };

      if (req.files["logo"]) {
        updatedSettingData.logo = req.files["logo"][0].filename;
      }

      if (req.files["smallLogo"]) {
        updatedSettingData.smallLogo = req.files["smallLogo"][0].filename;
      }

      const updatedSetting = await generalSetting.findByIdAndUpdate(
        settingId,
        updatedSettingData,
        { new: true }
      );

      console.log("Setting updated successfully:", updatedSetting);
      return res.status(200).json({
        message: "Setting updated successfully",
        data: updatedSetting,
      });
    });
  } catch (err) {
    console.error("Error updating setting:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
};
