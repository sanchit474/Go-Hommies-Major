import * as React from 'react';
import {
  Badge, Box, CircularProgress, Divider, IconButton,
  Popover, Tooltip, Typography,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import GroupIcon from '@mui/icons-material/Group';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import {
  GetMyNotifications,
  MarkNotificationRead,
  MarkAllNotificationsRead,
  DeleteNotification,
  ApproveJoinRequest,
  RejectJoinRequest,
} from '../../../ApiCall';

/* ── Icon + colour per notification type ─────────────────── */
const TYPE_META = {
  JOIN_REQUEST_SENT:     { icon: <PersonAddIcon sx={{ fontSize: 18 }} />,          color: '#3b82f6', bg: '#eff6ff' },
  JOIN_REQUEST_APPROVED: { icon: <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />, color: '#16a34a', bg: '#f0fdf4' },
  JOIN_REQUEST_REJECTED: { icon: <CancelOutlinedIcon sx={{ fontSize: 18 }} />,     color: '#dc2626', bg: '#fef2f2' },
  TRIP_UPDATED:          { icon: <EditIcon sx={{ fontSize: 18 }} />,               color: '#f59e0b', bg: '#fffbeb' },
  NEW_MEMBER_JOINED:     { icon: <GroupIcon sx={{ fontSize: 18 }} />,              color: '#8b5cf6', bg: '#f5f3ff' },
  MEMBER_LEFT:           { icon: <ExitToAppIcon sx={{ fontSize: 18 }} />,          color: '#6b7280', bg: '#f9fafb' },
  POST_LIKED:            { icon: <FavoriteIcon sx={{ fontSize: 18 }} />,           color: '#ec4899', bg: '#fdf2f8' },
  POST_COMMENTED:        { icon: <ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />,  color: '#0ea5e9', bg: '#f0f9ff' },
};

const getMeta = (type) =>
  TYPE_META[type] || { icon: <NotificationsIcon sx={{ fontSize: 18 }} />, color: '#6b7280', bg: '#f9fafb' };

/* ── Time formatter ──────────────────────────────────────── */
const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7)  return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

