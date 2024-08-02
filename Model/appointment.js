const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const appointmentSchema=new Schema({
    patient_id:{
        type:Schema.Types.ObjectId,
        ref:"patient_details"
    },
    patient_name:{
        type:String,
        required:true
    },
    doc_id:{
        type:Schema.Types.ObjectId,
        ref:"doctor_details"
    },
    doc_name:{
        type:String,
        required:true
    },
    doc_specialization:{
        type:String,
        required:true
    },
    doc_fees:{
        type:String,
        required:true
    },
    appointment_day:{
        type:String,
        required:true
    },
    appointment_time:{
        type:String,
        required:true
    }
},{
    timestamps:true,
    versionKey:false,
});

const appointmentModel=new mongoose.model("appointment_details",appointmentSchema);
module.exports=appointmentModel;