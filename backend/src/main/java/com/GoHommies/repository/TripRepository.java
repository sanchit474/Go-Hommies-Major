package com.GoHommies.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.GoHommies.entity.Traveller;
import com.GoHommies.entity.Trip;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long>, JpaSpecificationExecutor<Trip> {
    List<Trip> findByTravellerOrderByCreatedAtDesc(Traveller traveller);
    List<Trip> findByIsPublicTrueOrderByCreatedAtDesc();
    Optional<Trip> findByIdAndTraveller(Long id, Traveller traveller);
}
