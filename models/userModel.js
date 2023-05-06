const mongoose  = require("mongoose")
const { Schema } = mongoose;

const Step1Schema = new Schema({
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const Step1Registration = mongoose.model('Step1Registration', Step1Schema);

const Step2Schema = new Schema({
    mobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  });
  
  const Step2Registration = mongoose.model('Step2Registration', Step2Schema);
  

const Step3Schema = new Schema({
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  PAN: {
    type: String,
    required: true,
  },
  DOB: {
    type: String,
    required: true,
  },
  father_Name: {
    type: String,
    required: true,
  },
});

const Step3Registration = mongoose.model('Step3Registration', Step3Schema);


const activeSessionSchema = new mongoose.Schema({
    userId:{type:String,required:true,minlength:5,maxlength:1024},
},{
    timestamps:true
})

const sessionModel = mongoose.model("activeSession",activeSessionSchema )


module.exports = {Step1Registration,Step2Registration,Step3Registration,sessionModel}