const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const DoctorSchema=new Schema({
    doc_name:{
        type:String,
        required:true
    },
    doc_degree:{
        type:String,
        required:true
    },
    doc_experience:{
        type:String,
        required:true
    },
    doc_specialization:{
        type:String,
        required:true
    },
    doc_visit_days:{
        type:[String],
        required:true
    },
    doc_visit_time:{
        type:[String],
        required:true
    },
    doc_fees:{
        type:Number,
        required:true
    },
    doc_email:{
        type:String,
        required:true
    },
    doc_photo:{
        type:String,
        required:false
    },
},{
    timestamps:true,
    versionKey:false,
});
const DoctorModel=new mongoose.model('doctor_details',DoctorSchema);
module.exports=DoctorModel;