import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import HomeIcon from '@mui/icons-material/Home';
import FlightIcon from '@mui/icons-material/Flight';
import HotelIcon from '@mui/icons-material/Hotel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AddIcon from '@mui/icons-material/Add';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import InfoIcon from '@mui/icons-material/Info';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import BookingIcon from '@mui/icons-material/EventNote';
import LogoutIcon from '@mui/icons-material/Logout';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../Store/UserDataSlice';
import Cookies from 'js-cookie';
import NotificationBell from '../Components/Notifications/NotificationBell';

/* ─── GoHomies Logo ─────────────────────────────────────── */
const GoHomiesLogo = ({ size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="19" stroke="url(#lgRing)" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.5"/>
    <path d="M20 8L33 20H29V32H23V25H17V32H11V20H7L20 8Z" fill="url(#lgHouse)"/>
    <rect x="17.5" y="25" width="5" height="7" rx="2.5" fill="white" opacity="0.95"/>
    <rect x="12" y="21" width="4" height="4" rx="1" fill="white" opacity="0.75"/>
    <rect x="24" y="21" width="4" height="4" rx="1" fill="white" opacity="0.75"/>
    <rect x="25" y="10.5" width="2.5" height="5" rx="0.5" fill="url(#lgChimney)"/>
    <circle cx="26.2" cy="9" r="1" fill="#a78bfa" opacity="0.5"/>
    <defs>
      <linearGradient id="lgHouse" x1="7" y1="8" x2="33" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4ade80"/>
        <stop offset="1" stopColor="#2563eb"/>
      </linearGradient>
      <linearGradient id="lgChimney" x1="25" y1="10" x2="28" y2="15" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a78bfa"/>
        <stop offset="1" stopColor="#6366f1"/>
      </linearGradient>
      <linearGradient id="lgRing" x1="1" y1="1" x2="39" y2="39" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4ade80"/>
        <stop offset="1" stopColor="#2563eb"/>
      </linearGradient>
    </defs>
  </svg>
);

/* ─── Styled Toolbar ─────────────────────────────────────── */
const StyledToolbar = styled(Toolbar)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: '16px',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.85)',
  backgroundColor: 'rgba(255,255,255,0.82)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.9) inset',
  padding: '8px 16px !important',
  height: '64px',
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,0.9) inset',
  },
}));

/* ─── Shared styles ──────────────────────────────────────── */
const NAV_BTN = {
  color: '#374151',
  fontWeight: 500,
  fontSize: '0.82rem',
  textTransform: 'none',
  px: 1.4,
  py: 0.8,
  borderRadius: '10px',
  fontFamily: "'DM Sans', sans-serif",
  letterSpacing: '0.01em',
  minWidth: 0,
  gap: 0.5,
  transition: 'all 0.2s',
  '& .MuiButton-startIcon': { marginRight: '4px', '& svg': { fontSize: '15px !important' } },
  '&:hover': {
    color: '#16a34a',
    backgroundColor: 'rgba(22,163,74,0.08)',
    transform: 'translateY(-1px)',
  },
};

const PRIMARY_BTN = {
  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
  color: 'white',
  fontWeight: 600,
  fontSize: '0.84rem',
  textTransform: 'none',
  borderRadius: '10px',
  px: 2.2,
  py: 0.9,
  fontFamily: "'DM Sans', sans-serif",
  boxShadow: '0 2px 12px rgba(34,197,94,0.28)',
  transition: 'all 0.25s',
  '&:hover': {
    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
    boxShadow: '0 6px 20px rgba(34,197,94,0.4)',
    transform: 'translateY(-1px)',
  },
  '&:active': { transform: 'translateY(0)' },
};

const OUTLINE_BTN = {
  color: '#16a34a',
  fontWeight: 600,
  fontSize: '0.84rem',
  textTransform: 'none',
  borderRadius: '10px',
  px: 2,
  py: 0.85,
  fontFamily: "'DM Sans', sans-serif",
  border: '1.5px solid rgba(22,163,74,0.45)',
  transition: 'all 0.25s',
  '&:hover': {
    border: '1.5px solid #16a34a',
    backgroundColor: 'rgba(22,163,74,0.06)',
    transform: 'translateY(-1px)',
  },
};

const USER_BTN = {
  color: '#374151',
  fontWeight: 600,
  fontSize: '0.82rem',
  textTransform: 'none',
  borderRadius: '10px',
  px: 1.5,
  py: 0.8,
  fontFamily: "'DM Sans', sans-serif",
  border: '1.5px solid rgba(0,0,0,0.1)',
  backgroundColor: 'rgba(0,0,0,0.03)',
  gap: 0.8,
  transition: 'all 0.2s',
  '& .MuiButton-startIcon': { marginRight: '2px' },
  '&:hover': {
    backgroundColor: 'rgba(22,163,74,0.07)',
    borderColor: 'rgba(22,163,74,0.35)',
    color: '#16a34a',
  },
};

