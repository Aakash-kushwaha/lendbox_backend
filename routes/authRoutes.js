const express = require("express")
const router= express.Router()
const {userRegister,userRegisterEmailPass,userRegisterDetails, userLogin} = require("../controller/userController")


router.post("/mobile",userRegister)
router.post("/email",userRegisterEmailPass)
router.post("/details",userRegisterDetails)



router.post("/login",userLogin)



module.exports=router