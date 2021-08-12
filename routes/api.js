const express=require('express');
const User=require('../models/user');
const router=express.Router();
const jwt=require('jsonwebtoken');

const verify=(req,res,next)=>{
    console.log(req.headers.authorization);
    if(!req.headers.authorization){
        return res.status(401).send('unauthorized request');
    }
    let token=req.headers.authorization;
    if(token===null){
        return res.status(401).send('unauthorized request');
    }
    let payload=jwt.verify(token,'secretKey');
    if(!payload){
    res.status(401).send('unauthorized request');
    }
    console.log("inside middleware")
    console.log(payload);
    req.userId=payload.subject;
    console.log(req.userId);
    next();
}

router.get('/',function(req,res){
    res.send('Hello World! from api route');
});

router.post('/register',(req,res)=>{
    let userData=req.body;
    
    console.log(userData);
    let user=new User(userData);
    console.log(user);
    User.countDocuments({userName:userData.userName},function(err,count){
        if(count>=1){
            res.status(401).send('user already exists');
            return ;
        }
        else{
            user.save((err,user)=>{
                if(err){
                    res.send(err);
                }
                console.log(user);
                let payload={subject:user._id};
                let token=jwt.sign(payload,'secretKey')
                console.log(token);
                res.status(200).send({token});
            })
        }
    })
})

router.post('/login',(req,res)=>{
let userData=req.body;
console.log(userData);
    User.findOne({userName:userData.userName},(err,user)=>{// callback function that either gives a error or matched user
        if(err){
            console.log(err);
            res.send(err);
        }
        else{
            if(!user){
                res.status(401).send('User not found');
                console.log('user not found')
            }
            else{
                if(user.password!==userData.password){
                    res.status(402).send('Invalid password');
                }
                else{
                    let payLoad={subject:user._id};
                    let token=jwt.sign(payLoad,'secretKey');
                    res.send({token});
                }
            }
        }
    })
})
router.get('/special',(req,verify,res)=>{
    res.status(200).send('special route');
})
router.get('/userData',verify,(req,res)=>{
    // console.log("test")
    User.findOne({_id:req.userId},(err,user)=>{
        if(err){
            console.log(err);
            // console.log("r")
            res.status(401).send("error");
        }
        else{
            // console.log("est")
            res.json(user);
        }
    })
})

router.post('/update',verify,(req,res)=>{
    console.log(req.userId,req.body)
    User.findByIdAndUpdate(req.userId,req.body,(err,user)=>{
        if(err){
            res.status(401).send("error");
        }
        else{
            User.countDocuments({userName:user.userName},function(err,count){
                if(count>1){
                    res.status(401).send('user already exists');
                }
            })
            res.json(user);
        }
    })
})


module.exports=router;