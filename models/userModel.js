const mongoose  = require("mongoose")

const userSchema = new mongoose.Schema({
    mobile:{type:Number,required:true,minlength:10,maxlength:14 },
    name:{type:String,required:true,minlength:3,maxlength:20 },
    email:{type:String,minlength:2,maxlength:100,unique:true,lowercase: true,default:null},
    password:{type:String,minlength:2,maxlength:1024,default:null},
    PAN:{type:String,minlength:9,maxlength:14,default:null},
    fathers_Name:{type:String,minlength:3,maxlength:14,default:null},
    DOB:{type:String,minlength:2,maxlength:100,unique:true,default:null},
},{
    timestamps:true
})

const userModel = mongoose.model("userRegister",userSchema )


const activeSessionSchema = new mongoose.Schema({
    userId:{type:String,required:true,minlength:5,maxlength:1024},
},{
    timestamps:true
})

const sessionModel = mongoose.model("activeSession",activeSessionSchema )


module.exports = {userModel,sessionModel}