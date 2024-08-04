const express=require('express');
const router=express.Router();
const multer=require('multer');
const path=require('path');
const AuthJwt=require('../Middle-ware/isAuth');

const {
getRegistration,
postRegistration,
mailConfirmation,
getLogin,
postLogin,
getEmail,
postEmail,
getRecoverPass,
postRecoverPass
} = require('../Controller/userController');

const {
userAuth,
patientProfile,
logOut,
userHome,
getDoctorList,
getDocAppointment,
postDocAppointment,
aboutus,
contact
} = require('../Controller/userDashboard');

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

// home page
router.get('/user/home',userHome);

//about us page
router.get('/user/aboutus',aboutus);

// contact us page
router.get('/user/contact',contact);

// user registration
router.get('/user/registration',getRegistration);
router.post('/user/postreg',upload_type,postRegistration);

// email verification
router.get('/patient_mail_confirmation/:email/:token',mailConfirmation);

// user login
router.get('/user/viewlogin',getLogin);
router.post('/user/postlogin',postLogin);

// password recovery
router.get('/recovery/email',getEmail);
router.post('/recovery/emailpostdata',postEmail);
router.get('/patient/getpasswordrecovery/:email',getRecoverPass);
router.post('/patient/postpasswordrecovery',postRecoverPass);

// user profile
router.get('/user/viewProfile',AuthJwt.authJwt,userAuth,patientProfile);

// profile logout
router.get('/user/logout',logOut);

// post user data to doctor list page
// router.post('/user/postuserdata',postUserData);

// get doctors list
router.get('/user/getdoctorlist',AuthJwt.authJwt,userAuth,getDoctorList);


// get appointment page
router.post('/user/getappointment',getDocAppointment);

// post appointment details
router.post('/user/postappointment',postDocAppointment);

module.exports=router;