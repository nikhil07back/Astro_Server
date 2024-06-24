import mongoose from "mongoose";
import Reg from "../../model/registration/modulereg.js";


export const paymentReport = async (req, res) => {
    try {
      const thread = await Reg.aggregate([
        {
          $unwind: "$paymentHistory",
        },
        {
          $sort: {
            "paymentHistory.updatedAt": -1, // Sort paymentHistory by updatedAt in descending order
          },
        },
        {
          $group: {
            _id: "$_id",
            userName: { $first: "$name" },
            userEmail: { $first: "$email" },
            amount: { $first: "$paymentHistory.amount" },
            orderId: { $first: "$paymentHistory.orderId" },
            paymentId: { $first: "$paymentHistory.paymentId" },
            status: { $first: "$paymentHistory.status" },
            paymentCreatedAt: { $first: "$paymentHistory.createdAt" },
            paymentUpdatedAt: { $first: "$paymentHistory.updatedAt" },
            userCreatedAt: { $first: "$createdAt" },
            userUpdatedAt: { $first: "$updatedAt" },
          },
        },
        {
          $project: {
            userId: "$_id",
            userName: 1,
            userEmail: 1,
            amount: 1,
            orderId: 1,
            paymentId: 1,
            status: 1,
            paymentCreatedAt: 1,
            paymentUpdatedAt: 1,
            userCreatedAt: 1,
            userUpdatedAt: 1,
          },
        },
      ]).exec();
  
      if (!thread || thread.length === 0) {
        return res.status(404).json({ message: "No payment records found" });
      }
  
      res.status(200).json({
        message: "Success",
        paymentDetails: thread,
      });
    } catch (error) {
      console.error("Error in paymentReport:", error);
      res.status(500).json({ message: "Server Error" });
    }
  };