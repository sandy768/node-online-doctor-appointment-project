const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const patientSchema=new Schema({
    patient_name:{
        type:String,
        required:true
    },
    patient_age:{
        type:Number,
        required:true
    },
    patient_gender:{
        type:String,
        required:true
    },
    patient_city:{
        type:String,
        required:true
    },
    patient_email:{
        type:String,
        required:true
    },
    patient_password:{
        type:String,
        required:true
    },
    patient_photo:{
        type:[String],
        required:true
    },
    patient_docs:{
        type:[String],
        required:true
    }
},{
    timestamps:true,
    versionKey:false
});
const patientModel=new mongoose.model("patient_details",patientSchema);
module.exports=patientModel;