const express = require("express")
const router= express.Router()
const {userRegister,userRegisterEmailPass,userRegisterDetails, userLogin} = require("../controller/userController")


router.post("/register",userRegister)
router.post("/register/emailpass",userRegisterEmailPass)
router.post("/register/details",userRegisterDetails)



router.post("/login",userLogin)



module.exports=router