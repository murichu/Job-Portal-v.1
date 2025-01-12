import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique
    },
    resume: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set creation timestamp
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Automatically set update timestamp
    },
  },
  
);

// Create a Mongoose model from the schema
const User = mongoose.models.user || mongoose.model('User', userSchema);

export default User;