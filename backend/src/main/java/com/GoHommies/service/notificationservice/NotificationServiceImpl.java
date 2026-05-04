package com.GoHommies.service.notificationservice;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.GoHommies.dto.NotificationDto;
import com.GoHommies.entity.Notification;
import com.GoHommies.entity.Traveller;
import com.GoHommies.entity.UserEntity;
import com.GoHommies.repository.NotificationRepository;
import com.GoHommies.repository.TravellerRepository;
import com.GoHommies.repository.TripRepository;
import com.GoHommies.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final TravellerRepository travellerRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    @Override
    public NotificationDto createNotification(Long recipientId, Long senderId, Long tripId,
            Notification.NotificationType type, String message, Long joinRequestId) {
        
        Traveller recipient = travellerRepository.findById(recipientId)
                .orElseThrow(() -> new EntityNotFoundException("Recipient not found"));

        Traveller sender = null;
        if (senderId != null) {
            sender = travellerRepository.findById(senderId)
                    .orElseThrow(() -> new EntityNotFoundException("Sender not found"));
        }

        var trip = tripRepository.findById(tripId).orElse(null);

        Notification notification = Notification.builder()
                .recipient(recipient)
                .sender(sender)
                .trip(trip)
                .type(type)
                .message(message)
                .joinRequestId(joinRequestId)
                .isRead(false)
                .build();

        notification = notificationRepository.save(notification);
        return mapToDto(notification);
    }

    @Override
    public List<NotificationDto> getMyNotifications(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        Traveller traveller = travellerRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Traveller profile not found"));

        return notificationRepository.findByRecipientOrderByCreatedAtDesc(traveller)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationDto> getUnreadNotifications(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        Traveller traveller = travellerRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Traveller profile not found"));

        return notificationRepository.findByRecipientAndIsReadFalseOrderByCreatedAtDesc(traveller)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public long getUnreadCount(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        Traveller traveller = travellerRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Traveller profile not found"));

        return notificationRepository.countByRecipientAndIsReadFalse(traveller);
    }

    @Override
    public void markAsRead(Long notificationId, String email) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found"));

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        Traveller traveller = travellerRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Traveller profile not found"));

        if (!notification.getRecipient().getId().equals(traveller.getId())) {
            throw new IllegalArgumentException("This notification does not belong to you");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        Traveller traveller = travellerRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Traveller profile not found"));

        notificationRepository.findByRecipientAndIsReadFalseOrderByCreatedAtDesc(traveller)
                .forEach(notification -> {
                    notification.setIsRead(true);
                    notificationRepository.save(notification);
                });
    }

    @Override
    public void deleteNotification(Long notificationId, String email) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found"));

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        Traveller traveller = travellerRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Traveller profile not found"));

        if (!notification.getRecipient().getId().equals(traveller.getId())) {
            throw new IllegalArgumentException("This notification does not belong to you");
        }

        notificationRepository.delete(notification);
    }

    @Override
    public void deleteAllNotifications(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        Traveller traveller = travellerRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Traveller profile not found"));

        notificationRepository.findByRecipientOrderByCreatedAtDesc(traveller)
                .forEach(notificationRepository::delete);
    }

    private NotificationDto mapToDto(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getId())
                .tripId(notification.getTrip() != null ? notification.getTrip().getId() : null)
                .senderName(notification.getSender() != null ? 
                        notification.getSender().getUser().getFullName() : "System")
                .senderProfileUrl(notification.getSender() != null ? 
                        notification.getSender().getProfileUrl() : null)
                .type(notification.getType())
                .message(notification.getMessage())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