const LOGOUT_BTN = {
  color: '#dc2626',
  fontWeight: 600,
  fontSize: '0.82rem',
  textTransform: 'none',
  borderRadius: '10px',
  px: 1.5,
  py: 0.8,
  fontFamily: "'DM Sans', sans-serif",
  border: '1.5px solid rgba(220,38,38,0.2)',
  backgroundColor: 'rgba(220,38,38,0.04)',
  gap: 0.5,
  transition: 'all 0.2s',
  '& .MuiButton-startIcon': { marginRight: '2px', '& svg': { fontSize: '15px !important' } },
  '&:hover': {
    backgroundColor: 'rgba(220,38,38,0.09)',
    borderColor: 'rgba(220,38,38,0.4)',
    transform: 'translateY(-1px)',
  },
};

/* ─── Avatar initials chip ───────────────────────────────── */
const AvatarChip = ({ name }) => {
  const initial = (name?.[0] || 'U').toUpperCase();
  return (
    <Box sx={{
      width: 26, height: 26, borderRadius: '50%',
      background: 'linear-gradient(135deg, #4ade80, #2563eb)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '11px', fontWeight: 700, color: '#fff', flexShrink: 0,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {initial}
    </Box>
  );
};

/* ─── Nav links config ───────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Home',    path: '/',           icon: <HomeIcon /> },
  { label: 'Flights', path: '/flights',    icon: <FlightIcon /> },
  { label: 'Hotels',  path: '/hotels',     icon: <HotelIcon /> },
  { label: 'Cars',    path: '/cars',       icon: <DirectionsCarIcon /> },
  { label: 'Trip Planner', path: '/trip-planner', icon: <TravelExploreIcon /> },
  { label: 'Find',    path: '/createpost',  icon: <AddIcon /> },
  { label: 'Community',   path: '/posts',      icon: <VideoLibraryIcon /> },
];

/* ─── Drawer section label ───────────────────────────────── */
const DrawerLabel = ({ children }) => (
  <Box sx={{ px: 2, pt: 2, pb: 0.5, fontSize: '10px', fontWeight: 700,
    letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af',
    fontFamily: "'DM Sans', sans-serif" }}>
    {children}
  </Box>
);

/* ─── Component ──────────────────────────────────────────── */
export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const [moreAnchorEl, setMoreAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.UserData || {});

  const Logout = () => {
    Cookies.remove('uid');
    dispatch(setUserData({ name: '', email: '', username: '', designation: '', about: '', title: '', isAuthenticated: false }));
    navigate('/');
  };

  const go = (path) => { navigate(path); setOpen(false); };
  const openMoreMenu = (event) => setMoreAnchorEl(event.currentTarget);
  const closeMoreMenu = () => setMoreAnchorEl(null);
  const handleMoreNavigate = (path) => {
    navigate(path);
    closeMoreMenu();
  };

  const firstName = userData?.name?.split(' ')[0] || 'User';

  return (
    <>
      {/* DM Sans font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      <AppBar position="fixed" enableColorOnDark sx={{
        boxShadow: 0, bgcolor: 'transparent', backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 10px)',
      }}>
        <Container maxWidth="xl">
          <StyledToolbar variant="dense" disableGutters>

            {/* ── Left: Logo + Nav ── */}
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 0 }}>

              {/* Logo */}
              <Box onClick={() => navigate('/')} sx={{
                display: 'flex', alignItems: 'center', gap: 1.2,
                cursor: 'pointer', mr: 3, flexShrink: 0,
                transition: 'opacity 0.2s', '&:hover': { opacity: 0.8 },
              }}>
                <GoHomiesLogo size={34} />
                <Box sx={{
                  display: { xs: 'none', sm: 'block' },
                  fontWeight: 700, fontSize: '1.05rem',
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #16a34a, #1d4ed8)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  GoHomies
                </Box>
              </Box>

              {/* Desktop nav links */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.2, alignItems: 'center' }}>
                {NAV_LINKS.map((link) => (
                  <Button key={link.path} variant="text" startIcon={link.icon}
                    sx={NAV_BTN} onClick={() => navigate(link.path)}>
                    {link.label}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* ── Right: Auth ── */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center', flexShrink: 0 }}>
              {!userData?.isAuthenticated ? (
                <>
                  <Button variant="text" sx={{ ...NAV_BTN, px: 1.8 }} onClick={() => navigate('/signin')}>
                    Sign in
                  </Button>
                  <Button variant="contained" disableElevation sx={PRIMARY_BTN} onClick={() => navigate('/signup')}>
                    Sign up
                  </Button>
                </>
              ) : (
                <>
                  <NotificationBell />
                  <Button variant="outlined" sx={USER_BTN} onClick={() => navigate('/userprofile')}
                    startIcon={<AvatarChip name={userData?.name} />}>
                    {firstName}
                  </Button>
                  <IconButton
                    onClick={openMoreMenu}
                    sx={{
                      borderRadius: '10px',
                      border: '1.5px solid rgba(0,0,0,0.12)',
                      backgroundColor: 'rgba(0,0,0,0.03)',
                      color: '#374151',
                      '&:hover': { backgroundColor: 'rgba(22,163,74,0.08)', color: '#16a34a' },
                    }}
                  >
                    <MoreVertIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                  <Menu
                    anchorEl={moreAnchorEl}
                    open={Boolean(moreAnchorEl)}
                    onClose={closeMoreMenu}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={() => handleMoreNavigate('/about_us')}>
                      <InfoIcon sx={{ fontSize: 17, mr: 1 }} /> About
                    </MenuItem>
                    <MenuItem onClick={() => handleMoreNavigate('/contact_us')}>
                      <ContactSupportIcon sx={{ fontSize: 17, mr: 1 }} /> Contact
                    </MenuItem>
                    <MenuItem onClick={() => handleMoreNavigate('/booking')}>
                      <BookingIcon sx={{ fontSize: 17, mr: 1 }} /> Bookings
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => { closeMoreMenu(); Logout(); }} sx={{ color: '#dc2626' }}>
                      <LogoutIcon sx={{ fontSize: 17, mr: 1 }} /> Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>

            {/* ── Mobile hamburger ── */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton onClick={() => setOpen(true)} sx={{
                borderRadius: '10px', border: '1.5px solid rgba(0,0,0,0.1)',
                backgroundColor: 'rgba(0,0,0,0.03)', p: 0.8,
                '&:hover': { backgroundColor: 'rgba(22,163,74,0.08)' },
              }}>
                <MenuIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>

          </StyledToolbar>
        </Container>
      </AppBar>

      {/* ─── Mobile Drawer ─────────────────────────────────── */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}
        PaperProps={{ sx: {
          width: 280,
          background: '#ffffff',
          borderLeft: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
        }}}>

        {/* Drawer header */}
        <Box sx={{ px: 2.5, py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <GoHomiesLogo size={28} />
            <Box sx={{ fontWeight: 700, fontSize: '1rem', fontFamily: "'DM Sans', sans-serif",
              background: 'linear-gradient(135deg, #16a34a, #1d4ed8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              GoHomies
            </Box>
          </Box>
          <IconButton onClick={() => setOpen(false)} size="small" sx={{
            borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
          }}>
            <CloseRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Nav links */}
        <DrawerLabel>Navigate</DrawerLabel>
        <Box sx={{ px: 1.5, py: 1 }}>
          {NAV_LINKS.map((link) => (
            <MenuItem key={link.path} onClick={() => go(link.path)} sx={{
              borderRadius: '10px', py: 1.2, px: 1.5, gap: 1.5, mb: 0.3,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: '#374151',
              '& svg': { fontSize: '18px', color: '#16a34a' },
              '&:hover': { backgroundColor: 'rgba(22,163,74,0.07)', color: '#16a34a' },
            }}>
              {link.icon} {link.label}
            </MenuItem>
          ))}
        </Box>

        <Divider sx={{ mx: 2, my: 1.5, borderColor: 'rgba(0,0,0,0.07)' }} />

        {/* Auth section */}
        <DrawerLabel>Account</DrawerLabel>
        <Box sx={{ px: 2, py: 1.5, display: 'flex', flexDirection: 'column', gap: 1.2 }}>
          {!userData?.isAuthenticated ? (
            <>
              <Button fullWidth disableElevation sx={{ ...PRIMARY_BTN, py: 1.1 }}
                onClick={() => go('/signup')}>
                Sign up
              </Button>
              <Button fullWidth variant="outlined" sx={{ ...OUTLINE_BTN, py: 1.1 }}
                onClick={() => go('/signin')}>
                Sign in
              </Button>
            </>
          ) : (
            <>
              <Button fullWidth variant="outlined" sx={{ ...USER_BTN, justifyContent: 'flex-start', py: 1.1 }}
                startIcon={<AvatarChip name={userData?.name} />}
                onClick={() => go('/userprofile')}>
                {firstName}'s Profile
              </Button>
              <Button fullWidth variant="outlined" startIcon={<BookingIcon sx={{ fontSize: '16px !important' }} />}
                sx={{ ...NAV_BTN, border: '1.5px solid rgba(0,0,0,0.1)', justifyContent: 'flex-start',
                  py: 1.1, '&:hover': { color: '#16a34a', borderColor: 'rgba(22,163,74,0.35)', backgroundColor: 'rgba(22,163,74,0.06)' } }}
                onClick={() => go('/booking')}>
                My Bookings
              </Button>
              <Button fullWidth variant="outlined" startIcon={<LogoutIcon sx={{ fontSize: '16px !important' }} />}
                sx={{ ...LOGOUT_BTN, justifyContent: 'flex-start', py: 1.1 }}
                onClick={() => { Logout(); setOpen(false); }}>
                Logout
              </Button>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
}