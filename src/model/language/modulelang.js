import mongoose from "mongoose";

const langSchema = new mongoose.Schema({
    lang: {
        type: String,
        required: true
    }
});

const Lang = mongoose.model('Language', langSchema);
export default Lang;
