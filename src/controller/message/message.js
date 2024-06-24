import { Server } from "socket.io";
import UserAstroMapping from "../../model/message/userThread.js";
import chatMessages from "../../model/message/chatMessage.js";
import Reg from "../../model/registration/modulereg.js";
import Price from "../../model/price/pricesetting.js";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
export default function initializeSocket(server) {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
      console.log(`Sending message to room: ${data.room}`);
      socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });

    socket.on("seen", (data) => {
      // Broadcast 'seen' event to other clients
      socket.broadcast.emit("messageSeen", data);
      //socket.to(data.room).emit('messageSeen', data);
      //io.to(data.room).emit('messageSeen', data);
    });
  });
}

export const postDetail = async (req, res) => {
  try {
    const { astroId, userType } = req.body;
    const userID = req?.user?.user;

    if (!astroId) {
      return res.status(400).json({ message: "astroId are required fields" });
    }
    let formUser1;
    if (userType === "user") {
      formUser1 = await UserAstroMapping.findOne({
        fromUser: userID,
        toUser: astroId,
      });
    } else {
      formUser1 = await UserAstroMapping.findOne({
        // fromUser: userID,
        fromUser: astroId,
        toUser: userID,
      });
    }

    if (formUser1 === null || formUser1 === "null") {
      // if (!formUser1) {
      const roomID = astroId + userID;

      const userAstroMapping = new UserAstroMapping({
        fromUser: userID,
        toUser: astroId,
        roomId: roomID,
      });

      const response = await userAstroMapping.save();

      return res.status(200).json({ message: "Success", data: response });
    } else {
      return res.status(200).json({ message: "Success", data: formUser1 });
    }
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

export const chatDetails = async (req, res) => {
  try {
    const {
      room,
      author,
      message,
      time,
      messageFromUser,
      messageToUser,
      userID,
      userType,
      msgType,
      chatId,
      reply,
    } = req.body;

    const priceData = await Price.findOne();
    if (!priceData) {
      return res.status(500).json({ error: "Price data not found" });
    }
    const chatPrice = priceData.chatPrice;

    const userId = userID; //newChatMessage.userID;
    const user = await Reg.findById(userId);
    if (userType === "user") {
      if (user) {
        if (user.wailet >= chatPrice || reply != "") {
          const newChatMessage = new chatMessages({
            room,
            author,
            message,
            time,
            messageFromUser,
            messageToUser,
            userID,
            userType,
            msgType,
            chatId,
            reply,
          });
          console.log("newChatMessageeeeeee", newChatMessage);
          const savedMessage = await newChatMessage.save();
          if (savedMessage) {
            console.log("reply ========", reply);
            if (msgType !== "auto" && reply === "") {
              user.wailet -= chatPrice;
              newChatMessage.deductedAmount = chatPrice;
              await user.save();
            }
            // console.log();
            //const alb = user.wailet - chatPrice;
            return res.status(200).json({
              message: "Success",
              data: savedMessage,
              availableBalnce: user.wailet,
              status: 1,
            });
          } else {
            return res.status(400).json({ error: "Something went wrong!" });
          }
        } else {
          return res.status(200).json({
            error: "Insufficient balance in the wallet",
            availableBalnce: user.wailet,
            status: 0,
          });
        }
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    } else if (userType === "astrologer") {
      //return res.status(200).json({ message: "You are an astrologer" });
      const newChatMessage = new chatMessages({
        room,
        author,
        message,
        time,
        messageFromUser,
        messageToUser,
        userID,
        userType,
        msgType,
        chatId,
        reply,
      });
      console.log("newChatMessageeeeeee", newChatMessage);
      const savedMessage = await newChatMessage.save();
      if (savedMessage) {
        return res.status(200).json({
          message: "Success",
          data: savedMessage,
          availableBalnce: 0,
          status: 1,
        });
      } else {
        return res.status(400).json({ error: "Something went wrong!" });
      }
    }
  } catch (error) {
    console.error("Error creating chat message:", error);
    return res.status(500).json({ error: "Could not create chat message" });
  }
};
export const getUserForAstrologer = async (req, res) => {
  try {
    const astroId = req?.user?.user;

    // Fetch price data
    const priceData = await Price.findOne();
    if (!priceData) {
      return res.status(404).json({ message: "Price not found" });
    }
    const chatPrice = priceData.chatPrice;

    // Aggregate user and chat details
    const thread = await UserAstroMapping.aggregate([
      {
        $match: { toUser: new mongoose.Types.ObjectId(astroId) },
      },
      {
        $lookup: {
          from: "registrations",
          localField: "fromUser",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "registrations",
          localField: "toUser",
          foreignField: "_id",
          as: "astro",
        },
      },
      {
        $lookup: {
          from: "chatmessages",
          localField: "roomId",
          foreignField: "room",
          as: "messages",
        },
      },
      {
        $lookup: {
          from: "astrologers",
          localField: "toUser",
          foreignField: "_id",
          as: "astrologerDetails",
        },
      },
      {
        $addFields: {
          latestMessage: { $arrayElemAt: [{ $slice: ["$messages", -1] }, 0] },
          totalChatPrice: { $sum: "$messages.price" },
        },
      },
      {
        $project: {
          toUser: 1,
          fromUser: 1,
          roomId: 1,
          createdAt: 1,
          updatedAt: 1,
          Username: { $arrayElemAt: ["$user.name", 0] },
          messageCount: { $size: "$messages" },
          fromEmail: { $arrayElemAt: ["$user.email", 0] },
          toEmail: { $arrayElemAt: ["$astro.email", 0] },
          chatDate: "$latestMessage.createdAt",
          astrologerName: { $arrayElemAt: ["$astrologerDetails.name", 0] },
          astrologerEmail: { $arrayElemAt: ["$astrologerDetails.email", 0] },
        },
      },
    ]).exec();

    if (!thread || thread.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    // Count distinct users
    const userCount = await UserAstroMapping.distinct("fromUser", {
      toUser: new mongoose.Types.ObjectId(astroId),
    }).countDocuments();

    // Consolidate response data
    res.status(200).json({
      message: "Success",
      userDetails: thread,
      totalUserCount: userCount,
      chatPrice: chatPrice,
    });

    console.log("lllllllllll", thread);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    console.log("Govind-Room", roomId);
    const userAstroRoom = await chatMessages.find({ room: roomId });

    return res.status(200).json({ message: "success", data: userAstroRoom });
  } catch (error) {
    console.error("error finding userAstroRoom:", error);
    return res
      .status(500)
      .json({ message: "internal server error", error: error });
  }
};
////////////////////

export const deleteChatMessage = async (req, res) => {
  try {
    const { chatId } = req.params;

    const deletedMessage = await chatMessages.findOneAndDelete({ chatId });

    if (deletedMessage) {
      return res.status(200).json({
        message: "Chat message deleted successfully",
        // data: deletedMessage,
      });
    } else {
      return res.status(404).json({ error: "Chat message not found" });
    }
  } catch (error) {
    console.error("Error deleting chat message:", error);

    return res.status(500).json({ error: "Could not delete chat message" });
  }
};
