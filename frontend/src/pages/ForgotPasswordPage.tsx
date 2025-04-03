import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Stepper, 
  Step, 
  StepLabel,
  Alert,
  InputAdornment,
  IconButton,
  FormControl,
  FormHelperText,
  Grid,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Email as EmailIcon, 
  Phone as PhoneIcon, 
  Visibility, 
  VisibilityOff, 
  Lock as LockIcon,
  LockReset as LockResetIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import * as authService from '../utils/authService';

const steps = ['Enter Email/Phone', 'Verify OTP', 'Reset Password'];

const ForgotPasswordPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Form validation states
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!re.test(String(email).toLowerCase())) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePhone = (phone: string) => {
    const re = /^[0-9]{10}$/;
    if (!phone) {
      setPhoneError('Phone number is required');
      return false;
    }
    if (!re.test(phone)) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validateOtp = (otp: string) => {
    if (!otp) {
      setOtpError('OTP is required');
      return false;
    }
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setOtpError('Please enter a valid 6-digit OTP');
      return false;
    }
    setOtpError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleSendOtp = async () => {
    try {
      setError(null);
      setLoading(true);

      let isValid = false;
      const contact = contactMethod === 'email' ? email : phone;

      if (contactMethod === 'email') {
        isValid = validateEmail(email);
      } else {
        isValid = validatePhone(phone);
      }

      if (!isValid) {
        setLoading(false);
        return;
      }

      // Call the authService to generate and send OTP
      await authService.generateOTP({
        contactMethod,
        contact
      });

      setOtpSent(true);
      setSuccess(`OTP sent to your ${contactMethod}. Please check and enter the 6-digit code.`);
      
      // Move to next step
      setTimeout(() => {
        setActiveStep(1);
        setSuccess(null);
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setError(null);
      setLoading(true);

      if (!validateOtp(otp)) {
        setLoading(false);
        return;
      }

      // Call the authService to verify OTP
      await authService.verifyOTP({
        contactMethod,
        contact: contactMethod === 'email' ? email : phone,
        otp
      });

      setSuccess('OTP verified successfully. Please set your new password.');
      
      // Move to next step
      setTimeout(() => {
        setActiveStep(2);
        setSuccess(null);
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setError(null);
      setLoading(true);

      const isPasswordValid = validatePassword(password);
      const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword);

      if (!isPasswordValid || !isConfirmPasswordValid) {
        setLoading(false);
        return;
      }

      // Call the authService to reset password
      await authService.resetPassword({
        contactMethod,
        contact: contactMethod === 'email' ? email : phone,
        otp,
        password
      });

      setSuccess('Password reset successfully! You will be redirected to login page.');
      
      // Redirect to login page
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      handleSendOtp();
    } else if (activeStep === 1) {
      handleVerifyOtp();
    } else if (activeStep === 2) {
      handleResetPassword();
    }
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Button
                    variant={contactMethod === 'email' ? 'contained' : 'outlined'}
                    onClick={() => setContactMethod('email')}
                    sx={{ mr: 1 }}
                    startIcon={<EmailIcon />}
                  >
                    Email
                  </Button>
                  <Button
                    variant={contactMethod === 'phone' ? 'contained' : 'outlined'}
                    onClick={() => setContactMethod('phone')}
                    startIcon={<PhoneIcon />}
                  >
                    Phone
                  </Button>
                </Box>
              </Grid>
              {contactMethod === 'email' ? (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) validateEmail(e.target.value);
                    }}
                    error={!!emailError}
                    helperText={emailError}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (phoneError) validatePhone(e.target.value);
                    }}
                    error={!!phoneError}
                    helperText={phoneError}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="body1" gutterBottom>
              Please enter the 6-digit OTP sent to your {contactMethod}:
              <strong> {contactMethod === 'email' ? email : phone}</strong>
            </Typography>
            <TextField
              fullWidth
              label="OTP"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                if (otpError) validateOtp(e.target.value);
              }}
              error={!!otpError}
              helperText={otpError}
              placeholder="Enter 6-digit OTP"
              sx={{ mt: 2 }}
              inputProps={{ maxLength: 6 }}
            />
            <Button
              variant="text"
              color="primary"
              onClick={handleSendOtp}
              disabled={loading}
              sx={{ mt: 1 }}
            >
              Resend OTP
            </Button>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="body1" gutterBottom>
              Set your new password
            </Typography>
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <TextField
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) validatePassword(e.target.value);
                }}
                error={!!passwordError}
                helperText={passwordError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (confirmPasswordError) validateConfirmPassword(password, e.target.value);
                }}
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockResetIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 4
          }}
        >
          Forgot Password
        </Typography>

        <Card
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: `0 8px 40px ${alpha(theme.palette.primary.main, 0.12)}`,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '5px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            {getStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0 || loading}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading || (activeStep === 0 && !otpSent && false)} // Enable for demo
                sx={{
                  backgroundImage: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                }}
              >
                {loading
                  ? activeStep === 0 
                    ? 'Sending OTP...' 
                    : activeStep === 1 
                      ? 'Verifying...' 
                      : 'Resetting...'
                  : activeStep === steps.length - 1
                    ? 'Reset Password'
                    : activeStep === 0
                      ? 'Send OTP'
                      : 'Verify & Continue'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Button
          variant="text"
          color="primary"
          onClick={() => navigate('/login')}
          sx={{ mt: 3 }}
        >
          Remember your password? Sign in
        </Button>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage; 