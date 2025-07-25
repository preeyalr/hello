import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const userSchema = new mongoose.Schema({
    name:{
        "type": String,
        "required": true,
    },
    email:{
        "type": String,
        "required": true,
        "unique": true,
    },
    password:{
        "type": String,
        "required": true,
    },
    dob:{
        "type": Date,
        
    },
    contact:{
        "type": Number,
        "required": false,
    },
    residentialAddress:{
        "type": String,
        "required": false,
    },
    profession:{
        "type": String,
        "required": false,
    },
    profilePicture:{
        "type": String,
        "required": false,
    },
    role:{
        "type": String,
        "enum": ['Resident', 'Admin', 'Guest','Shopkeeper','Community Member','Security'],
        "default": 'Guest',
        "required": false,
    },
    aadharProof:{
        "type": String,
        "required": false,
    },
    refreshToken:{
        "type": String,
        "required": false,
    },
},{timestamps: true});

userSchema.pre('save',async function(next){
    
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
    next();
});

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function(){
    const accessToken = jwt.sign(
      { _id: this._id, email: this.email, name: this.name },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
    return accessToken;
}

userSchema.methods.generateRefreshToken = function(){
    const refreshToken = jwt.sign(
      { _id: this._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
    return refreshToken;
}

const User = mongoose.model('users', userSchema);

export { User};
