const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const tokenSchema=new Schema({
    _userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'patient_details'
    },
    token:{
        type:String,
        required:true
    },
});
const tokenModel=new mongoose.model("token_details",tokenSchema);
module.exports=tokenModel;