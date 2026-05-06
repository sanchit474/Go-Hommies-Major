package com.GoHommies.repository;

import com.GoHommies.entity.Trip;
import com.GoHommies.entity.TripComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripCommentRepository extends JpaRepository<TripComment, Long> {
    List<TripComment> findByTripOrderByCreatedAtDesc(Trip trip);
    long countByTrip(Trip trip);
}
