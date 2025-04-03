import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { createOTP, verifyOTP } from '../utils/otpService';

// Forgot password - request OTP
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Check if email exists
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // For security reasons, don't reveal if email exists or not
      res.status(200).json({ message: 'If your email is registered, you will receive a password reset OTP shortly' });
      return;
    }

    // Generate and send OTP
    await createOTP(email);

    res.status(200).json({ message: 'Password reset OTP has been sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'An error occurred during the password reset request', error: (error as Error).message });
  }
};

// Verify OTP and reset password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;

    // Check if all required fields are provided
    if (!email || !otp || !newPassword) {
      res.status(400).json({ message: 'Email, OTP, and new password are required' });
      return;
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Verify OTP
    const isValidOTP = await verifyOTP(email, otp);
    if (!isValidOTP) {
      res.status(400).json({ message: 'Invalid or expired OTP' });
      return;
    }

    // Password validation
    if (newPassword.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long' });
      return;
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    user.passwordHash = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'An error occurred during the password reset', error: (error as Error).message });
  }
};

// Verify OTP only (without changing password)
export const verifyOTPOnly = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    // Check if required fields are provided
    if (!email || !otp) {
      res.status(400).json({ message: 'Email and OTP are required' });
      return;
    }

    // Verify OTP
    const isValidOTP = await verifyOTP(email, otp);
    if (!isValidOTP) {
      res.status(400).json({ message: 'Invalid or expired OTP', valid: false });
      return;
    }

    res.status(200).json({ message: 'OTP verified successfully', valid: true });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'An error occurred during OTP verification', error: (error as Error).message });
  }
}; 