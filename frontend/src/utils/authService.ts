import api from './api';

// Interface for OTP request (email or phone)
interface OTPRequestData {
  contactMethod: 'email' | 'phone';
  contact: string;
}

// Interface for OTP verification
interface OTPVerifyData extends OTPRequestData {
  otp: string;
}

// Interface for password reset
interface PasswordResetData extends OTPVerifyData {
  password: string;
}

// Generate OTP for password reset
export const generateOTP = async (data: OTPRequestData): Promise<boolean> => {
  try {
    // Extract the appropriate contact information based on the method
    const email = data.contactMethod === 'email' ? data.contact : '';
    const phone = data.contactMethod === 'phone' ? data.contact : '';
    
    // Call the actual API endpoint
    const response = await api.post('/users/forgot-password', { 
      email: email || undefined,
      phone: phone || undefined
    });
    
    return response.data.success !== false;
  } catch (error) {
    console.error('Error generating OTP:', error);
    throw new Error('Failed to send verification code. Please try again.');
  }
};

// Verify OTP
export const verifyOTP = async (data: OTPVerifyData): Promise<boolean> => {
  try {
    // Extract the appropriate contact information based on the method
    const email = data.contactMethod === 'email' ? data.contact : '';
    const phone = data.contactMethod === 'phone' ? data.contact : '';
    
    // Call the actual API endpoint
    const response = await api.post('/users/verify-otp', { 
      email: email || undefined, 
      phone: phone || undefined,
      otp: data.otp
    });
    
    return response.data.valid === true;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

// Reset password after OTP verification
export const resetPassword = async (data: PasswordResetData): Promise<boolean> => {
  try {
    // Extract the appropriate contact information based on the method
    const email = data.contactMethod === 'email' ? data.contact : '';
    const phone = data.contactMethod === 'phone' ? data.contact : '';
    
    // Call the actual API endpoint
    const response = await api.post('/users/reset-password', {
      email: email || undefined,
      phone: phone || undefined,
      otp: data.otp,
      newPassword: data.password
    });
    
    return response.data.success !== false;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
}; 