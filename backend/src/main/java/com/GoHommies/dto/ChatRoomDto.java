package com.GoHommies.dto;

import com.GoHommies.entity.ChatRoom.ChatType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatRoomDto {
    private Long id;
    private String roomId;
    private ChatType chatType;
    private String roomName;
    private String otherUserName; // For direct chats
    private String otherUserProfileUrl;
    private Long tripId; // For trip group chats
    private String tripDestination;
    private ChatMessageDto lastMessage;
    private Long unreadCount;
    private LocalDateTime lastMessageTime;
    private LocalDateTime createdAt;
}
