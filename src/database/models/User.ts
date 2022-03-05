import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
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
    authentication_code: {
      type: Number,
      trim: true,
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
