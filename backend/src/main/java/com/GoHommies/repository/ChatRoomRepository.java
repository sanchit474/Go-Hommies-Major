package com.GoHommies.repository;

import com.GoHommies.entity.ChatRoom;
import com.GoHommies.entity.Traveller;
import com.GoHommies.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findByRoomId(String roomId);
    
    // Direct chat queries
    Optional<ChatRoom> findByUser1AndUser2AndChatType(Traveller user1, Traveller user2, ChatRoom.ChatType chatType);
    List<ChatRoom> findByUser1OrUser2OrderByLastMessageTimeDesc(Traveller user1, Traveller user2);
    
    // Trip group chat queries
    Optional<ChatRoom> findByTripAndChatType(Trip trip, ChatRoom.ChatType chatType);
    List<ChatRoom> findByTripOrderByLastMessageTimeDesc(Trip trip);
}
