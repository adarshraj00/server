const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors')

mongoose.connect("mongodb+srv://adarsh-admin:AoUJo2luTwjrCDHv@cluster0.jjs5s.mongodb.net/lol", {useNewUrlParser: true, useUnifiedTopology: true,returnOriginal: false,useFindAndModify: false});
// mongoose.connect('mongodb://localhost:27017/lol', {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connection.on('connected',()=>{
//     console.log("connected to mongo");
// })
// mongoose.connection.on('error',(err)=>{
//     if(err){
//         console.log("error on connecting to db");
//     }
// })present

const PORT=process.env.PORT || 3000;
const app=express();
const api=require('./routes/api');
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('ngApp'));
app.use('/api',api);


app.get('/',(req,res)=>{ 
    res.send('Hello World!');
})
app.get('*',(req,res)=>{
    res.sendFile(__dirname+'/ngApp/index.html');
})
app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
})

