const User = require("../models/User");
const express = require("express");
const router = express.Router();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const JWT_SECRET='Divyanshu';
var fetchuser=require('../middleware/fetchuser');
const { body, validationResult } = require("express-validator");
//create a user
router.post(
  "/createUser",
  [
    body("name", "Enter a valid name").isLength({ min: 5 }),
    body("email", "Enter a valid email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success=false;
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        success=false;
        return res.status(400).json({ success,error: "email exist" });
      }
      const salt=await bcrypt.genSalt(10);//return promise
      const secPass=await bcrypt.hash(req.body.password,salt);
      //create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data={
        user:{
          id:user.id
        }
      }
      let authToken=jwt.sign(data,JWT_SECRET);
      // res.json(user);
      success=true;
      res.json({success,authToken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("error occured");
    }
  }
);
//authenticate a user using Post"/api/auth/login"
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password can't be blank").exists(),
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {email,password}=req.body;
    try {
      let user=await User.findOne({email});
      if(!user){
        success=false;
        return res.status(400).json({error:"please use correct"})
      }
      const passCompare=await bcrypt.compare(password,user.password);
      if(!passCompare){
        success=false;
        return res.status(400).json({success,error:"please use correct"})
      }
      const data={
        user:{
          id:user.id
        }
      }
      let authToken=jwt.sign(data,JWT_SECRET);
      success=true;
      res.json({success,authToken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error");
    }
  });
  //get loggedin details
  router.post('/getuser',fetchuser,async (req,res)=>{
    try {
      userId=req.user.id;
      const user=await User.findById(userId).select("-password");
      res.send(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error");
    }
  })
module.exports = router;
