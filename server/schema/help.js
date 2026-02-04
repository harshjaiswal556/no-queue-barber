const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;