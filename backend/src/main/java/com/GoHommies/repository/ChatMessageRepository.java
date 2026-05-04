package com.GoHommies.repository;

import com.GoHommies.entity.ChatMessage;
import com.GoHommies.entity.ChatRoom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByChatRoomOrderBySentAtDesc(ChatRoom chatRoom);
    Page<ChatMessage> findByChatRoomOrderBySentAtDesc(ChatRoom chatRoom, Pageable pageable);
    long countByChatRoomAndIsReadFalse(ChatRoom chatRoom);
}
