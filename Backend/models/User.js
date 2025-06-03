const mongoose=require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
  type: String,
  enum: ['admin', 'client'],
  default: 'client'
 },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    required: true,
  },
  walletBalance: {
    type: Number,
    default: 0,
  },
  contestsRegistered: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contest'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const UserModel = mongoose.model("User", userSchema) //creating model for that schema

module.exports = UserModel //exporting the model