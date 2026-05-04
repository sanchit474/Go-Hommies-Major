package com.GoHommies.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.GoHommies.entity.Hotel;
import com.GoHommies.entity.Provider;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByIsActiveTrueOrderByCreatedAtDesc();
    List<Hotel> findByProviderOrderByCreatedAtDesc(Provider provider);
    Optional<Hotel> findByIdAndProvider(Long id, Provider provider);
}
