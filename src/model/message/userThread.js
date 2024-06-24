import mongoose from "mongoose";

const userThreadd = new mongoose.Schema({
    fromUser: {
        type: mongoose.Schema.ObjectId,
        required: true
      },
      toUser: {
        type: mongoose.Schema.ObjectId,
        required: true
      },
      roomId: {
        type: String,
        required: true
      },
},{timestamps:true});

const userThread  = mongoose.model('userThread', userThreadd);
export default userThread;
