const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const auth = require("../middleware/auth");

router.post("/register", async (req, res) => {
   try {
      let { name, password, grade, lessons} = req.body;

      // validate

      if (!name || !password || !grade)
         return res.status(400).json({ msg: "Not all fields have been entered." });
      if (password.length < 5)
         return res
             .status(400)
             .json({ msg: "The password needs to be at least 5 characters long." });

      const existingUser = await User.findOne({ name: name });
      if (existingUser)
         return res
             .status(400)
             .json({ msg: "An account with this name already exists." });

      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = new User({
         name,
         password: passwordHash,
         grade,
         lessons,
      });
      const savedUser = await newUser.save();
      res.json(savedUser);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

router.post("/login", async (req, res) => {
   try {
      const {name, password, grade, lessons} = req.body;

      // Validation
      if (!name || !password)
         return res.status(400).json({msg: "Please enter your name and password"});

      const user = await User.findOne({name: name})
      if (!user)
         return res.status(400).json({msg: "No account with this name has been found"});

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
         return res.status(400).json({msg: "Invalid credentials"});

      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
      res.json({
         token,
         user: {
            id: user._id,
            name: user.name,
            grade: user.grade,
            lessons: user.lessons
         },
      });
   } catch (err) {
      res.status(500).json({error: err.message})
   }
});

router.post("/tokenIsValid", async (req, res) => {
   try {
      const token = req.header("x-auth-token");
      if (!token) return res.json(false);

      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified) return res.json(false);

      const user = await User.findById(verified.id);
      if (!user) return res.json(false);

      return res.json(true);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

router.get("/", auth, async (req, res) => {
   const user = await User.findById(req.user);
   res.json({
      name: user.name,
      id: user._id,
      grade: user.grade,
      lessons: user.lessons
   });
});

module.exports = router;