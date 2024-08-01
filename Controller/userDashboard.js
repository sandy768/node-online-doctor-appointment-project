const patientModel=require('../Model/patientModel');
const jwt=require('jsonwebtoken');

const userHome=(req,res)=>{
    res.render('user/home',{
        title:"Swasth Rakshak",
        path:'/user/home'
    })
}

const userAuth=async(req,res,next)=>{
    try{
        if(req.user){
            next();
        }
        else{
            req.flash('err-log','You need to login first');
            res.redirect('/user/viewlogin');
        }
    }
    catch(err){
        console.log("Error while authorization",err);
    }
}
const patientProfile=async(req,res)=>{
    try{
        let patient_data=req.user.patientData;
        // console.log("Patient Profile:",req.user);
        res.render('user/profile',{
            title:"About Patient",
            path:'/user/viewProfile',
            data:patient_data
        })
    }
    catch(err){
        console.log("Error to find patient details",err);
    }
}
const logOut=async(req,res)=>{
    let destroyed=await res.clearCookie('token_data');
    // console.log("Destroyed:",destroyed);
    res.redirect('/user/viewlogin');
}
module.exports={
    userHome,
    userAuth,
    patientProfile,
    logOut
}