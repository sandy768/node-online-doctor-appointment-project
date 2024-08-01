const patientModel=require('../Model/patientModel');
const doctorModel=require('../Model/doctorModel');
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
const postUserData=async(req,res)=>{
    try{
        let patient_info=await patientModel.findOne({_id:req.body.pid});
        if(patient_info){
            let token_payload={patientData:patient_info};
                let token_jwt=jwt.sign(token_payload,process.env.SECRET_KEY,{
                    expiresIn:"1h",
                });
                res.cookie("token_data",token_jwt,{
                    expires:new Date(Date.now()+3600000),
                    httpOnly:true,
                });
                res.redirect('/user/getdoctorlist');
        }
        else{
            console.log("Error to find user data");
        }
    }
    catch(err){
        console.log("Error to send user data",err);
    }
}
const getDoctorList=async(req,res)=>{
    try{
        let patient_data=req.user.patientData;
        let doctor_data=await doctorModel.find();
        // console.log("Doctor Data:",doctor_data);
        res.render('user/doctorList',{
            title:"Available Doctors",
            path:'/user/getdoctorlist',
            data1:patient_data,
            data2:doctor_data
        })
    }
    catch(err){
        console.log("Error to show available doctor page",err);
    }
}
const postSingleDoctor=async(req,res)=>{
    try{
        let patient_details=await patientModel.findOne({_id:req.body.pid});
        if(patient_details){
            let token_payload={patientData:patient_details};
                let token_jwt=jwt.sign(token_payload,process.env.SECRET_KEY,{
                    expiresIn:"1h",
                });
                res.cookie("token_data",token_jwt,{
                    expires:new Date(Date.now()+3600000),
                    httpOnly:true,
                });
                res.redirect('/user/getappointment');
        }
    }
    catch(err){
        console.log("Error to collect single doctor details",err);
    }
}
const getDocAppointment=async(req,res)=>{
    try{
        let patient_details=req.user.patientData;
        // console.log("Patient data:",patient_details);
        res.render('user/docAppointment',{
            title:"Get Your Appointment",
            path:'/user/getappointment',
            data:patient_details
        })
    }
    catch(err){
        console.log("Error to show appointment page",err);
    }
}
module.exports={
    userHome,
    userAuth,
    patientProfile,
    logOut,
    postUserData,
    getDoctorList,
    postSingleDoctor,
    getDocAppointment
}