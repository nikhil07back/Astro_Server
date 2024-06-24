import mongoose from "mongoose";

const chatMessages = new mongoose.Schema(
  {
    room: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    messageFromUser: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    messageToUser: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    userID: {
      type: String,
      required: false,
    },
    userType: {
      type: String,
      required: false,
    },
    deductedAmount: {
      type: Number,
      required: false,
    },
    msgType: {
      type: String,
      require: false,
    },
    chatId: {
      type: String,
      require: false,
    },
    reply: {
      type: String,
      require: false,
    },
  },
  { timestamps: true }
);

const chatMessage = mongoose.model("chatMessage", chatMessages);
export default chatMessage;
