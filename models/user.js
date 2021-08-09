const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new mongoose.Schema({
    name:String,
    userName:String,
    password:String,
    email:String,
    contact:String,
})
const User=mongoose.model('user',userSchema,'users');
module.exports=User;

// first arg to name the model second is schema name, third is the
// collection name