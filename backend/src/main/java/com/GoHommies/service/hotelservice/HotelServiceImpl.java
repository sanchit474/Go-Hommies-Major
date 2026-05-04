package com.GoHommies.service.hotelservice;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.GoHommies.dto.CreateHotelBookingDto;
import com.GoHommies.dto.CreateHotelDto;
import com.GoHommies.dto.CreateHotelRatingDto;
import com.GoHommies.dto.HotelBookingResponseDto;
import com.GoHommies.dto.HotelRatingResponseDto;
import com.GoHommies.dto.HotelResponseDto;
import com.GoHommies.entity.Hotel;
import com.GoHommies.entity.HotelBooking;
import com.GoHommies.entity.HotelRating;
import com.GoHommies.entity.Provider;
import com.GoHommies.entity.UserEntity;
import com.GoHommies.repository.HotelBookingRepository;
import com.GoHommies.repository.HotelRatingRepository;
import com.GoHommies.repository.HotelRepository;
import com.GoHommies.repository.ProviderRepository;
import com.GoHommies.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HotelServiceImpl implements HotelService {

    private final HotelRepository hotelRepository;
    private final HotelBookingRepository hotelBookingRepository;
    private final HotelRatingRepository hotelRatingRepository;
    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;

    @Override
    public HotelResponseDto createHotel(String providerEmail, CreateHotelDto dto, List<String> roomPhotoUrls) {
        Provider provider = getProviderByEmail(providerEmail);
        validateHotelPayload(dto, false);

        Hotel hotel = new Hotel();
        hotel.setProvider(provider);
        hotel.setName(dto.getName().trim());
        hotel.setLocation(dto.getLocation().trim());
        hotel.setDescription(Optional.ofNullable(dto.getDescription()).orElse(""));
        hotel.setTotalSeats(dto.getTotalSeats());
        hotel.setAvailableSeats(dto.getTotalSeats());
        hotel.setPricePerNight(dto.getPricePerNight());
        hotel.setIsActive(dto.getIsActive() == null ? true : dto.getIsActive());
        if (roomPhotoUrls != null) hotel.setRoomPhotoUrls(roomPhotoUrls);

        return toHotelResponse(hotelRepository.save(hotel));
    }

    @Override
    public HotelResponseDto updateHotel(String providerEmail, Long hotelId, CreateHotelDto dto, List<String> roomPhotoUrls) {
        Provider provider = getProviderByEmail(providerEmail);
        Hotel hotel = hotelRepository.findByIdAndProvider(hotelId, provider)
                .orElseThrow(() -> new EntityNotFoundException("Hotel not found or unauthorized"));

        validateHotelPayload(dto, true);
        if (dto.getName() != null && !dto.getName().isBlank()) hotel.setName(dto.getName().trim());
        if (dto.getLocation() != null && !dto.getLocation().isBlank()) hotel.setLocation(dto.getLocation().trim());
        if (dto.getDescription() != null) hotel.setDescription(dto.getDescription());
        if (dto.getPricePerNight() != null) hotel.setPricePerNight(dto.getPricePerNight());
        if (dto.getTotalSeats() != null) {
            int booked = hotel.getTotalSeats() - hotel.getAvailableSeats();
            if (dto.getTotalSeats() < booked) throw new IllegalArgumentException("Total seats cannot be less than already booked seats");
            hotel.setTotalSeats(dto.getTotalSeats());
            hotel.setAvailableSeats(dto.getTotalSeats() - booked);
        }
        if (dto.getIsActive() != null) hotel.setIsActive(dto.getIsActive());
        if (roomPhotoUrls != null) hotel.setRoomPhotoUrls(roomPhotoUrls);

        return toHotelResponse(hotelRepository.save(hotel));
    }

    @Override
    public HotelResponseDto getHotelById(Long hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new EntityNotFoundException("Hotel not found: " + hotelId));
        return toHotelResponse(hotel);
    }

    @Override
    public List<HotelResponseDto> getPublicHotels() {
        return hotelRepository.findByIsActiveTrueOrderByCreatedAtDesc()
                .stream().map(this::toHotelResponse).collect(Collectors.toList());
    }

    @Override
    public java.util.List<HotelResponseDto> getMyHotels(String providerEmail) {
        Provider provider = getProviderByEmail(providerEmail);
        return hotelRepository.findByProviderOrderByCreatedAtDesc(provider).stream().map(this::toHotelResponse).collect(Collectors.toList());
    }

    @Override
    public HotelBookingResponseDto createBooking(String travellerEmail, Long hotelId, CreateHotelBookingDto dto) {
        UserEntity traveller = getUserByEmail(travellerEmail);
        Hotel hotel = hotelRepository.findById(hotelId).orElseThrow(() -> new EntityNotFoundException("Hotel not found: " + hotelId));
        if (!Boolean.TRUE.equals(hotel.getIsActive())) throw new IllegalArgumentException("This hotel is currently inactive");
        validateBookingPayload(dto);
        if (dto.getSeatsBooked() > hotel.getAvailableSeats()) throw new IllegalArgumentException("Only " + hotel.getAvailableSeats() + " seats are available right now");

        long nights = Math.max(1, ChronoUnit.DAYS.between(dto.getCheckInDate(), dto.getCheckOutDate()));
        BigDecimal totalAmount = hotel.getPricePerNight().multiply(BigDecimal.valueOf(nights)).multiply(BigDecimal.valueOf(dto.getSeatsBooked()));

        HotelBooking booking = new HotelBooking();
        booking.setHotel(hotel);
        booking.setBookedBy(traveller);
        booking.setSeatsBooked(dto.getSeatsBooked());
        booking.setCheckInDate(dto.getCheckInDate());
        booking.setCheckOutDate(dto.getCheckOutDate());
        booking.setTotalAmount(totalAmount);

        hotel.setAvailableSeats(hotel.getAvailableSeats() - dto.getSeatsBooked());
        hotelRepository.save(hotel);

        return toBookingResponse(hotelBookingRepository.save(booking));
    }

    @Override
    public java.util.List<HotelBookingResponseDto> getMyBookings(String travellerEmail) {
        UserEntity traveller = getUserByEmail(travellerEmail);
        return hotelBookingRepository.findByBookedByOrderByCreatedAtDesc(traveller).stream().map(this::toBookingResponse).collect(Collectors.toList());
    }

    @Override
    public java.util.List<HotelBookingResponseDto> getHotelBookings(String providerEmail, Long hotelId) {
        Provider provider = getProviderByEmail(providerEmail);
        Hotel hotel = hotelRepository.findByIdAndProvider(hotelId, provider).orElseThrow(() -> new EntityNotFoundException("Hotel not found or unauthorized"));
        return hotelBookingRepository.findByHotelOrderByCreatedAtDesc(hotel).stream().map(this::toBookingResponse).collect(Collectors.toList());
    }

    @Override
    public HotelBookingResponseDto cancelBooking(String travellerEmail, Long bookingId) {
        UserEntity traveller = getUserByEmail(travellerEmail);
        HotelBooking booking = hotelBookingRepository.findByIdAndBookedBy(bookingId, traveller).orElseThrow(() -> new EntityNotFoundException("Booking not found or unauthorized"));
        if (booking.getStatus() == HotelBooking.BookingStatus.CANCELLED) return toBookingResponse(booking);
        booking.setStatus(HotelBooking.BookingStatus.CANCELLED);
        Hotel hotel = booking.getHotel();
        hotel.setAvailableSeats(hotel.getAvailableSeats() + booking.getSeatsBooked());
        hotelRepository.save(hotel);
        return toBookingResponse(hotelBookingRepository.save(booking));
    }

    @Override
    public HotelRatingResponseDto addRating(String travellerEmail, Long hotelId, CreateHotelRatingDto dto) {
        UserEntity traveller = getUserByEmail(travellerEmail);
        Hotel hotel = hotelRepository.findById(hotelId).orElseThrow(() -> new EntityNotFoundException("Hotel not found: " + hotelId));
        if (dto == null || dto.getBookingId() == null) throw new IllegalArgumentException("Booking id is required to submit rating");
        if (dto.getRating() == null || dto.getRating() < 1 || dto.getRating() > 5) throw new IllegalArgumentException("Rating must be between 1 and 5");

        HotelBooking booking = hotelBookingRepository.findByIdAndBookedBy(dto.getBookingId(), traveller).orElseThrow(() -> new EntityNotFoundException("Booking not found or unauthorized"));
        if (!booking.getHotel().getId().equals(hotel.getId())) throw new IllegalArgumentException("Booking does not belong to the selected hotel");
        if (booking.getStatus() != HotelBooking.BookingStatus.CONFIRMED) throw new IllegalArgumentException("Only confirmed bookings can be rated");
        if (hotelRatingRepository.existsByBookingId(booking.getId())) throw new IllegalArgumentException("You have already rated this booking");

        HotelRating rating = new HotelRating();
        rating.setHotel(hotel);
        rating.setReviewer(traveller);
        rating.setBooking(booking);
        rating.setRating(dto.getRating());
        rating.setComment(dto.getComment() == null ? "" : dto.getComment());

        HotelRating saved = hotelRatingRepository.save(rating);
        refreshHotelRating(hotel);
        return toRatingResponse(saved);
    }

    @Override
    public java.util.List<HotelRatingResponseDto> getHotelRatings(Long hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId).orElseThrow(() -> new EntityNotFoundException("Hotel not found: " + hotelId));
        return hotelRatingRepository.findByHotelOrderByCreatedAtDesc(hotel).stream().map(this::toRatingResponse).collect(Collectors.toList());
    }

    private UserEntity getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("User not found: " + email));
    }

    private Provider getProviderByEmail(String email) {
        return providerRepository.findByUserEmail(email).orElseThrow(() -> new EntityNotFoundException("Provider not found for user: " + email));
    }

    private void validateHotelPayload(CreateHotelDto dto, boolean allowPartial) {
        if (dto == null) throw new IllegalArgumentException("Hotel payload is required");
        if (!allowPartial || dto.getName() != null) { if (dto.getName() == null || dto.getName().isBlank()) throw new IllegalArgumentException("Hotel name is required"); }
        if (!allowPartial || dto.getLocation() != null) { if (dto.getLocation() == null || dto.getLocation().isBlank()) throw new IllegalArgumentException("Hotel location is required"); }
        if (!allowPartial || dto.getTotalSeats() != null) { if (dto.getTotalSeats() == null || dto.getTotalSeats() <= 0) throw new IllegalArgumentException("Total seats must be greater than zero"); }
        if (!allowPartial || dto.getPricePerNight() != null) { if (dto.getPricePerNight() == null || dto.getPricePerNight().compareTo(BigDecimal.ZERO) <= 0) throw new IllegalArgumentException("Price per night must be greater than zero"); }
    }

    private void validateBookingPayload(CreateHotelBookingDto dto) {
        if (dto == null) throw new IllegalArgumentException("Booking payload is required");
        if (dto.getSeatsBooked() == null || dto.getSeatsBooked() <= 0) throw new IllegalArgumentException("Seats booked must be greater than zero");
        if (dto.getCheckInDate() == null || dto.getCheckOutDate() == null) throw new IllegalArgumentException("Check-in and check-out dates are required");
        if (!dto.getCheckOutDate().isAfter(dto.getCheckInDate())) throw new IllegalArgumentException("Check-out date must be after check-in date");
    }

    private void refreshHotelRating(Hotel hotel) {
        var ratings = hotelRatingRepository.findByHotelOrderByCreatedAtDesc(hotel);
        int total = ratings.size();
        double avg = total == 0 ? 0.0 : ratings.stream().mapToInt(HotelRating::getRating).average().orElse(0.0);
        hotel.setTotalRatings(total);
        hotel.setAvgRating(Math.round(avg * 10.0) / 10.0);
        hotelRepository.save(hotel);
    }

    private HotelResponseDto toHotelResponse(Hotel hotel) {
        return HotelResponseDto.builder()
                .id(hotel.getId())
                .name(hotel.getName())
                .location(hotel.getLocation())
                .description(hotel.getDescription())
                .totalSeats(hotel.getTotalSeats())
                .availableSeats(hotel.getAvailableSeats())
                .pricePerNight(hotel.getPricePerNight())
                .avgRating(hotel.getAvgRating())
                .totalRatings(hotel.getTotalRatings())
                .isActive(hotel.getIsActive())
                .roomPhotoUrls(hotel.getRoomPhotoUrls())
                .providerName(hotel.getProvider().getDisplayName() != null ? hotel.getProvider().getDisplayName() : hotel.getProvider().getUser().getFullName())
                .providerEmail(hotel.getProvider().getUser().getEmail())
                .createdAt(hotel.getCreatedAt())
                .updatedAt(hotel.getUpdatedAt())
                .build();
    }

    private HotelBookingResponseDto toBookingResponse(HotelBooking booking) {
        return HotelBookingResponseDto.builder()
                .id(booking.getId())
                .hotelId(booking.getHotel().getId())
                .hotelName(booking.getHotel().getName())
                .location(booking.getHotel().getLocation())
                .seatsBooked(booking.getSeatsBooked())
                .checkInDate(booking.getCheckInDate())
                .checkOutDate(booking.getCheckOutDate())
                .totalAmount(booking.getTotalAmount())
                .status(booking.getStatus().name())
                .travellerName(booking.getBookedBy().getFullName())
                .travellerEmail(booking.getBookedBy().getEmail())
                .createdAt(booking.getCreatedAt())
                .build();
    }

    private HotelRatingResponseDto toRatingResponse(HotelRating rating) {
        return HotelRatingResponseDto.builder()
                .id(rating.getId())
                .hotelId(rating.getHotel().getId())
                .bookingId(rating.getBooking() != null ? rating.getBooking().getId() : null)
                .rating(rating.getRating())
                .comment(rating.getComment())
                .reviewerName(rating.getReviewer().getFullName())
                .reviewerEmail(rating.getReviewer().getEmail())
                .createdAt(rating.getCreatedAt())
                .build();
    }
}
