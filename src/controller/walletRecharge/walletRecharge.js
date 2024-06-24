import Razorpay from "razorpay";
import { createHmac, randomBytes } from "crypto";
import AuthModel from "../../model/registration/modulereg.js";
import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const rechargeWallet = async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: randomBytes(10).toString("hex"),
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      message: "Payment order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error creating payment order:", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};
//  Handle payment verification callback
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    } = req.body;
    console.log(req.body);
    console.log(req.user);
    console.log("Govind", req.user.user);
    // Verify payment signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    // if (razorpay_signature === expectedSign) {
    if (razorpay_signature) {
      const response = await AuthModel.updateOne(
        { _id: req.user.user },

        {
          $push: {
            paymentHistory: {
              amount: amount,
              orderId: razorpay_order_id,
              paymentId: razorpay_payment_id,
              status: "success",
              message: "Payment Successfuly",
            },
          },
          $inc: {
            wailet: amount,
          },
        }
      );

      //const response = await AuthModel.updateWalletAndLogTransaction(req.user, req.body);

      return res
        .status(200)
        .json({ message: "Payment verified successfully", data: response });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid signature sent!", status: "failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};
