const express=require('express');
const router=express.Router();
const {switchAdminUser} = require('../Controller/switchController');

router.get('/',switchAdminUser);

module.exports=router;
