require('dotenv').config();
const express=require('express');
const appServer=express();
const PORT=process.env.PORT||5700;
const mongoose=require('mongoose');
const path=require('path');

const switchRouter=require('./Router/switchRouter');
const adminRouter=require('./Router/adminRouter');
const userRouter=require('./Router/userRouter');

appServer.set('view engine','ejs');
appServer.set('views','View');

appServer.use(express.urlencoded({extended:true}));
appServer.use(express.static(path.join(__dirname,'Public')));
appServer.use(express.static(path.join(__dirname,'uploads')));

appServer.use(switchRouter);
appServer.use(adminRouter);
appServer.use(userRouter);
mongoose.connect(process.env.DB_URL)
.then(res=>{
    appServer.listen(PORT,()=>{
        console.log(`Server is running at http://localhost:${PORT}`);
    })
})
.catch(err=>{
    console.log("Database not connected yet",err);
})