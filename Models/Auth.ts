import mongoose from "mongoose";
import bcrypt from "bcrypt";

const AuthSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    dob:{
        type: Date,
        required:true
    },
    notes:{
       type:[String],
       default:[]
    }
})

AuthSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      return next();
    }
    try {
      this.password = await bcrypt.hash(this.password, 10);
      next();
    } catch (err) {
      throw err;
    }
  });
  
  AuthSchema.methods.comparePassword = async function (password : string) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (err) {
      throw err;
    }
  };

  const Author = mongoose.models.Auth || mongoose.model('Auth', AuthSchema);

module.exports = Author;