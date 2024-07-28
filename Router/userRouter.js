const express=require('express');
const router=express.Router();
const multer=require('multer');
const path=require('path');
const {getRegistration,postRegistration} = require('../Controller/userController');

const fileStorage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,path.join(__dirname,"..","uploads","patients"),(err,data)=>{
            if(err) throw err;
        })
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname,(err,data)=>{
            if(err) throw err;
        })
    },
});
const fileFilter=(req,file,callback)=>{
    if(
        file.mimetype.includes("png")||
        file.mimetype.includes("jpg")||
        file.mimetype.includes("jpeg")||
        file.mimetype.includes("webp")||
        file.mimetype.includes("jfif")
    ){
        callback(null,true);
    }else{
        callback(null,false);
    }
}
const upload=multer({
    storage:fileStorage,
    fileFilter:fileFilter,
    limits:{fieldSize:1024*1024*5},
});
const upload_type=upload.fields([
    {name:"patient_photo",maxCount:1},
    {name:"patient_docs",maxCount:2},
]);

router.get('/user/registration',getRegistration);
router.post('/user/postreg',upload_type,postRegistration);
module.exports=router;