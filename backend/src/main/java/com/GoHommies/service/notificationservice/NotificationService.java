package com.GoHommies.service.notificationservice;

import com.GoHommies.dto.NotificationDto;
import java.util.List;

public interface NotificationService {
    NotificationDto createNotification(Long recipientId, Long senderId, Long tripId, 
                                      com.GoHommies.entity.Notification.NotificationType type, 
                                      String message, Long joinRequestId);
    List<NotificationDto> getMyNotifications(String email);
    List<NotificationDto> getUnreadNotifications(String email);
    long getUnreadCount(String email);
    void markAsRead(Long notificationId, String email);
    void markAllAsRead(String email);
    void deleteNotification(Long notificationId, String email);
    void deleteAllNotifications(String email);
}
