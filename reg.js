// const mongoose = require('mongoose');

// const reguserSchema = new mongoose.Schema({
  
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   phonenumber:{
//     type:Number,
//     required:true,
//   },
//   // otp:{
//   //   type:Number,
//   //   required:true,
//   // },
// });

// const regUser = mongoose.model('User', reguserSchema);

// module.exports=regUser;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const regUserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  phoneNumber: String,
});

const regUser = mongoose.model('regUser', regUserSchema);

module.exports = regUser;
