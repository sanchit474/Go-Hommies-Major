package com.GoHommies.service.hotelservice;

import java.util.List;

import com.GoHommies.dto.CreateHotelBookingDto;
import com.GoHommies.dto.CreateHotelDto;
import com.GoHommies.dto.CreateHotelRatingDto;
import com.GoHommies.dto.HotelBookingResponseDto;
import com.GoHommies.dto.HotelRatingResponseDto;
import com.GoHommies.dto.HotelResponseDto;

public interface HotelService {
    HotelResponseDto createHotel(String providerEmail, CreateHotelDto dto, java.util.List<String> photoUrls);
    HotelResponseDto updateHotel(String providerEmail, Long hotelId, CreateHotelDto dto, java.util.List<String> photoUrls);
    HotelResponseDto getHotelById(Long hotelId);
    List<HotelResponseDto> getPublicHotels();
    List<HotelResponseDto> getMyHotels(String providerEmail);

    HotelBookingResponseDto createBooking(String travellerEmail, Long hotelId, CreateHotelBookingDto dto);
    java.util.List<HotelBookingResponseDto> getMyBookings(String travellerEmail);
    java.util.List<HotelBookingResponseDto> getHotelBookings(String providerEmail, Long hotelId);
    HotelBookingResponseDto cancelBooking(String travellerEmail, Long bookingId);

    HotelRatingResponseDto addRating(String travellerEmail, Long hotelId, CreateHotelRatingDto dto);
    java.util.List<HotelRatingResponseDto> getHotelRatings(Long hotelId);
}
