const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const User = require("../models/userModels");
const sendToken = require("../utils/jwtToken");

//register a user
exports.registerUser = catchAsyncError(async(req,res,next)=>{
    const {name,email,password} = req.body;
    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"this is a sample id",
            url:"profilepicurl"
        }
    });
    sendToken(user,201,res);

});

//login user
exports.loginUser = catchAsyncError(async(req,res,next)=>{
    const{email,password}=req.body;
    //checking if user has given both email and password
    if(!email || !password){
        return next(new ErrorHandler("Please enter email & password",400));
    }

    const user = await User.findOne({email:email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email & password",401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email & password",401));
    }

    sendToken(user,200,res);


})

//logout error
exports.logout = catchAsyncError(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    });

    res.status(200).json({
        success:true,
        message:"Logged out successfully"
    })
})