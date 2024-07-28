const DoctorModel=require('../Model/doctorModel');
const path=require('path');
const fs=require('fs');

const addDoctors=(req,res)=>{
    res.render('admin/addDoctor',{
        title:"Add Doctors"
    })
}
const postDocForm=async(req,res)=>{
    try{
        // console.log("Collected data:",req.body,req.file);
        let mail=await DoctorModel.findOne({doc_email:req.body.doc_email});
        if(!mail){
            let doc_details=new DoctorModel({
                doc_name:req.body.doc_name.toLowerCase(),
                doc_degree:req.body.doc_degree.toLowerCase(),
                doc_experience:req.body.doc_experience.toLowerCase(),
                doc_specialization:req.body.doc_specialization.toLowerCase(),
                doc_visit_days:req.body.doc_visit_days,
                doc_fees:req.body.doc_fees,
                doc_email:req.body.doc_email,
                doc_photo:req.file.filename,
            });
            let save_details=await doc_details.save();
            console.log("Doctor details saved successfully",save_details);
            res.redirect('/admin/viewdoctors');
        }
        else{
            console.log("User already exists");
        }
    }
    catch(err){
        console.log("Error to collect data",err);
    }
}
const viewDoctors=async(req,res)=>{
    try{
        let viewDoctor=await DoctorModel.find();
        // console.log("All doctors list:",viewDoctor);
        if(viewDoctor){
            res.render('admin/viewDoctor',{
                title:"Doctors list",
                data:viewDoctor
            })
        }
    }
    catch(err){
        console.log("Error to fetch doctor details",err);
    }
}
const updateDoctors=async(req,res)=>{
    try{
        let docDetails=await DoctorModel.findById(req.body.doc_id);
        // console.log("Doctor details to be updated",docDetails);
        if(docDetails){
            res.render('admin/updateDoctor',{
                title:"Update Doctor Details",
                data:docDetails
            })
        }
    }
    catch(err){
        console.log("Error to show update page",err);
    }
}
const postUpdateDetails=async(req,res)=>{
    try{
        let existing_data=await DoctorModel.findById(req.body.up_doc_id);
        console.log("Data to be edited",existing_data);
        existing_data.doc_name=req.body.up_doc_name.toLowerCase()||existing_data.doc_name;
        existing_data.doc_degree=req.body.up_doc_degree.toLowerCase()||existing_data.doc_degree;
        existing_data.doc_experience=req.body.up_doc_experience.toLowerCase()||existing_data.doc_experience;
        existing_data.doc_specialization=req.body.up_doc_specialization.toLowerCase()||existing_data.doc_specialization;
        existing_data.doc_visit_days=req.body.up_doc_visit_days||existing_data.doc_visit_days;
        existing_data.doc_fees=req.body.up_doc_fees||existing_data.doc_fees;
        existing_data.doc_email=req.body.up_doc_email||existing_data.doc_email;
        if(req.file==undefined){
            existing_data.doc_photo=existing_data.doc_photo;
        }
        else{
            let filePath=path.join(__dirname,"..","uploads","doctors",existing_data.doc_photo);
            fs.unlinkSync(filePath);
            existing_data.doc_photo=req.file.filename;
        }
        let updated_data=await existing_data.save();
        console.log("Updated details",updated_data);
        res.redirect('/admin/viewdoctors');
    }
    catch(err){
        console.log("Error to update data",err);
    }
}
const postDeleteDetails=async(req,res)=>{
    try{
        let delete_data=await DoctorModel.findOneAndDelete({_id:req.body.doc_id});
        console.log("Deleted doctor details",delete_data);
        if(delete_data.doc_photo){
            let filePath=path.join(__dirname,"..","uploads","doctors",delete_data.doc_photo);
            fs.unlinkSync(filePath);
        }
        res.redirect('/admin/viewdoctors');
    }
    catch(err){
        console.log("Error to delete details",err);
    }
}
module.exports={
    addDoctors,
    postDocForm,
    viewDoctors,
    updateDoctors,
    postUpdateDetails,
    postDeleteDetails
}