const mongoose=require('mongoose');
const Schema=mongoose.Schema;

var resumeSchema=new Schema({},{strict:false});
var Resume=mongoose.model('resume',resumeSchema,'resumes');

module.exports=Resume;