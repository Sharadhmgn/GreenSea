import mongoose, { Document, Schema } from 'mongoose';

interface IOTP extends Document {
  email: string;
  code: string;
  expiresAt: Date;
  createdAt: Date;
}

const otpSchema = new Schema<IOTP>({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  code: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '1h' // Automatically remove documents after 1 hour
  }
});

// Create index for quick lookup by email
otpSchema.index({ email: 1 });

const OTP = mongoose.model<IOTP>('OTP', otpSchema);

export default OTP; 