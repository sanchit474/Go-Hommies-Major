package com.GoHommies.repository;

import com.GoHommies.entity.Notification;
import com.GoHommies.entity.Traveller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientOrderByCreatedAtDesc(Traveller recipient);
    List<Notification> findByRecipientAndIsReadFalseOrderByCreatedAtDesc(Traveller recipient);
    List<Notification> findByRecipientAndIsReadTrueOrderByCreatedAtDesc(Traveller recipient);
    long countByRecipientAndIsReadFalse(Traveller recipient);
}
