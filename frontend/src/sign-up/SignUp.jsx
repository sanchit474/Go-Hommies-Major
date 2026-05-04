import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './CustomIcons';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { CompleteUserProfile, UserSignUp, VerifyOTP } from '../../ApiCall';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignUp(props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [designationError, setDesignationError] = React.useState(false);
  const [designationErrorMessage, setDesignationErrorMessage] = React.useState('');
  const [aboutError, setAboutError] = React.useState(false);
  const [aboutErrorMessage, setAboutErrorMessage] = React.useState('');
  const [titleError, setTitleError] = React.useState(false);
  const [titleErrorMessage, setTitleErrorMessage] = React.useState('');
  const [otpForm, setOtpForm] = React.useState(false);
  const [profileCompleteForm, setProfileCompleteForm] = React.useState(false);
  const [UserEmail, setUserEmail] = React.useState('');
  const [signingUp, setSigningUp] = React.useState(false)
  const [otpError, setOtpError] = React.useState(false);
  const [otpErrorMessage, setOtpErrorMessage] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [verifyingOtp, setVerifyingOtp] = React.useState(false);
  const [completing, setCompleting] = React.useState(false)
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState('error');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const name = document.getElementById('name');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    if (!validateInputs()) {
      return;
    }
    const data = new FormData(event.currentTarget);

    const name = data.get('name');
    const email = data.get('email')
    const usernamearray = data.get('email').split('@')
    const username = usernamearray[0];
    const password = data.get('password')

    setUserEmail(email)
    setSigningUp(true)

    try {
      const response = await UserSignUp(name, email, username, password);

      if (response.status === 200 && response.data && response.data.email) {
        // Success - user created
        setAlertMessage('Account created! Please verify your email with the OTP sent to you.')
        setAlertSeverity('success')
        setShowAlert(true)
        setOtpForm(true)
      }
      else if (response.status === 400) {
        const errorMsg = response.data?.msg || 'Invalid request';
        
        if (errorMsg.includes('already exists')) {
          setEmailError(true);
          setEmailErrorMessage('This email is already registered');
          setAlertMessage('This email is already registered. Please sign in instead.')
        }
        else if (errorMsg.includes('already taken')) {
          setNameError(true);
          setNameErrorMessage('This username is already taken');
          setAlertMessage('This username is already taken. Please choose another.')
        }
        else {
          setAlertMessage(errorMsg)
        }
        setAlertSeverity('error')
        setShowAlert(true)
      }
      else {
        setAlertMessage(response.data?.msg || 'Error during signup. Please try again.')
        setAlertSeverity('error')
        setShowAlert(true)
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setAlertMessage(error?.response?.data?.msg || 'Network error. Please try again.')
      setAlertSeverity('error')
      setShowAlert(true)
    }

    setSigningUp(false)
  };

  const validateOtp = () => {
    if (!otp || otp.length < 1) {
      setOtpError(true);
      setOtpErrorMessage('Please enter the OTP');
      return false;
    } else {
      setOtpError(false);
      setOtpErrorMessage('');
      return true;
    }
  };

  const handleVerifyOtp = async(event) => {
    event.preventDefault();
    if (!validateOtp()) {
      return;
    }

    setVerifyingOtp(true);

    try {
      const response = await VerifyOTP(UserEmail, otp);
      
      if (response.status === 200) {
        setAlertMessage('Email verified! Please complete your profile.')
        setAlertSeverity('success')
        setShowAlert(true)
        setOtpForm(false)
        setProfileCompleteForm(true)
      } else {
        setOtpError(true);
        setOtpErrorMessage(response.data?.msg || 'Invalid OTP');
        setAlertMessage(response.data?.msg || 'OTP verification failed')
        setAlertSeverity('error')
        setShowAlert(true)
      }
    } catch (error) {
      setAlertMessage('Network error. Please try again.')
      setAlertSeverity('error')
      setShowAlert(true)
      console.error('OTP verification error:', error)
    }

    setVerifyingOtp(false)
  };

  const validateInputs2 = () =>{
    const about = document.getElementById('about')
    const title = document.getElementById('title')
    const designation = document.getElementById('designation')

    let isValid = true;

    if (!designation.value) {
      setDesignationError(true);
      setDesignationErrorMessage('Please enter your workplace');
      isValid = false;
    } else {
      setDesignationError(false);
      setDesignationErrorMessage('');
    }

    if (!about.value) {
      setAboutError(true);
      setAboutErrorMessage('Write something about you');
      isValid = false;
    } else {
      setAboutError(false);
      setAboutErrorMessage('');
    }

    if (!title.value || title.value.length < 1) {
      setTitleError(true);
      setTitleErrorMessage('A cool title is required');
      isValid = false;
    } else {
      setTitleError(false);
      setTitleErrorMessage('');
    }

    return isValid;
  }

  const handleSubmit2 = async(event) => {
    event.preventDefault();
    if (!validateInputs2()) {
      return;
    }
    const data = new FormData(event.currentTarget);

    const title = data.get('title')
    const designation = data.get('designation')
    const about = data.get('about')
    setCompleting(true)

    try {
      const response = await CompleteUserProfile(UserEmail, title, designation, about);

      if (response.data.msg === 'User Updated Successfully') {
        setAlertMessage('Profile completed successfully! Redirecting to sign in...')
        setAlertSeverity('success')
        setShowAlert(true)
        setTimeout(() => navigate('/signin'), 1500)
      }
      else {
        setAlertMessage(response.data.msg || 'Error updating profile. Please try again.')
        setAlertSeverity('error')
        setShowAlert(true)
      }
    } catch (error) {
      setAlertMessage('Network error. Please try again.')
      setAlertSeverity('error')
      setShowAlert(true)
      console.error('Profile update error:', error)
    }

    setCompleting(false)
  };




  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      {/* <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} /> */}
      {!otpForm && !profileCompleteForm &&
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          {/* <SitemarkIcon /> */}
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Jon Snow"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={emailError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
          
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={signingUp}
              sx={{
                backgroundColor: '#6B8E23',
                '&:hover': {
                  backgroundColor: '#5a7a1c',
                },
                '&:disabled': {
                  backgroundColor: '#ccc',
                  color: '#666'
                },
                fontSize: '1rem',
                fontWeight: 600,
                padding: '10px'
              }}
            >
              {signingUp ? 'Signing up...' : 'Sign up'}
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign up with Google')}
              startIcon={<GoogleIcon />}
            >
              Sign up with Google
            </Button>
           
            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Link
              onClick={
                ()=>{
                  navigate('/signin')
                }
              }
               
                variant="body2"
                sx={{ alignSelf: 'center',
                  cursor:'pointer'
                 }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>}

      {otpForm && !profileCompleteForm &&
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Verify Email
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            We've sent an OTP to {UserEmail}. Please enter it below.
          </Typography>
          <Box
            component="form"
            onSubmit={handleVerifyOtp}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="otp">Enter OTP</FormLabel>
              <TextField
                required
                fullWidth
                id="otp"
                placeholder="000000"
                name="otp"
                variant="outlined"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                error={otpError}
                helperText={otpErrorMessage}
                color={otpError ? 'error' : 'primary'}
                inputProps={{ maxLength: '6' }}
              />
            </FormControl>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={verifyingOtp}
              sx={{
                backgroundColor: '#6B8E23',
                '&:hover': {
                  backgroundColor: '#5a7a1c',
                },
                '&:disabled': {
                  backgroundColor: '#ccc',
                  color: '#666'
                },
                fontSize: '1rem',
                fontWeight: 600,
                padding: '10px'
              }}
            >
              {verifyingOtp ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </Box>
          <Typography sx={{ textAlign: 'center', mt: 2 }}>
            Didn't receive OTP?{' '}
            <Link
              onClick={() => {
                // TODO: Implement resend OTP functionality
                setAlertMessage('OTP resend not yet implemented');
                setAlertSeverity('info');
                setShowAlert(true);
              }}
              variant="body2"
              sx={{ cursor: 'pointer', fontWeight: 600 }}
            >
              Resend OTP
            </Link>
          </Typography>
        </Card>
      </SignUpContainer>}
      
      {profileCompleteForm &&
       <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(1rem, 5vw, 1.75rem)' }}
          >
          Complete Your Profile
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit2}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="title">Title</FormLabel>
              <TextField
                autoComplete="name"
                name="title"
                required
                fullWidth
                id="title"
                placeholder="The Solo Traveller"
                error={titleError}
                helperText={titleErrorMessage}
                color={titleError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="designation">Designation</FormLabel>
              <TextField
                required
                fullWidth
                id="designation"
                placeholder="Designer"
                name="designation"
                autoComplete="designation"
                variant="outlined"
                error={designationError}
                helperText={designationErrorMessage}
                color={designationError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="about">About</FormLabel>
              <TextField
                required
                fullWidth
                name="about"
                placeholder="I am a enthusiastic..."
                type="text"
                id="about"
                autoComplete="about"
                variant="outlined"
                error={aboutError}
                helperText={aboutErrorMessage}
                color={aboutError ? 'error' : 'primary'}
              />
            </FormControl>
           
         
             <Button
              type="button"
              fullWidth
              variant="outlined"
              onClick={() => {
                navigate('/signin')
              }}
              sx={{
                color: '#6B8E23',
                borderColor: '#6B8E23',
                '&:hover': {
                  backgroundColor: 'rgba(107, 142, 35, 0.1)',
                  borderColor: '#6B8E23',
                },
                fontSize: '1rem',
                fontWeight: 600,
                padding: '10px'
              }}
            >
              Skip
            </Button>
             <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={completing}
              sx={{
                backgroundColor: '#6B8E23',
                '&:hover': {
                  backgroundColor: '#5a7a1c',
                },
                '&:disabled': {
                  backgroundColor: '#ccc',
                  color: '#666'
                },
                fontSize: '1rem',
                fontWeight: 600,
                padding: '10px'
              }}
            >
              {completing ? "Completing..." : "Complete"}
            </Button>
         
           
          </Box>
         
          
        </Card>
      </SignUpContainer>}

      <Snackbar
        open={showAlert}
        autoHideDuration={5000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleAlertClose} severity={alertSeverity} variant="filled">
          {alertMessage}
        </Alert>
      </Snackbar>
    </AppTheme>
  );
}
