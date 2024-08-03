const patientModel=require('../Model/patientModel');
const bcrypt=require('bcryptjs');
const nodemailer=require('nodemailer');

const tokenModel=require('../Model/tokenModel');
const jwt=require('jsonwebtoken');

const mailTransporter=nodemailer.createTransport({
    host:'smtp',
    port:465,
    secure:false,
    requireTLS:true,
    service:'gmail',
    auth:{
        user:'sandiptomajumdar@gmail.com',
        pass:'jhxh bpcb pxyu ynvt'
    }
})

const getRegistration=(req,res)=>{
    let mailSuccess=req.flash('success-mail');
    let mail_success=mailSuccess.length>0?mailSuccess[0]:null;

    let mail_err=req.flash('err-mail');
    let mail_error=mail_err.length>0?mail_err[0]:null;

    let errVerify=req.flash('err-verify');
    let verifyError=errVerify.length>0?errVerify[0]:null;

    res.render('user/registration',{
        title:"Patient Registration",
        email_success:mail_success,
        error_mail:mail_error,
        error_verify:verifyError
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
            const token_jwt=jwt.sign(
                {patient_email:req.body.patient_email},
                "secret@79r908230gehwel",
                {expiresIn:"1h"}
            );
            const tokenData=new tokenModel({
                token:token_jwt,
                _userId:save_details._id,
            });
            let tokenSave=await tokenData.save();
            if(tokenSave){
                let mailReceiver={
                    from:'sandiptomajumdar@gmail.com',
                    to:req.body.patient_email,
                    subject:'Email Verification',
                    text:'Hello'+" "+req.body.patient_name+'\n\n'+
                    '\n\nYou have successfully submitted your details to be registered. Please verify your email by clicking this link:\n'+
                    'http://'+
                    req.headers.host+
                    '/patient_mail_confirmation/'+
                    req.body.patient_email+
                    '/'+
                    token_jwt+
                    '\n\nThank you!\n'
                }
                mailTransporter.sendMail(mailReceiver,function(err,info){
                    if(err){
                        console.log("Failed to send mail",err);
                        res.redirect('/user/registration');
                    }
                    else{
                        req.flash('success-mail','Successfully registered, please check your gmail for mail verification');
                        res.redirect('/user/registration');
                    }
                })
            }
        }
        else{
            req.flash('err-mail','Email Id already exists, please give another email id');
            res.redirect('/user/registration');
        }
    }
    catch(err){
        console.log("Error to collect data",err);
    }
}
const mailConfirmation=async(req,res)=>{
    try{
        let tokenData=await tokenModel.findOne({token:req.params.token});
        if(tokenData){
            let patient_data=await patientModel.findOne({patient_email:req.params.email});
            if(patient_data.isVerify){
                req.flash('err-verify','Email already verified, go to sign in');
                res.redirect('/user/registration');
            }
            else{
                patient_data.isVerify=true;
                let save_data=await patient_data.save();
                // console.log("Saved patient details",save_details);
                if(save_data){
                    req.flash('success-verify','Successfully verified, sign in now');
                    res.redirect('/user/viewlogin');
                }
            }
        }

    }
    catch(err){
        console.log("Error to collect data",err);
    }
}
const getLogin=(req,res)=>{
    let successVerify=req.flash('success-verify');
    let verifySuccess=successVerify.length>0?successVerify[0]:null;

    let updatePass=req.flash('up-pass');
    let passUpdate=updatePass.length>0?updatePass[0]:null;

    let errPassMatch=req.flash('err-pass-match');
    let passMatchErr=errPassMatch.length>0?errPassMatch[0]:null;

    let errMailMatch=req.flash('err-mail-match');
    let mailMatchErr=errMailMatch.length>0?errMailMatch[0]:null;

    let errLog=req.flash('err-log');
    let logErr=errLog.length>0?errLog[0]:null;

    res.render('user/login',{
        title:"Patient Login",
        success_verify:verifySuccess,
        update_password:passUpdate,
        error_pass_match:passMatchErr,
        error_mail_match:mailMatchErr,
        error_log:logErr

    })
}
const postLogin=async(req,res)=>{
    try{
        // console.log("Collected Login data:",req.body);
        let log_details=await patientModel.findOne({patient_email:req.body.login_email});
        if(log_details){
            let pass_verify=await bcrypt.compare(req.body.login_password,log_details.patient_password);
            if(pass_verify){
                let token_payload={patientData:log_details};
                let token_jwt=jwt.sign(token_payload,process.env.SECRET_KEY,{
                    expiresIn:"1h",
                });
                res.cookie("token_data",token_jwt,{
                    expires:new Date(Date.now()+3600000),
                    httpOnly:true,
                });
                res.redirect('/user/viewProfile');
            }
            else{
                req.flash('err-pass-match','Incorrect Password');
                res.redirect('/user/viewlogin');
            }
        }
        else{
            req.flash('err-mail-match','Invalid Email Id');
            res.redirect('/user/viewlogin');
        }
    }
    catch(err){
        console.log("Error to collect login data",err);
    }
}

