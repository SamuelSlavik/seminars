const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
    },
    grade: {
        // 2, 3, 3B, 4B
        type: String,
        required: true,
    },
    lessons: {
        type: Number,
        required: true,
    }
});

module.exports = User = mongoose.model("user", userSchema);