const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter user name"],
        maxlength:[30,"Name cann't exceed 30 characters"],
        minLength:[4,"Name should be more than 4 characters"]
    },
    email:{
        type:String,
        required:[true,"Please enter email"],
        unique:true,
        validator:[validator.isEmail,"Please enter a valid email"]
    },
    password:{
        type:String,
        required:[true,"Please enter password"],
        minLength:[8,"password should be more than 8 characters"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

//hashing the password 
userSchema.pre("save",async function(next){
    //checking if already hashed
    if(!this.isModified("password")){
        next();
    }
    this.password= await bcrypt.hash(this.password,10);
})

//jwt token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
}

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

module.exports = mongoose.model("User",userSchema);