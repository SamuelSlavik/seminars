const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Seminar = require("../models/seminarModel");
const User = require("../models/userModel");
//const auth = require("../middleware/auth");

router.post("/newSeminar", async (req, res) => {
    try {
        let { title, numberOfLessons, numberOfStudents, loggedStudents, suitableFor} = req.body;

        // validate

        //if (!title || !numberOfLessons || !numberOfStudents || !loggedStudents || !suitableFor)
            //return res.status(400).json({ msg: "Not all fields have been entered." });

        const newSeminar = new Seminar({
            title,
            numberOfLessons,
            numberOfStudents,
            loggedStudents,
            suitableFor,
        });
        const savedSeminar = await newSeminar.save();
        res.json(savedSeminar);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/joinSeminar", async (req, res, next) => {
    try {
        let { title, numberOfLessons, numberOfStudents, loggedStudents, suitableFor, joiningStudent} = req.body;

        // UPDATE SEMINAR DOCUMENT

        const oldSeminar = await Seminar.findOne({title: title});
        if (!oldSeminar)
            return res.status(400).json({msg: "No account with this name has been found"});

        //const filter = { title: title };

        const seminarOptions = { upsert: false };

        const updateSeminar = {
            $set: {
                title: oldSeminar.title,
                numberOfLessons: oldSeminar.numberOfLessons,
                //loggedStudents: Seminar.loggedStudents.push(str(joiningStudent))
            },
            $inc: {
                numberOfStudents: 1,
            },
            $push: {
                loggedStudents: joiningStudent,
            }
        };

        // UPDATE USER DOCUMENT

        const oldUser = await User.findOne({name: joiningStudent});
        if (!oldUser)
            return res.status(400).json({msg: "No account with this name has been found"});

        if (oldUser.lessons - oldSeminar.numberOfLessons < 0)
            return res.status(400).json({msg: "You dont have enough free lessons"});

        const userOptions = {upsert: false};

        const updateUser = {
            $set: {
                //name: oldUser.name,
                //grade: oldUser.grade,
                //password:
            },
            $inc: {
                lessons: - oldSeminar.numberOfLessons
            }
        };

        const updatedSeminar = await oldSeminar.updateOne( updateSeminar, seminarOptions);
        const updatedUser = await oldUser.updateOne (updateUser, userOptions);
        res.json(updatedSeminar);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/leaveSeminar", async (req, res, next) => {
    try {
        let { title, numberOfLessons, numberOfStudents, loggedStudents, suitableFor, joiningStudent} = req.body;

        // UPDATE SEMINAR DOCUMENT

        const oldSeminar = await Seminar.findOne({title: title});
        if (!oldSeminar)
            return res.status(400).json({msg: "No account with this name has been found"});

        //const filter = { title: title };

        const seminarOptions = { upsert: false };

        const updateSeminar = {
            $set: {
                title: oldSeminar.title,
                numberOfLessons: oldSeminar.numberOfLessons,
                //loggedStudents: Seminar.loggedStudents.push(str(joiningStudent))
            },
            $inc: {
                numberOfStudents: - 1,
            },
            $pull: {
                loggedStudents: joiningStudent,
            }
        };

        // UPDATE USER DOCUMENT

        const oldUser = await User.findOne({name: joiningStudent});
        if (!oldUser)
            return res.status(400).json({msg: "No account with this name has been found"});

        const userOptions = {upsert: false};

        const updateUser = {
            $set: {
                //name: oldUser.name,
                //grade: oldUser.grade,
                //password:
            },
            $inc: {
                lessons: + oldSeminar.numberOfLessons
            }
        };

        const updatedSeminar = await oldSeminar.updateOne( updateSeminar, seminarOptions);
        const updatedUser = await oldUser.updateOne (updateUser, userOptions);
        res.json(updatedSeminar);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get("/", async (req, res) => {
    const seminar = await Seminar.find({}, req.seminar);
    res.json({seminar})
});

module.exports = router;