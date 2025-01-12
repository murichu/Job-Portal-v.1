import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    resume: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    verifyOtp: {
      type: String,
      default: '',
    },
    verifyOtpExpireAt: {
      type: Number,
      default: 0,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    resetOtp: {
      type: Number,
      default: '', 
    },
    resetOtpExpireAt: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

const User = mongoose.models.User || mongoose.model('user', userSchema);

export default User;
