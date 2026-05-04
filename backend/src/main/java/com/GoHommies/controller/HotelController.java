package com.GoHommies.controller;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.GoHommies.dto.CreateHotelBookingDto;
import com.GoHommies.dto.CreateHotelDto;
import com.GoHommies.dto.CreateHotelRatingDto;
import com.GoHommies.dto.HotelBookingResponseDto;
import com.GoHommies.dto.HotelRatingResponseDto;
import com.GoHommies.dto.HotelResponseDto;
import com.GoHommies.service.cloudinaryservice.CloudinaryService;
import com.GoHommies.service.hotelservice.HotelService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;
    private final CloudinaryService cloudinaryService;

    /**
     * Create hotel — accepts multipart/form-data with form fields + photo files
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('SERVICEPROVIDER')")
    public ResponseEntity<HotelResponseDto> createHotel(
            Principal principal,
            @RequestParam("name") String name,
            @RequestParam("location") String location,
            @RequestParam(value = "description", required = false, defaultValue = "") String description,
            @RequestParam("totalSeats") Integer totalSeats,
            @RequestParam("pricePerNight") String pricePerNight,
            @RequestParam(value = "isActive", required = false, defaultValue = "true") Boolean isActive,
            @RequestParam(value = "photos", required = false) List<MultipartFile> photos) {

        try {
            CreateHotelDto dto = new CreateHotelDto();
            dto.setName(name);
            dto.setLocation(location);
            dto.setDescription(description);
            dto.setTotalSeats(totalSeats);
            dto.setPricePerNight(new java.math.BigDecimal(pricePerNight));
            dto.setIsActive(isActive);

            List<String> photoUrls = uploadPhotos(photos);
            return ResponseEntity.ok(hotelService.createHotel(principal.getName(), dto, photoUrls));
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to create hotel: " + e.getMessage());
        }
    }

    /**
     * Update hotel — same approach
     */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('SERVICEPROVIDER')")
    public ResponseEntity<HotelResponseDto> updateHotel(
            Principal principal,
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("location") String location,
            @RequestParam(value = "description", required = false, defaultValue = "") String description,
            @RequestParam("totalSeats") Integer totalSeats,
            @RequestParam("pricePerNight") String pricePerNight,
            @RequestParam(value = "isActive", required = false, defaultValue = "true") Boolean isActive,
            @RequestParam(value = "photos", required = false) List<MultipartFile> photos) {

        try {
            CreateHotelDto dto = new CreateHotelDto();
            dto.setName(name);
            dto.setLocation(location);
            dto.setDescription(description);
            dto.setTotalSeats(totalSeats);
            dto.setPricePerNight(new java.math.BigDecimal(pricePerNight));
            dto.setIsActive(isActive);

            List<String> photoUrls = uploadPhotos(photos);
            return ResponseEntity.ok(hotelService.updateHotel(principal.getName(), id, dto, photoUrls));
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to update hotel: " + e.getMessage());
        }
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

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SERVICEPROVIDER')")
    public ResponseEntity<Void> deleteHotel(Principal principal, @PathVariable Long id) {
        hotelService.deleteHotel(principal.getName(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/book")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<HotelBookingResponseDto> bookHotel(
            Principal principal,
            @PathVariable Long id,
            @RequestBody CreateHotelBookingDto dto) {
        return ResponseEntity.ok(hotelService.createBooking(principal.getName(), id, dto));
    }

    @GetMapping("/bookings/my")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<HotelBookingResponseDto>> myBookings(Principal principal) {
        return ResponseEntity.ok(hotelService.getMyBookings(principal.getName()));
    }

    @PatchMapping("/bookings/{id}/cancel")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<HotelBookingResponseDto> cancelMyBooking(Principal principal, @PathVariable Long id) {
        return ResponseEntity.ok(hotelService.cancelBooking(principal.getName(), id));
    }

    @GetMapping("/{id}/bookings")
    @PreAuthorize("hasRole('SERVICEPROVIDER')")
    public ResponseEntity<List<HotelBookingResponseDto>> hotelBookings(Principal principal, @PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotelBookings(principal.getName(), id));
    }

    @PostMapping("/{id}/ratings")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<HotelRatingResponseDto> addRating(
            Principal principal,
            @PathVariable Long id,
            @RequestBody CreateHotelRatingDto dto) {
        return ResponseEntity.ok(hotelService.addRating(principal.getName(), id, dto));
    }

    @GetMapping("/{id}/ratings")
    public ResponseEntity<List<HotelRatingResponseDto>> getRatings(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotelRatings(id));
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private List<String> uploadPhotos(List<MultipartFile> photos) {
        List<String> urls = new ArrayList<>();
        if (photos == null || photos.isEmpty()) return urls;
        
        for (MultipartFile file : photos) {
            if (file != null && !file.isEmpty()) {
                try {
                    String url = cloudinaryService.uploadImage(file, "gohommies/hotels");
                    urls.add(url);
                } catch (IOException e) {
                    // Log the error but don't fail the entire request
                    System.err.println("Failed to upload photo: " + e.getMessage());
                    // Continue with other photos
                }
            }
        }
        return urls;
    }
}
