package com.GoHommies.service.chatservice;

import com.GoHommies.dto.ChatMessageDto;
import com.GoHommies.dto.ChatRoomDto;
import com.GoHommies.dto.SendChatMessageDto;
import java.util.List;

public interface ChatService {
    // Chat room management
    ChatRoomDto getOrCreateDirectChat(String email, Long otherTravellerId);
    ChatRoomDto getOrCreateTripGroupChat(String email, Long tripId);
    List<ChatRoomDto> getMyChatRooms(String email);
    ChatRoomDto getChatRoom(Long chatRoomId, String email);
    
    // Messaging
    ChatMessageDto sendMessage(Long chatRoomId, String email, SendChatMessageDto dto);
    List<ChatMessageDto> getChatHistory(Long chatRoomId, String email, int page, int size);
    long getUnreadCount(Long chatRoomId, String email);
    
    // Read status
    void markAsRead(Long chatRoomId, String email);
    void markMessageAsRead(Long messageId, String email);
}
