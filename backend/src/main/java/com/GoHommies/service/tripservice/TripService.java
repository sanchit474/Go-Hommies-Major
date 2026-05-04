package com.GoHommies.service.tripservice;

import com.GoHommies.dto.CreateTripDto;
import com.GoHommies.dto.TripResponseDto;
import java.util.List;

public interface TripService {
    TripResponseDto createTrip(String email, CreateTripDto dto);
    TripResponseDto getTripById(Long tripId);
    List<TripResponseDto> getMyTrips(String email);
    List<TripResponseDto> getPublicTrips();
    TripResponseDto updateTrip(Long tripId, String email, CreateTripDto dto);
    void deleteTrip(Long tripId, String email);
}
