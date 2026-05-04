package com.GoHommies.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.GoHommies.dto.CreateHotelBookingDto;
import com.GoHommies.dto.CreateHotelDto;
import com.GoHommies.dto.CreateHotelRatingDto;
import com.GoHommies.dto.HotelBookingResponseDto;
import com.GoHommies.dto.HotelRatingResponseDto;
import com.GoHommies.dto.HotelResponseDto;
import com.GoHommies.service.hotelservice.HotelService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    @PostMapping
    @PreAuthorize("hasRole('SERVICEPROVIDER')")
    public ResponseEntity<HotelResponseDto> createHotel(Principal principal, @RequestBody CreateHotelDto dto, @RequestParam(required = false) List<String> photos) {
        String email = principal.getName();
        return ResponseEntity.ok(hotelService.createHotel(email, dto, photos));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SERVICEPROVIDER')")
    public ResponseEntity<HotelResponseDto> updateHotel(Principal principal, @PathVariable Long id, @RequestBody CreateHotelDto dto, @RequestParam(required = false) List<String> photos) {
        String email = principal.getName();
        return ResponseEntity.ok(hotelService.updateHotel(email, id, dto, photos));
    }

    @GetMapping("/public")
    public ResponseEntity<List<HotelResponseDto>> publicHotels() {
        return ResponseEntity.ok(hotelService.getPublicHotels());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('SERVICEPROVIDER')")
    public ResponseEntity<List<HotelResponseDto>> myHotels(Principal principal) {
        return ResponseEntity.ok(hotelService.getMyHotels(principal.getName()));
    }

    @PostMapping("/{id}/book")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<HotelBookingResponseDto> bookHotel(Principal principal, @PathVariable Long id, @RequestBody CreateHotelBookingDto dto) {
        return ResponseEntity.ok(hotelService.createBooking(principal.getName(), id, dto));
    }

    @GetMapping("/bookings/my")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<HotelBookingResponseDto>> myBookings(Principal principal) {
        return ResponseEntity.ok(hotelService.getMyBookings(principal.getName()));
    }

    @GetMapping("/{id}/bookings")
    @PreAuthorize("hasRole('SERVICEPROVIDER')")
    public ResponseEntity<List<HotelBookingResponseDto>> hotelBookings(Principal principal, @PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotelBookings(principal.getName(), id));
    }

    @PostMapping("/{id}/ratings")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<HotelRatingResponseDto> addRating(Principal principal, @PathVariable Long id, @RequestBody CreateHotelRatingDto dto) {
        return ResponseEntity.ok(hotelService.addRating(principal.getName(), id, dto));
    }

    @GetMapping("/{id}/ratings")
    public ResponseEntity<List<HotelRatingResponseDto>> getRatings(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotelRatings(id));
    }
}
