package com.GoHommies.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.GoHommies.entity.Hotel;
import com.GoHommies.entity.HotelBooking;
import com.GoHommies.entity.UserEntity;

public interface HotelBookingRepository extends JpaRepository<HotelBooking, Long> {
    List<HotelBooking> findByBookedByOrderByCreatedAtDesc(UserEntity user);
    List<HotelBooking> findByHotelOrderByCreatedAtDesc(Hotel hotel);
    Optional<HotelBooking> findByIdAndBookedBy(Long id, UserEntity user);
}
