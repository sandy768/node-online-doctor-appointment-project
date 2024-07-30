require('dotenv').config();
const express=require('express');
const appServer=express();
const PORT=process.env.PORT||5700;
const mongoose=require('mongoose');
const path=require('path');
const session=require('express-session');
const flash=require('connect-flash');
const cookieParser=require('cookie-parser');

const switchRouter=require('./Router/switchRouter');
const adminRouter=require('./Router/adminRouter');
const userRouter=require('./Router/userRouter');

appServer.set('view engine','ejs');
appServer.set('views','View');

appServer.use(express.urlencoded({extended:true}));
appServer.use(express.static(path.join(__dirname,'Public')));
appServer.use(express.static(path.join(__dirname,'uploads')));

appServer.use(session({
    secret:'secret9h6f738hs829ty237ht7hsuj',
    resave:false,
    saveUninitialized:false
}))

appServer.use(flash());
appServer.use(cookieParser());
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