const express=require('express');
const router=express.Router();
const {addDoctors,postDocForm,viewDoctors,updateDoctors,postUpdateDetails,postDeleteDetails} = require('../Controller/adminController');
const multer=require('multer');
const path=require('path');

const fileStorage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,path.join(__dirname,"..","uploads","doctors"),(err,data)=>{
            if(err) throw err;
        })
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname,(err,data)=>{
            if(err) throw err;
        })
    }
})
const fileFilter=(req,file,callback)=>{
    if(
        file.mimetype.includes("png")||
        file.mimetype.includes("jpg")||
        file.mimetype.includes("jpeg")||
        file.mimetype.includes("webp")
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

const upload_type=upload.single("doc_photo");

router.get('/admin/adddoctor',addDoctors);
router.post('/admin/docpostdata',upload_type,postDocForm);
router.get('/admin/viewdoctors',viewDoctors);
router.post('/admin/update',updateDoctors);
router.post('/admin/updateddetails',upload_type,postUpdateDetails);
router.post('/admin/deletedata',postDeleteDetails);

module.exports=router;