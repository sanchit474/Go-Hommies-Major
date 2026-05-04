package com.GoHommies.service.chatservice;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.GoHommies.dto.ChatMessageDto;
import com.GoHommies.dto.ChatRoomDto;
import com.GoHommies.dto.SendChatMessageDto;
import com.GoHommies.entity.ChatMessage;
import com.GoHommies.entity.ChatRoom;
import com.GoHommies.entity.Traveller;
import com.GoHommies.entity.Trip;
import com.GoHommies.entity.UserEntity;
import com.GoHommies.repository.ChatMessageRepository;
import com.GoHommies.repository.ChatRoomRepository;
import com.GoHommies.repository.TravellerRepository;
import com.GoHommies.repository.TripRepository;
import com.GoHommies.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final TravellerRepository travellerRepository;
    private final TripRepository tripRepository;

    @Override
    public ChatRoomDto getOrCreateDirectChat(String email, Long otherTravellerId) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        Traveller traveller = travellerRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Traveller not found"));

        Traveller otherTraveller = travellerRepository.findById(otherTravellerId)
                .orElseThrow(() -> new EntityNotFoundException("Other traveller not found"));

        if (traveller.getId().equals(otherTraveller.getId())) {
            throw new IllegalArgumentException("Cannot chat with yourself");
        }

        // Check if direct chat already exists (order independent)
        var existingChat = chatRoomRepository.findByUser1AndUser2AndChatType(traveller, otherTraveller, ChatRoom.ChatType.DIRECT);
        if (existingChat.isPresent()) {
            return mapToChatRoomDto(existingChat.get(), traveller);
        }

        existingChat = chatRoomRepository.findByUser1AndUser2AndChatType(otherTraveller, traveller, ChatRoom.ChatType.DIRECT);
        if (existingChat.isPresent()) {
            return mapToChatRoomDto(existingChat.get(), traveller);
        }

        // Create new direct chat room
        ChatRoom chatRoom = ChatRoom.builder()
                .chatType(ChatRoom.ChatType.DIRECT)
                .roomId("direct_" + UUID.randomUUID().toString())
                .user1(traveller)
                .user2(otherTraveller)
                .build();

        chatRoom = chatRoomRepository.save(chatRoom);
        return mapToChatRoomDto(chatRoom, traveller);
    }

    @Override
    public ChatRoomDto getOrCreateTripGroupChat(String email, Long tripId) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        Traveller traveller = travellerRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Traveller not found"));

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new EntityNotFoundException("Trip not found"));

        // Check if user is trip owner or member
        boolean isMember = trip.getTraveller().getId().equals(traveller.getId());
        if (!isMember) {
            // Check if approved member
            isMember = trip.getJoinRequests().stream()
                    .anyMatch(req -> req.getRequester().getId().equals(traveller.getId()) &&
                            req.getStatus() == com.GoHommies.entity.TripJoinRequest.RequestStatus.APPROVED);
        }

        if (!isMember) {
            throw new IllegalArgumentException("You are not a member of this trip");
        }

        var existingChat = chatRoomRepository.findByTripAndChatType(trip, ChatRoom.ChatType.TRIP_GROUP);
        if (existingChat.isPresent()) {
            return mapToChatRoomDto(existingChat.get(), traveller);
        }

        // Create new trip group chat
        ChatRoom chatRoom = ChatRoom.builder()
                .chatType(ChatRoom.ChatType.TRIP_GROUP)
                .roomId("trip_" + tripId + "_" + UUID.randomUUID().toString())
                .trip(trip)
                .roomName(trip.getDestination() + " - Group Chat")
                .build();

        chatRoom = chatRoomRepository.save(chatRoom);
        return mapToChatRoomDto(chatRoom, traveller);
    }

    @Override
    public List<ChatRoomDto> getMyChatRooms(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        Traveller traveller = travellerRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Traveller not found"));

        return chatRoomRepository.findByUser1OrUser2OrderByLastMessageTimeDesc(traveller, traveller)
                .stream()
                .map(room -> mapToChatRoomDto(room, traveller))
                .collect(Collectors.toList());
    }

    @Override
    public ChatRoomDto getChatRoom(Long chatRoomId, String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        
        Traveller traveller = travellerRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Traveller not found"));
        
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new EntityNotFoundException("Chat room not found"));

        // Verify access
        if (ChatRoom.ChatType.DIRECT.equals(chatRoom.getChatType())) {
            if (!chatRoom.getUser1().getId().equals(traveller.getId()) && 
                !chatRoom.getUser2().getId().equals(traveller.getId())) {
                throw new IllegalArgumentException("You don't have access to this chat room");
            }
        } else if (ChatRoom.ChatType.TRIP_GROUP.equals(chatRoom.getChatType())) {
            Trip trip = chatRoom.getTrip();
            boolean isMember = trip.getTraveller().getId().equals(traveller.getId()) ||
                    trip.getJoinRequests().stream()
                            .anyMatch(req -> req.getRequester().getId().equals(traveller.getId()) &&
                                    req.getStatus() == com.GoHommies.entity.TripJoinRequest.RequestStatus.APPROVED);
            if (!isMember) {
                throw new IllegalArgumentException("You are not a member of this trip");
            }
        }

        return mapToChatRoomDto(chatRoom, traveller);
    }

    @Override
    public ChatMessageDto sendMessage(Long chatRoomId, String email, SendChatMessageDto dto) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        
        Traveller traveller = travellerRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Traveller not found"));
        
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new EntityNotFoundException("Chat room not found"));

        ChatMessage message = ChatMessage.builder()
                .chatRoom(chatRoom)
                .sender(traveller)
                .content(dto.getContent())
                .isRead(false)
                .build();

        message = chatMessageRepository.save(message);
        chatRoom.setLastMessageTime(message.getSentAt());
        chatRoomRepository.save(chatRoom);

        return mapToMessageDto(message);
    }

    @Override
    public List<ChatMessageDto> getChatHistory(Long chatRoomId, String email, int page, int size) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        
        Traveller traveller = travellerRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Traveller not found"));
        
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new EntityNotFoundException("Chat room not found"));

        Pageable pageable = PageRequest.of(page, size);
        return chatMessageRepository.findByChatRoomOrderBySentAtDesc(chatRoom, pageable)
                .stream()
                .map(this::mapToMessageDto)
                .collect(Collectors.toList());
    }

    @Override
    public long getUnreadCount(Long chatRoomId, String email) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new EntityNotFoundException("Chat room not found"));
        
        return chatMessageRepository.countByChatRoomAndIsReadFalse(chatRoom);
    }

    @Override
    public void markAsRead(Long chatRoomId, String email) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new EntityNotFoundException("Chat room not found"));

        chatMessageRepository.findByChatRoomOrderBySentAtDesc(chatRoom)
                .forEach(message -> {
                    message.setIsRead(true);
                    chatMessageRepository.save(message);
                });
    }

    @Override
    public void markMessageAsRead(Long messageId, String email) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException("Message not found"));
        
        message.setIsRead(true);
        chatMessageRepository.save(message);
    }

    private ChatRoomDto mapToChatRoomDto(ChatRoom chatRoom, Traveller currentUser) {
        ChatRoomDto dto = ChatRoomDto.builder()
                .id(chatRoom.getId())
                .roomId(chatRoom.getRoomId())
                .chatType(chatRoom.getChatType())
                .createdAt(chatRoom.getCreatedAt())
                .lastMessageTime(chatRoom.getLastMessageTime())
                .build();

        if (ChatRoom.ChatType.DIRECT.equals(chatRoom.getChatType())) {
            Traveller other = chatRoom.getUser1().getId().equals(currentUser.getId()) ? 
                    chatRoom.getUser2() : chatRoom.getUser1();
            dto.setOtherUserName(other.getUser().getFullName());
            dto.setOtherUserProfileUrl(other.getProfileUrl());
            dto.setRoomName(other.getUser().getFullName());
        } else {
            Trip trip = chatRoom.getTrip();
            dto.setTripId(trip.getId());
            dto.setTripDestination(trip.getDestination());
            dto.setRoomName(chatRoom.getRoomName());
        }

        dto.setUnreadCount(chatMessageRepository.countByChatRoomAndIsReadFalse(chatRoom));
        
        // Get last message
        var lastMessage = chatMessageRepository.findByChatRoomOrderBySentAtDesc(chatRoom)
                .stream()
                .findFirst();
        if (lastMessage.isPresent()) {
            dto.setLastMessage(mapToMessageDto(lastMessage.get()));
        }

        return dto;
    }

    private ChatMessageDto mapToMessageDto(ChatMessage message) {
        return ChatMessageDto.builder()
                .id(message.getId())
                .chatRoomId(message.getChatRoom().getId())
                .senderName(message.getSender().getUser().getFullName())
                .senderEmail(message.getSender().getUser().getEmail())
                .senderProfileUrl(message.getSender().getProfileUrl())
                .content(message.getContent())
                .isRead(message.getIsRead())
                .sentAt(message.getSentAt())
                .build();
    }
}
