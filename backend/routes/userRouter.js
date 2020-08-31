const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

router.post("/login", async (req, res) => {
   try {
      const {email, password} = req.body;

      // Validation
      if (!email || !password)
         return res.status(400).json({msg: "Please enter your email and password"});

      const user = await User.findOne({email: email})
      if (!user)
         return res.status(400).json({msg: "No account with this email has been found"});

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
         return res.status(400).json({msg: "Invalid credentials"});

      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
      res.json({
         token,
         user: {
            id: user._id,
            email: user.email,
            name: user.name,
            grade: user.grade
         },
      });
   } catch (err) {
      res.status(500).json({error: err.message})
   }
});

module.exports = router;