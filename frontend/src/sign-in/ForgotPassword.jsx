import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { SendResetOTP, ResetPassword } from '../../ApiCall';

function ForgotPassword({ open, handleClose }) {
  const [step, setStep] = React.useState('email'); // 'email', 'otp', 'newPassword'
  const [email, setEmail] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [otpError, setOtpError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);

  const handleEmailSubmit = async () => {
    setError('');
    setEmailError(false);

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await SendResetOTP(email);
      
      if (response.status === 200 || response.status === 201) {
        setStep('otp');
        setError('');
      } else {
        setError(response.data?.msg || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('SendResetOTP error:', err);
    }
    setLoading(false);
  };

  const handleOtpSubmit = async () => {
    setError('');
    setOtpError(false);

    if (!otp || otp.length < 1) {
      setOtpError(true);
      setError('Please enter the OTP');
      return;
    }

    setStep('newPassword');
    setError('');
  };

  const handlePasswordSubmit = async () => {
    setError('');
    setPasswordError(false);

    if (!newPassword || newPassword.length < 6) {
      setPasswordError(true);
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(true);
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await ResetPassword(email, otp, newPassword);
      
      if (response.status === 200 || response.status === 201) {
        setError('');
        handleClose();
        // Reset all states
        setStep('email');
        setEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(response.data?.msg || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('ResetPassword error:', err);
    }
    setLoading(false);
  };

  const handleDialogClose = () => {
    setStep('email');
    setEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setEmailError(false);
    setOtpError(false);
    setPasswordError(false);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      PaperProps={{
        sx: { backgroundImage: 'none' },
      }}
    >
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', minWidth: '400px' }}>
        {error && (
          <Alert severity="error">{error}</Alert>
        )}

        {/* Step 1: Email */}
        {step === 'email' && (
          <>
            <DialogContentText>
              Enter your account's email address, and we'll send you an OTP to reset your password.
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="email"
              name="email"
              label="Email address"
              placeholder="your@email.com"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              disabled={loading}
            />
          </>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <>
            <DialogContentText>
              We've sent an OTP to {email}. Please enter it below.
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="otp"
              name="otp"
              label="OTP"
              placeholder="000000"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value.slice(0, 6))}
              error={otpError}
              disabled={loading}
              inputProps={{ maxLength: '6' }}
            />
          </>
        )}

        {/* Step 3: New Password */}
        {step === 'newPassword' && (
          <>
            <DialogContentText>
              Enter your new password.
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="newPassword"
              name="newPassword"
              label="New Password"
              placeholder="••••••"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={passwordError}
              disabled={loading}
            />
            <TextField
              required
              margin="dense"
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="••••••"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={passwordError}
              disabled={loading}
            />
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleDialogClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={
            step === 'email' ? handleEmailSubmit :
            step === 'otp' ? handleOtpSubmit :
            handlePasswordSubmit
          }
          disabled={loading}
        >
          {loading ? 'Loading...' : 
           step === 'email' ? 'Send OTP' :
           step === 'otp' ? 'Verify OTP' :
           'Reset Password'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ForgotPassword;
