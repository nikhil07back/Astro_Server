import mongoose from "mongoose";
import bcrypt from "bcrypt";

const astrologerRegistrationSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim: true
    },
    gender:{
        type:String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    dateOfBirth:{
        type:Date,
        required: true
    },
    email:{
        type:String,
        required: true,
        trim: true
    },
    password:{
        type:String,       
        required:true
    },
    phoneNumber:{
        type:String,
        required: true,
    },
    userType: {
        type: String,
        required: true, 
      },
});
const Astrologer = mongoose.model('AstrologerRegistration', astrologerRegistrationSchema);
export default Astrologer;