package com.GoHommies.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "recipient_id", nullable = false)
    private Traveller recipient;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private Traveller sender; // Optional - who triggered the notification

    @ManyToOne
    @JoinColumn(name = "trip_id")
    private Trip trip; // Optional - related trip

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(nullable = false)
    private Boolean isRead = false;

    private Long joinRequestId; // Reference to TripJoinRequest if applicable

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public enum NotificationType {
        JOIN_REQUEST_SENT,      // User A requests to join Trip X
        JOIN_REQUEST_APPROVED,  // Trip owner approves User A's request
        JOIN_REQUEST_REJECTED,  // Trip owner rejects User A's request
        TRIP_UPDATED,           // Trip details changed
        NEW_MEMBER_JOINED,      // New member approved to trip
        MEMBER_LEFT             // Member left the trip
    }
}
