package com.GoHommies.dto;

import com.GoHommies.entity.Notification.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateNotificationDto {
    private Long recipientId;
    private Long senderId; // Optional
    private Long tripId; // Optional
    private NotificationType type;
    private String message;
    private Long joinRequestId; // Optional
}
