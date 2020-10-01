const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    numberOfLessons: {
        type: Number,
        required: true,
    },
    numberOfStudents: {
        type: Number,
    },
    loggedStudents: [{
        type: String
    }],
    suitableFor: {
        type: String,
        required: true,
    }
});

module.exports = Seminar = mongoose.model("seminar", userSchema);