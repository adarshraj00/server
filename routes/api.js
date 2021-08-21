const express = require("express");
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Resume=require("../models/resume");

const verify = (req, res, next) => {
  console.log(req.headers.authorization);
  if (!req.headers.authorization) {
    return res.status(401).send("unauthorized request");
  }
  let token = req.headers.authorization;
  if (token === null) {
    return res.status(401).send("unauthorized request");
  }
  let payload = jwt.verify(token, "secretKey");
  if (!payload) {
    res.status(401).send("unauthorized request");
  }
  console.log("inside middleware");
  console.log(payload);
  req.userId = payload.subject;
  console.log(req.userId);
  next();
};

router.get("/", function (req, res) {
  res.send("Hello World! from api route");
});

router.post("/register", (req, res) => {
  let userData = req.body;

  console.log(userData);
  let user = new User(userData);
  console.log(user);
  User.countDocuments({ userName: userData.userName }, function (err, count) {
    if (count >= 1) {
      res.status(401).send("user already exists");
      return;
    } else {
      user.save((err, user) => {
        if (err) {
          res.send(err);
        }
        console.log(user);
        let payload = { subject: user._id };
        let token = jwt.sign(payload, "secretKey");
        console.log(token);
        res.status(200).send({ token });
      });
    }
  });
});

router.post("/login", (req, res) => {
  let userData = req.body;
  console.log(userData);
  User.findOne({ userName: userData.userName }, (err, user) => {
    // callback function that either gives a error or matched user
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      if (!user) {
        res.status(401).send("User not found");
        console.log("user not found");
      } else {
        if (user.password !== userData.password) {
          res.status(402).send("Invalid password");
        } else {
          let payLoad = { subject: user._id };
          let token = jwt.sign(payLoad, "secretKey");
          res.send({ token });
        }
      }
    }
  });
});
router.get("/special", (req, verify, res) => {
  res.status(200).send("special route");
});
router.get("/userData", verify, (req, res) => {
  // console.log("test")
  User.findOne({ _id: req.userId }, (err, user) => {
    if (err) {
      console.log(err);
      // console.log("r")
      res.status(401).send("error");
    } else {
      // console.log("est")
      res.json(user);
    }
  });
});

router.post("/update", verify, async (req, res) => {
  console.log(req.userId, req.body);
  let found = await User.findOne({ _id: req.userId }).exec();
  if (found === null) {
    res.status(401).send("error");
  } else if (
    req.body.userName !== undefined &&
    req.body.userName !== found.userName // IF USER NAME IS TO BE EDITED AND USERNAME IS NOT THE SAME AS PREVIOUS ONE
  ) {
    console.log("inside if");
    console.log("username");
    let count=await User.countDocuments({ userName: req.body.userName })
    console.log(count);
    if(count===1){
        return res.status(401).send("username already exists");
     }
  }
  let doc = await User.findOneAndUpdate({ _id: req.userId }, req.body, {
    new: true,
  });
  console.log(doc);
  res.status(200).json(doc);

});

router.post('/registerdata',verify,(req,res)=>{
  //  console.log(req.body);
   const resume=new Resume({userid:req.userId,resume:req.body});
   resume.save((err,resume)=>{
       if(err){
           console.log(err);
       }
       else{
           console.log(resume);
       }
   })
  //  console.log(resume);
   res.status(200).send("data saved");
})
router.get('/getdata',verify,(req,res)=>{
    Resume.find({userid:req.userId},(err,resume)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log(resume);
            const RESUME=resume[0].get('resume');
            console.log(RESUME);
            res.status(200).send(RESUME);
        }
    })
})
module.exports = router;
