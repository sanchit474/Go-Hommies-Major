package com.GoHommies.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.GoHommies.entity.Hotel;
import com.GoHommies.entity.HotelRating;

public interface HotelRatingRepository extends JpaRepository<HotelRating, Long> {
    List<HotelRating> findByHotelOrderByCreatedAtDesc(Hotel hotel);
    boolean existsByBookingId(Long bookingId);
}
