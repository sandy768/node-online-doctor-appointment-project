const patientModel=require('../Model/patientModel');
const doctorModel=require('../Model/doctorModel');
const appointmentModel=require('../Model/appointment');
const jwt=require('jsonwebtoken');

const userHome=async(req,res)=>{
    try{
        let doc_details=await doctorModel.find();
            res.render('user/home',{
                title:"Swasth Rakshak",
                path:'/user/home',
                data:doc_details
            })
    }
    catch(err){
        console.log("Error to fetch doctor data",err);
        
    }
}

const aboutus=(req,res)=>{
    res.render('user/about_us',{
        title:"About Us",
        path:'/user/aboutus'
    })
}

const contact=(req,res)=>{
    res.render('user/contact',{
        title:"Contact Us",
        path:'/user/contact'
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
        let appointment_details=await appointmentModel.find();
        // console.log("Patient Profile:",req.user);
        res.render('user/profile',{
            title:"About Patient",
            path:'/user/viewProfile',
            data:patient_data,
            appointment:appointment_details
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

const getDoctorList=async(req,res)=>{
    try{
        let errDoc=req.flash('err-doc');
        let docErr=errDoc.length>0?errDoc[0]:null;

        let patient_data=req.user.patientData;
        let doctor_data=await doctorModel.find();
        // console.log("Doctor Data:",doctor_data);
        res.render('user/doctorList',{
            title:"Available Doctors",
            path:'/user/getdoctorlist',
            data1:patient_data,
            data2:doctor_data,
            error_doc:docErr
        })
    }
    catch(err){
        console.log("Error to show available doctor page",err);
    }
}

const getDocAppointment=async(req,res)=>{
    try{
        let doctor_details=await doctorModel.findOne({_id:req.body.doc_id});
        let patient_details=await patientModel.findOne({_id:req.body.pid});
        let appointment_details=await appointmentModel.findOne({doc_id:req.body.doc_id});
        if(!appointment_details){
            res.render('user/docAppointment',{
                title:"Get Your Appointment",
                data1:doctor_details,
                data2:patient_details
            })
        }
        else{
            req.flash('err-doc','You have already booked appointment for this doctor, please select another doctor for appointment');
            res.redirect('/user/getdoctorlist');
        }
    }
    catch(err){
        console.log("Error to show appointment page",err);
    }
}

const postDocAppointment=async(req,res)=>{
    try{
            let new_appointment=new appointmentModel({
                patient_id:req.body.pid,
                patient_name:req.body.patient_name,
                doc_id:req.body.doc_id,
                doc_name:req.body.doc_name,
                doc_specialization:req.body.doc_specialization,
                doc_fees:req.body.doc_fees,
                appointment_day:req.body.appointment_day,
                appointment_time:req.body.appointment_time,
            });
            let appointment_data=await new_appointment.save();
            // console.log("Appointment data:",appointment_data);
            res.redirect('/user/viewProfile');
    }
    catch(err){
        console.log("Error to post appointment data",err);
    }
}

module.exports={
    userHome,
    aboutus,
    contact,
    userAuth,
    patientProfile,
    logOut,
    getDoctorList,
    getDocAppointment,
    postDocAppointment
}