package com.GoHommies.repository;

import com.GoHommies.entity.Trip;
import com.GoHommies.entity.TripJoinRequest;
import com.GoHommies.entity.Traveller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripJoinRequestRepository extends JpaRepository<TripJoinRequest, Long> {
    List<TripJoinRequest> findByTripOrderByCreatedAtDesc(Trip trip);
    List<TripJoinRequest> findByTripAndStatusOrderByCreatedAtDesc(Trip trip, TripJoinRequest.RequestStatus status);
    List<TripJoinRequest> findByRequesterOrderByCreatedAtDesc(Traveller requester);
    Optional<TripJoinRequest> findByTripAndRequester(Trip trip, Traveller requester);
    List<TripJoinRequest> findByRequesterAndStatusOrderByCreatedAtDesc(Traveller requester, TripJoinRequest.RequestStatus status);
}
