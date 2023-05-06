const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
const mongoose = require("mongoose")
var bodyParser = require('body-parser')

// middlewares
app.use(express.json())
app.use(cors());

// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


//  Ports and Urls
const port = process.env.PORT || 8080
const url = "mongodb+srv://casper:Atlas123@cluster0.hztpe0f.mongodb.net/lendbox?retryWrites=true&w=majority"


// routes import
const userRouter = require("./routes/authRoutes")
const {userModel} = require("./models/userModel")


app.get("/",async(req,res)=>{
    let data =await userModel.find()
    res.status(200).json({message:"welcome to the Lendbox api",data:data})
})

app.use("/register",userRouter)

//userId  64561c4a9dc3e3e3907b858b



app.listen(port,()=>{

    try{
        console.log(`server running on port : ${port}`)
        mongoose.connect(url).then(()=>console.log("mongodb connection stablished")).catch((err)=>{
            console.log("mongodb connection failed err :",err.message)
        })
    }catch(err){
        console.log(err)
    }
})