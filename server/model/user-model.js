const {Schema, model} = require('mongoose');

const userSchema = new Schema({
  user_type:{type:String, enum:['common','staff','admin'], required:true },
  name:{type:String, required:true},
  email:{type:String, required:true},
  password:{type:String, required:true}
},{timestamps:true})

module.exports = model('User',userSchema);