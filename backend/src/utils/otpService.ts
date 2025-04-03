import crypto from 'crypto';
import OTP from '../models/otpModel';
import { sendPasswordResetOTP } from './emailService';

// Generate a random OTP of specified length
const generateOTP = (length: number = 6): string => {
  // Generate a random number with the specified length
  const multiplier = Math.pow(10, length);
  return Math.floor(Math.random() * multiplier).toString().padStart(length, '0');
};

// Create and store a new OTP for the given email
export const createOTP = async (email: string): Promise<string> => {
  try {
    // Generate a 6-digit OTP
    const otp = generateOTP(6);
    
    // Set expiration time (15 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);
    
    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email });
    
    // Create and save new OTP document
    await OTP.create({
      email,
      code: otp,
      expiresAt
    });
    
    // Send OTP via email
    await sendPasswordResetOTP(email, otp);
    
    return otp;
  } catch (error) {
    console.error('Error creating OTP:', error);
    throw error;
  }
};

// Verify an OTP for the given email
export const verifyOTP = async (email: string, code: string): Promise<boolean> => {
  try {
    // Find the OTP document
    const otpRecord = await OTP.findOne({
      email,
      code
    });
    
    // If no record found or OTP has expired
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return false;
    }
    
    // Delete the OTP record (one-time use)
    await OTP.deleteOne({ _id: otpRecord._id });
    
    return true;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
}; 