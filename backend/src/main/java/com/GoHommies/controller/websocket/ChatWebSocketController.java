package com.GoHommies.controller.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.GoHommies.dto.WebSocketChatMessageDto;
import com.GoHommies.service.chatservice.ChatService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Handles incoming messages from clients
     * Message mapping: /app/chat/send/{roomId}
     * Broadcast to: /topic/chat/room/{roomId}
     */
    @MessageMapping("/chat/send/{roomId}")
    @SendTo("/topic/chat/room/{roomId}")
    public WebSocketChatMessageDto sendMessage(
            @Payload WebSocketChatMessageDto message,
            SimpMessageHeaderAccessor headerAccessor,
            @org.springframework.messaging.handler.annotation.DestinationVariable Long roomId) {
        
        // The actual message persistence is handled by the REST endpoint
        // This just broadcasts to WebSocket subscribers
        return WebSocketChatMessageDto.builder()
                .roomId(roomId)
                .content(message.getContent())
                .senderName(message.getSenderName())
                .senderProfileUrl(message.getSenderProfileUrl())
                .sentTimestamp(System.currentTimeMillis())
                .build();
    }

    /**
     * User joins a chat room
     * Message mapping: /app/chat/join/{roomId}
     */
    @MessageMapping("/chat/join/{roomId}")
    public void joinRoom(
            SimpMessageHeaderAccessor headerAccessor,
            @org.springframework.messaging.handler.annotation.DestinationVariable Long roomId) {
        
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        String roomTopic = "/topic/chat/room/" + roomId;
        
        // Optionally send a system message that user joined
        WebSocketChatMessageDto joinMessage = WebSocketChatMessageDto.builder()
                .roomId(roomId)
                .senderName("System")
                .content(username + " joined the chat")
                .sentTimestamp(System.currentTimeMillis())
                .build();
        
        messagingTemplate.convertAndSend(roomTopic, joinMessage);
    }

    /**
     * User leaves a chat room
     * Message mapping: /app/chat/leave/{roomId}
     */
    @MessageMapping("/chat/leave/{roomId}")
    public void leaveRoom(
            SimpMessageHeaderAccessor headerAccessor,
            @org.springframework.messaging.handler.annotation.DestinationVariable Long roomId) {
        
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        String roomTopic = "/topic/chat/room/" + roomId;
        
        WebSocketChatMessageDto leaveMessage = WebSocketChatMessageDto.builder()
                .roomId(roomId)
                .senderName("System")
                .content(username + " left the chat")
                .sentTimestamp(System.currentTimeMillis())
                .build();
        
        messagingTemplate.convertAndSend(roomTopic, leaveMessage);
    }
}
