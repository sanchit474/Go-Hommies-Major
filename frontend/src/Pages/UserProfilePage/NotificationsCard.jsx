import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Badge,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";

const DisplayCard = styled(Card)(() => ({
  background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(247,250,252,0.92))",
  border: "1px solid rgba(15, 23, 42, 0.08)",
  borderRadius: 24,
  color: "#0f172a",
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
}));

const Label = styled(Typography)(() => ({
  color: "rgba(15, 23, 42, 0.58)",
  fontSize: "0.76rem",
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  fontWeight: 800,
}));

const MutedText = styled(Typography)(() => ({
  color: "rgba(15, 23, 42, 0.76)",
  lineHeight: 1.8,
  fontSize: "0.9rem",
}));

const NotificationItem = styled(Box)(() => ({
  padding: "12px",
  borderRadius: "12px",
  backgroundColor: "rgba(107, 142, 35, 0.08)",
  border: "1px solid rgba(107, 142, 35, 0.15)",
  "&:hover": {
    backgroundColor: "rgba(107, 142, 35, 0.12)",
  },
}));

const NotificationsCard = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "booking",
      message: "Your hotel booking in Kerala is confirmed",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
    },
    {
      id: 2,
      type: "trip",
      message: "New trip planner suggestions available",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: false,
    },
    {
      id: 3,
      type: "message",
      message: "You received a new message from Sarah",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleDismiss = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return timestamp.toLocaleDateString();
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "booking":
        return "#6B8E23";
      case "trip":
        return "#0EA5E9";
      case "message":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  return (
    <DisplayCard>
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack spacing={2}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon sx={{ color: "#0f172a", fontSize: 20 }} />
              </Badge>
              <Label sx={{ mb: 0 }}>Notifications</Label>
            </Box>
          </Box>

          {notifications.length === 0 ? (
            <MutedText>No notifications at this time.</MutedText>
          ) : (
            <Stack spacing={1.5}>
              {notifications.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  sx={{
                    opacity: notif.read ? 0.7 : 1,
                    borderColor: notif.read
                      ? "rgba(107, 142, 35, 0.1)"
                      : "rgba(107, 142, 35, 0.25)",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    gap={1}
                  >
                    <Stack spacing={0.75} flex={1}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: getTypeColor(notif.type),
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: notif.read ? 500 : 700,
                            color: "#0f172a",
                            fontSize: "0.85rem",
                          }}
                        >
                          {notif.message}
                        </Typography>
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(15, 23, 42, 0.56)",
                          fontSize: "0.75rem",
                          ml: 2.5,
                        }}
                      >
                        {getRelativeTime(notif.timestamp)}
                      </Typography>
                    </Stack>
                    <Tooltip title="Dismiss">
                      <IconButton
                        size="small"
                        onClick={() => handleDismiss(notif.id)}
                        sx={{
                          color: "rgba(15, 23, 42, 0.5)",
                          "&:hover": { color: "#0f172a" },
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </NotificationItem>
              ))}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </DisplayCard>
  );
};

export default NotificationsCard;
