import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    account_number: {
      type: Number,
    },
    fullname: {
      type: String,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
    },
    phone_number: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    pincode: {
      type: Number,
      trim: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    wallet_balance: {
      type: Number,
      min: 0,
      default: 0,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model('UserModel', UserSchema);

export default UserModel;