const getEmail=(req,res)=>{
    let recoverMail=req.flash('recovery-mail');
    let mail_recovery=recoverMail.length>0?recoverMail[0]:null;

    let errMailRecovery=req.flash('err-mail-recovery');
    let errRecoveryMail=errMailRecovery.length>0?errMailRecovery[0]:null;

    res.render('user/recoveryEmail',{
        title:"Password Recovery",
        recovery_mail:mail_recovery,
        error_mail_recovery:errRecoveryMail
    })
}
const postEmail=async(req,res)=>{
    try{
        let patient_data=await patientModel.findOne({patient_email:req.body.email});
        if(patient_data){
            let mailReceiver={
                from:'sandiptomajumdar@gmail.com',
                to:req.body.email,
                subject:'Password Recovery',
                text:'Hello'+" "+patient_data.patient_name+'\n'+
                '\n\nPlease recover your password by clicking this link:\n'+
                'http://'+
                req.headers.host+
                '/patient/getpasswordrecovery/'+
                req.body.email+
                '\n\nThank you!\n'
            }
            mailTransporter.sendMail(mailReceiver,function(err,info){
                if(err){
                    console.log("Failed to send mail",err);
                    res.redirect('/recovery/email');
                }
                else{
                    req.flash('recovery-mail','Successfully sent email, please check your gmail for password recovery');
                    res.redirect('/recovery/email');
                }
            })
        }
        else{
            req.flash('err-mail-recovery','Invalid email, please give your correct email id');
            res.redirect('/recovery/email');
        }
    }
    catch(err){
        console.log("Error to collect email",err);
    }
}
const getRecoverPass=async(req,res)=>{
    try{
        let user_email=await patientModel.findOne({patient_email:req.params.email});
        if(user_email){
            res.render('user/recoverPass',{
                title:"Password Recovery",
                data:user_email
            })
        }
    }
    catch(err){
        console.log("Error to show email",err);
    }
}
const postRecoverPass=async(req,res)=>{
    try{
        let existing_data=await patientModel.findOne({patient_email:req.body.email});
        if(existing_data){
            if(req.body.password===req.body.cnf_password){
                let passHash=await bcrypt.hash(req.body.password,12);
                existing_data.patient_password=passHash;
                let updated_password=await existing_data.save();
                if(updated_password){
                    req.flash('up-pass','Password successfully updated, please use your new password');
                    res.redirect('/user/viewlogin');
                }
                else{
                    console.log("Error to update password");
                }
            }
            else{
                res.send('Password does not match');
            }
        }
    }
    catch(err){
        console.log("Error to collect password recovery data",err);
    }
}
module.exports={
    getRegistration,
    postRegistration,
    mailConfirmation,
    getLogin,
    postLogin,
    getEmail,
    postEmail,
    getRecoverPass,
    postRecoverPass
}