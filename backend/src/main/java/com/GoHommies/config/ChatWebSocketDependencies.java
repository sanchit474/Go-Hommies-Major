package com.GoHommies.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.user.DefaultUserDestinationResolver;

/**
 * Dependencies required for Chat/WebSocket functionality:
 * 
 * Add to pom.xml:
 * 
 * <dependency>
 *     <groupId>org.springframework.boot</groupId>
 *     <artifactId>spring-boot-starter-websocket</artifactId>
 * </dependency>
 * 
 * <dependency>
 *     <groupId>org.springframework.boot</groupId>
 *     <artifactId>spring-boot-starter-webflux</artifactId>
 * </dependency>
 * 
 * The WebSocketConfig class is configured in this package.
 * 
 * WebSocket Endpoint: ws://localhost:8080/ws/chat
 * 
 * STOMP Protocol paths:
 * - Send message: /app/chat/send/{roomId}
 * - Subscribe to room: /topic/chat/room/{roomId}
 * - Join room: /app/chat/join/{roomId}
 * - Leave room: /app/chat/leave/{roomId}
 */
@Configuration
public class ChatWebSocketDependencies {
    // This is just a marker class documenting dependencies
}
