package com.GoHommies.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "chat_room")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChatType chatType; // DIRECT or TRIP_GROUP

    @Column(nullable = false, unique = true)
    private String roomId; // Unique identifier for WebSocket room

    @Column(length = 255)
    private String roomName; // For group chats

    // For DIRECT chats
    @ManyToOne
    @JoinColumn(name = "user1_id")
    private Traveller user1;

    @ManyToOne
    @JoinColumn(name = "user2_id")
    private Traveller user2;

    // For TRIP_GROUP chats
    @ManyToOne
    @JoinColumn(name = "trip_id")
    private Trip trip;

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ChatMessage> messages;

    private LocalDateTime lastMessageTime;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum ChatType {
        DIRECT,      // One-to-one chat
        TRIP_GROUP   // Trip group chat
    }
}
