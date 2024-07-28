const patientModel=require('../Model/patientModel');
const bcrypt=require('bcryptjs');

const getRegistration=(req,res)=>{
    res.render('user/registration',{
        title:"Patient Registration"
    })
}
const postRegistration=async(req,res)=>{
    try{
        // console.log("Collected data",req.body,req.files);
        let mail_exist= await patientModel.findOne({patient_email:req.body.patient_email});
        if(!mail_exist){
            let hashPassword=await bcrypt.hash(req.body.patient_password,12);
            let user_docs=req.files.patient_docs.map(img=>img.filename)
            let patientDetails=new patientModel({
                patient_name:req.body.patient_name.toLowerCase(),
                patient_age:req.body.patient_age,
                patient_gender:req.body.patient_gender,
                patient_city:req.body.patient_city.toLowerCase(),
                patient_email:req.body.patient_email,
                patient_password:hashPassword,
                patient_photo:req.files.patient_photo[0].filename,
                patient_docs:user_docs,
            });
            let save_details=await patientDetails.save();
            console.log("Saved patient details",save_details);
            res.end();
        }
        else{
            console.log("Error to save patient details");
        }
    }
    catch(err){
        console.log("Error to collect data",err);
    }
}
module.exports={
    getRegistration,
    postRegistration
}