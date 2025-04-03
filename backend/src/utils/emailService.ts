import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configure email provider based on environment variables
const getEmailTransporter = async () => {
  // Check if we have valid SMTP credentials
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    console.log(`Using configured SMTP server: ${process.env.EMAIL_HOST}`);
    
    // Return configured SMTP transporter
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } 
  
  // If SMTP_SERVICE is set to mailtrap, use Mailtrap configuration
  if (process.env.SMTP_SERVICE === 'mailtrap') {
    console.log('Using Mailtrap for email testing');
    return nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    });
  }
  
  // Use Ethereal for testing as fallback
  console.log('No email credentials found, using Ethereal test account');
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
};

// Send password reset OTP
export const sendPasswordResetOTP = async (email: string, otp: string) => {
  try {
    const emailTransporter = await getEmailTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Green Sea Foods" <noreply@greenseafoods.com>`,
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <div style="background-color: #03a9f4; padding: 10px; text-align: center; border-radius: 5px 5px 0 0;">
            <h2 style="color: white; margin: 0;">Green Sea Foods</h2>
          </div>
          <div style="padding: 20px; text-align: center;">
            <h3>Password Reset Request</h3>
            <p>We received a request to reset your password. Please use the following OTP to complete the process:</p>
            <div style="background-color: #f5f5f5; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px; margin: 15px 0;">
              ${otp}
            </div>
            <p>This OTP will expire in 15 minutes.</p>
            <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
          <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px;">
            <p>&copy; ${new Date().getFullYear()} Green Sea Foods. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log('Password reset OTP email sent:', info.messageId);
    
    // For test accounts, log the preview URL
    if (info.messageId && !process.env.EMAIL_USER && !process.env.MAILTRAP_USER) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return true;
  } catch (error) {
    console.error('Error sending password reset OTP email:', error);
    throw error;
  }
}; 