import express from "express";
import {
  addExpertise,
  getAllExpertise,
  updateExpertise,
  deleteExpertise,
} from "../controller/expertise/expertises.js";
import {
  addRegistration,
  updateRegistration,
  // adminRegistration,
  // astrologerRegistration
  getAllUsers,
} from "../controller/registrationform/resgistrationform.js";
import {
  addAstrologer,
  getAllAstrologer,
  updateAstrologer,
  deleteAstrologer,
  visibility,
  visibilityStatus,
  activity,
  getAstrologerById,
  getStatus,
  // getPricesById,
  // postPrices,
} from "../controller/astrologerlist/astrologers.js";
import {
  addLanguage,
  getAllLanguage,
  updateLanguage,
  deleteLanguage,
} from "../controller/languages/languages.js";
import {
  addRating,
  getRating,
} from "../controller/astrologerlist/astrologers.js";
import { loginUser } from "../controller/login/login.js";
import { userLogout } from "../controller/logout/logout.js";
import verifyToken from "../controller/middleware/middleware.js";
import {
  addPrice,
  updatePrice,
  getPrices,
  callAstrologer,
  incomingCall,
} from "../controller/prices/prices.js";
import {
  rechargeWallet,
  verifyPayment,
} from "../controller/walletRecharge/walletRecharge.js";
import { getUserById, updateUser } from "../controller/user/userProfile.js";
import {
  postDetail,
  chatDetails,
  getUserForAstrologer,
  getAllMessages,
  deleteChatMessage,
} from "../controller/message/message.js";
import {
  addSetting,
  getSettings,
  updateSetting,
} from "../controller/generalSetting/generalSettings.js";

import {
  customFieldUser,
  // customFieldConsultants,
  getUserCustomField,
  // getConsultantCustomField,
  deleteCustomField,
} from "../controller/customField/customFields.js";
// import customField from "../model/customField/custommFIeld.js";

import { paymentReport } from "../controller/dynamicReports/paymentReport.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/addRegistration", addRegistration);
// router.post("/adminRegistration", adminRegistration);
// router.post("/astrologerRegistration", astrologerRegistration);

router.get("/allAstrologer", getAllAstrologer);
router.get("/astrologers/:id", getAstrologerById);
router.get("/getSettings", getSettings);

//customFields// admin pannel  : -

router.post("/customFieldUser", customFieldUser);
// router.post("/customFieldConsultants", customFieldConsultants);
router.get("/getUserCustomField", getUserCustomField);
router.delete("/deleteCustomField/:id", deleteCustomField);
// router.get("/getUserCustomFieldById/:id", getUserCustomFieldById);
// router.get("/getConsultantCustomField", getConsultantCustomField)
// router.get("/getConsultantCustomFieldById/:id", getConsultantCustomFieldById)

router.use(verifyToken); ///////////////////////////////////////////////////////////////

router.post("/userLogout", userLogout);

//expertise routes
router.post("/add", addExpertise);
router.get("/all", getAllExpertise);
router.put("/update/:id", updateExpertise);
router.delete("/delete/:id", deleteExpertise);

//registration routes

router.put("/updateRegistration", updateRegistration);
router.get("/getallusers", getAllUsers);

//astrologer routes
router.post("/addAstrologer", addAstrologer);
router.put("/updateAstrologer/:id", updateAstrologer);
router.delete("/deleteAstrologer/:id", deleteAstrologer); // use params for update,delete, fetching single object
router.put("/editVisibility", visibility);
router.get("/visibilityStatus/:astrologerId", visibilityStatus);

router.put("/editActivity", activity);
router.get("/getActivity/:astrologerId", getStatus);

// router.get("/getPricesById/:id", getPricesById);
// router.post("/postPrices/:id", postPrices);

//language routes
router.post("/addLanguage", addLanguage);
router.get("/allLanguage", getAllLanguage);
router.put("/updateLanguage/:id", updateLanguage);
router.delete("/deleteLanguage/:id", deleteLanguage);

//rating routes...
router.post("/addRating", addRating);
router.get("/getRating", getRating);

//price routes
router.post("/addPrice", addPrice);
router.put("/updatePrice", updatePrice);
router.get("/getPrices", getPrices);
router.post("/callAstrologer", callAstrologer);
router.post("/incomingCall", incomingCall);

//walletRecharge
router.post("/rechargeWallet", rechargeWallet);
router.post("/verifyPayment", verifyPayment);

//getuserprofile
router.get("/getUserById/:id", getUserById);
router.put("/updateUser/:id", updateUser);

router.post("/postDetail", postDetail);
router.post("/chatDetails", chatDetails);
router.get("/getUserForAstrologer", getUserForAstrologer);
router.get("/getAllMessages/:roomId", getAllMessages);
router.delete("/deleteChatMessage/:chatId", deleteChatMessage);

router.post("/addSetting", addSetting);

router.put("/updateSetting/:id", updateSetting);

router.get("/allPaymentReport", paymentReport)

router.get("/", (req, res) => {
  const customField = customField.findOne({ _id: "" });
});

// router.delete('/astro/delete/:id',deleteAstro)
// drs */
export default router;

// const formUser1 = await UserAstroMapping.findOne({
//   fromUser: userID,
//   toUser: astroId,
// });
