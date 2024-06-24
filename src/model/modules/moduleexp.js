import mongoose from "mongoose";

const expertiseSchema = new mongoose.Schema({
    skills:{ 
        type: String, 
        required: true,
        trim: true
    },
    // active:{
    //     type:Boolean,
    //     required:false
    // }
});

const Exp= mongoose.model('Expertise', expertiseSchema);
export default Exp;