/* ── Component ───────────────────────────────────────────── */
export default function NotificationBell() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [markingAll, setMarkingAll] = React.useState(false);
  // Track per-notification action state: { [notifId]: 'accepting' | 'rejecting' | 'accepted' | 'rejected' }
  const [actionState, setActionState] = React.useState({});
  const pollRef = React.useRef(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotifications = React.useCallback(async () => {
    const res = await GetMyNotifications();
    if (res?.status === 200 && Array.isArray(res.data)) {
      setNotifications(res.data);
    }
  }, []);

  React.useEffect(() => {
    fetchNotifications();
    pollRef.current = setInterval(fetchNotifications, 30000);
    return () => clearInterval(pollRef.current);
  }, [fetchNotifications]);

  const open = Boolean(anchorEl);

  const handleOpen = async (e) => {
    setAnchorEl(e.currentTarget);
    setLoading(true);
    await fetchNotifications();
    setLoading(false);
  };

  const handleClose = () => setAnchorEl(null);

  const handleMarkRead = async (id) => {
    await MarkNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    await MarkAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setMarkingAll(false);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    await DeleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClick = (n) => {
    // Don't navigate on join-request notifications — user should use the buttons
    if (n.type === 'JOIN_REQUEST_SENT') return;
    if (!n.isRead) handleMarkRead(n.id);
    if (n.tripId) navigate(`/posts/${n.tripId}`);
    handleClose();
  };

  /* ── Accept join request ── */
  const handleAccept = async (e, n) => {
    e.stopPropagation();
    if (!n.tripId || !n.joinRequestId) return;
    setActionState((prev) => ({ ...prev, [n.id]: 'accepting' }));
    const res = await ApproveJoinRequest(n.tripId, n.joinRequestId);
    if (res?.status === 200) {
      setActionState((prev) => ({ ...prev, [n.id]: 'accepted' }));
      // Mark notification as read and update message
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === n.id
            ? { ...notif, isRead: true, message: `✓ You accepted ${n.senderName}'s request.` }
            : notif
        )
      );
      await MarkNotificationRead(n.id);
    } else {
      setActionState((prev) => ({ ...prev, [n.id]: undefined }));
    }
  };

  /* ── Reject join request ── */
  const handleReject = async (e, n) => {
    e.stopPropagation();
    if (!n.tripId || !n.joinRequestId) return;
    setActionState((prev) => ({ ...prev, [n.id]: 'rejecting' }));
    const res = await RejectJoinRequest(n.tripId, n.joinRequestId);
    if (res?.status === 200) {
      setActionState((prev) => ({ ...prev, [n.id]: 'rejected' }));
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === n.id
            ? { ...notif, isRead: true, message: `✗ You declined ${n.senderName}'s request.` }
            : notif
        )
      );
      await MarkNotificationRead(n.id);
    } else {
      setActionState((prev) => ({ ...prev, [n.id]: undefined }));
    }
  };

  return (
    <>
      <Tooltip title='Notifications'>
        <IconButton
          onClick={handleOpen}
          size='small'
          sx={{
            borderRadius: '10px',
            border: '1.5px solid rgba(0,0,0,0.12)',
            backgroundColor: 'rgba(0,0,0,0.03)',
            color: '#374151',
            width: 38,
            height: 38,
            '&:hover': { backgroundColor: 'rgba(22,163,74,0.08)', color: '#16a34a' },
          }}
        >
          <Badge
            badgeContent={unreadCount > 0 ? unreadCount : null}
            max={99}
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: '#ef4444',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 700,
                minWidth: 16,
                height: 16,
                padding: '0 4px',
              },
            }}
          >
            <NotificationsIcon sx={{ fontSize: 20 }} />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 560,
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            border: '1px solid rgba(0,0,0,0.08)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* ── Header ── */}
        <Box sx={{
          px: 2.5, py: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          background: '#fff',
          position: 'sticky', top: 0, zIndex: 1,
        }}>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', fontFamily: "'DM Sans', sans-serif" }}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Typography sx={{ fontSize: '0.72rem', color: '#6b7280', fontFamily: "'DM Sans', sans-serif" }}>
                {unreadCount} unread
              </Typography>
            )}
          </Box>
          {unreadCount > 0 && (
            <Tooltip title='Mark all as read'>
              <IconButton
                size='small'
                onClick={handleMarkAllRead}
                disabled={markingAll}
                sx={{ color: '#16a34a', '&:hover': { backgroundColor: 'rgba(22,163,74,0.08)' } }}
              >
                {markingAll ? <CircularProgress size={16} color='inherit' /> : <DoneAllIcon sx={{ fontSize: 18 }} />}
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* ── Body ── */}
        <Box sx={{ overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress size={28} sx={{ color: '#16a34a' }} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, px: 3 }}>
              <NotificationsIcon sx={{ fontSize: 44, color: '#d1d5db', mb: 1.5 }} />
              <Typography sx={{ color: '#9ca3af', fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif" }}>
                No notifications yet
              </Typography>
              <Typography sx={{ color: '#d1d5db', fontSize: '0.78rem', mt: 0.5, fontFamily: "'DM Sans', sans-serif" }}>
                You'll see likes, comments, and trip updates here
              </Typography>
            </Box>
          ) : (
            notifications.map((n, idx) => {
              const meta = getMeta(n.type);
              const isJoinRequest = n.type === 'JOIN_REQUEST_SENT';
              const aState = actionState[n.id];
              const alreadyActed = aState === 'accepted' || aState === 'rejected';

              return (
                <React.Fragment key={n.id}>
                  <Box
                    onClick={() => handleClick(n)}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      px: 2.5,
                      py: 1.75,
                      cursor: isJoinRequest && !alreadyActed ? 'default' : 'pointer',
                      backgroundColor: n.isRead ? '#fff' : 'rgba(22,163,74,0.04)',
                      borderLeft: n.isRead ? '3px solid transparent' : '3px solid #16a34a',
                      transition: 'background 0.15s',
                      '&:hover': { backgroundColor: isJoinRequest && !alreadyActed ? 'rgba(22,163,74,0.04)' : 'rgba(0,0,0,0.03)' },
                    }}
                  >
                    {/* Avatar / type icon */}
                    <Box sx={{
                      width: 40, height: 40, borderRadius: '50%',
                      backgroundColor: meta.bg,
                      color: meta.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, mt: 0.25, fontWeight: 700, fontSize: '1rem',
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      {n.senderProfileUrl ? (
                        <img
                          src={n.senderProfileUrl}
                          alt={n.senderName}
                          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : n.senderName ? (
                        n.senderName.charAt(0).toUpperCase()
                      ) : (
                        meta.icon
                      )}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      {n.senderName && (
                        <Typography sx={{
                          fontSize: '0.83rem', fontWeight: 700, color: '#0f172a',
                          fontFamily: "'DM Sans', sans-serif", lineHeight: 1.3,
                        }}>
                          {n.senderName}
                        </Typography>
                      )}
                      <Typography sx={{
                        fontSize: '0.8rem', color: '#374151',
                        fontFamily: "'DM Sans', sans-serif", lineHeight: 1.45,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {n.message}
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mt: 0.4, fontFamily: "'DM Sans', sans-serif" }}>
                        {timeAgo(n.createdAt)}
                      </Typography>

                      {/* ── Accept / Reject buttons for JOIN_REQUEST_SENT ── */}
                      {isJoinRequest && !alreadyActed && (
                        <Box sx={{ display: 'flex', gap: 1, mt: 1.25 }} onClick={(e) => e.stopPropagation()}>
                          <Box
                            component='button'
                            onClick={(e) => handleAccept(e, n)}
                            disabled={aState === 'accepting' || aState === 'rejecting'}
                            sx={{
                              display: 'flex', alignItems: 'center', gap: 0.5,
                              px: 1.5, py: 0.6,
                              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                              color: '#fff',
                              border: 'none', borderRadius: '8px',
                              fontSize: '0.75rem', fontWeight: 700,
                              fontFamily: "'DM Sans', sans-serif",
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              '&:hover': { background: 'linear-gradient(135deg, #16a34a, #15803d)', transform: 'translateY(-1px)' },
                              '&:disabled': { opacity: 0.6, cursor: 'not-allowed' },
                            }}
                          >
                            {aState === 'accepting' ? (
                              <CircularProgress size={12} sx={{ color: '#fff' }} />
                            ) : (
                              <CheckIcon sx={{ fontSize: 14 }} />
                            )}
                            Accept
                          </Box>

                          <Box
                            component='button'
                            onClick={(e) => handleReject(e, n)}
                            disabled={aState === 'accepting' || aState === 'rejecting'}
                            sx={{
                              display: 'flex', alignItems: 'center', gap: 0.5,
                              px: 1.5, py: 0.6,
                              background: '#fff',
                              color: '#dc2626',
                              border: '1.5px solid rgba(220,38,38,0.35)',
                              borderRadius: '8px',
                              fontSize: '0.75rem', fontWeight: 700,
                              fontFamily: "'DM Sans', sans-serif",
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              '&:hover': { backgroundColor: '#fef2f2', borderColor: '#dc2626', transform: 'translateY(-1px)' },
                              '&:disabled': { opacity: 0.6, cursor: 'not-allowed' },
                            }}
                          >
                            {aState === 'rejecting' ? (
                              <CircularProgress size={12} sx={{ color: '#dc2626' }} />
                            ) : (
                              <CloseIcon sx={{ fontSize: 14 }} />
                            )}
                            Decline
                          </Box>
                        </Box>
                      )}

                      {/* ── Acted state badge ── */}
                      {isJoinRequest && alreadyActed && (
                        <Box sx={{
                          display: 'inline-flex', alignItems: 'center', gap: 0.5,
                          mt: 1, px: 1.5, py: 0.4,
                          borderRadius: '6px',
                          backgroundColor: aState === 'accepted' ? '#f0fdf4' : '#fef2f2',
                          color: aState === 'accepted' ? '#16a34a' : '#dc2626',
                          fontSize: '0.72rem', fontWeight: 700,
                          fontFamily: "'DM Sans', sans-serif",
                        }}>
                          {aState === 'accepted' ? <CheckIcon sx={{ fontSize: 12 }} /> : <CloseIcon sx={{ fontSize: 12 }} />}
                          {aState === 'accepted' ? 'Accepted' : 'Declined'}
                        </Box>
                      )}
                    </Box>

                    {/* Unread dot + delete */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                      {!n.isRead && (
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#16a34a', mt: 0.5 }} />
                      )}
                      <IconButton
                        size='small'
                        onClick={(e) => handleDelete(e, n.id)}
                        sx={{
                          opacity: 0, transition: 'opacity 0.15s', p: 0.3,
                          color: '#9ca3af', '&:hover': { color: '#ef4444' },
                          '.MuiBox-root:hover &': { opacity: 1 },
                        }}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 15 }} />
                      </IconButton>
                    </Box>
                  </Box>

                  {idx < notifications.length - 1 && (
                    <Divider sx={{ mx: 2.5, borderColor: 'rgba(0,0,0,0.05)' }} />
                  )}
                </React.Fragment>
              );
            })
          )}
        </Box>
      </Popover>
    </>
  );
}
