package com.GoHommies.service.tripservice;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.GoHommies.dto.CreateTripDto;
import com.GoHommies.dto.TripCommentDto;
import com.GoHommies.dto.TripResponseDto;
import com.GoHommies.entity.Traveller;
import com.GoHommies.entity.Trip;
import com.GoHommies.entity.TripComment;
import com.GoHommies.entity.UserEntity;
import com.GoHommies.repository.TravellerRepository;
import com.GoHommies.repository.TripCommentRepository;
import com.GoHommies.repository.TripRepository;
import com.GoHommies.repository.UserRepository;
import com.GoHommies.service.notificationservice.NotificationTriggerService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final TravellerRepository travellerRepository;
    private final TripCommentRepository tripCommentRepository;
    private final NotificationTriggerService notificationTriggerService;

    @Override
    public TripResponseDto createTrip(String email, CreateTripDto dto) {
        if (dto.getStartDate() != null && dto.getStartDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Trip date cannot be in the past");
        }
        if (dto.getStartDate() != null && dto.getEndDate() != null) {
            if (dto.getStartDate().isAfter(dto.getEndDate())) {
                throw new IllegalArgumentException("Start date must be before end date");
            }
        }

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        Traveller traveller = travellerRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Traveller profile not found"));

        Trip trip = Trip.builder()
                .traveller(traveller)
                .destination(dto.getDestination())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .budget(dto.getBudget())
                .totalPersons(dto.getTotalPersons())
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl())
                .isPublic(Boolean.TRUE.equals(dto.getIsPublic()))
                .build();

        trip = tripRepository.save(trip);
        return mapToDto(trip);
    }

    @Override
    public TripResponseDto getTripById(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new EntityNotFoundException("Trip not found: " + tripId));
        return mapToDto(trip);
    }

    @Override
    public List<TripResponseDto> getMyTrips(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        Traveller traveller = travellerRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Traveller profile not found"));
        return tripRepository.findByTravellerOrderByCreatedAtDesc(traveller)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<TripResponseDto> getPublicTrips() {
        return tripRepository.findByIsPublicTrueOrderByCreatedAtDesc()
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public TripResponseDto updateTrip(Long tripId, String email, CreateTripDto dto) {
        if (dto.getStartDate() != null && dto.getEndDate() != null) {
            if (dto.getStartDate().isAfter(dto.getEndDate())) {
                throw new IllegalArgumentException("Start date must be before end date");
            }
        }
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        Traveller traveller = travellerRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Traveller profile not found"));
        Trip trip = tripRepository.findByIdAndTraveller(tripId, traveller)
                .orElseThrow(() -> new EntityNotFoundException("Trip not found or unauthorized"));

        if (dto.getDestination() != null) trip.setDestination(dto.getDestination());
        if (dto.getStartDate() != null) trip.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) trip.setEndDate(dto.getEndDate());
        if (dto.getBudget() != null) trip.setBudget(dto.getBudget());
        if (dto.getTotalPersons() != null) trip.setTotalPersons(dto.getTotalPersons());
        if (dto.getDescription() != null) trip.setDescription(dto.getDescription());
        if (dto.getImageUrl() != null) trip.setImageUrl(dto.getImageUrl());
        if (dto.getIsPublic() != null) trip.setIsPublic(dto.getIsPublic());

        trip = tripRepository.save(trip);
        return mapToDto(trip);
    }

    @Override
    public void deleteTrip(Long tripId, String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        Traveller traveller = travellerRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Traveller profile not found"));
        Trip trip = tripRepository.findByIdAndTraveller(tripId, traveller)
                .orElseThrow(() -> new EntityNotFoundException("Trip not found or unauthorized"));
        tripRepository.delete(trip);
    }

    // ── Like / Unlike ──────────────────────────────────────

    @Override
    public TripResponseDto likeTrip(Long tripId, String email) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new EntityNotFoundException("Trip not found: " + tripId));

        if (!trip.getLikedByEmails().contains(email)) {
            trip.getLikedByEmails().add(email);
            trip.setLikeCount(trip.getLikedByEmails().size());
            final Trip savedTrip = tripRepository.save(trip);

            // Notify trip owner (don't notify if owner likes their own post)
            Traveller tripOwner = savedTrip.getTraveller();
            if (!tripOwner.getUser().getEmail().equals(email)) {
                UserEntity liker = userRepository.findByEmail(email).orElse(null);
                String likerName = liker != null ? liker.getFullName() : email;
                if (liker != null) {
                    travellerRepository.findByUser(liker).ifPresent(likerTraveller ->
                        notificationTriggerService.notifyPostLiked(
                            tripOwner.getId(),
                            likerTraveller.getId(),
                            savedTrip.getId(),
                            likerName,
                            savedTrip.getDestination()
                        )
                    );
                }
            }
            return mapToDto(savedTrip);
        }
        return mapToDto(trip);
    }

    @Override
    public TripResponseDto unlikeTrip(Long tripId, String email) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new EntityNotFoundException("Trip not found: " + tripId));

        trip.getLikedByEmails().remove(email);
        trip.setLikeCount(trip.getLikedByEmails().size());
        trip = tripRepository.save(trip);
        return mapToDto(trip);
    }

    // ── Comment ────────────────────────────────────────────

    @Override
    public TripCommentDto addComment(Long tripId, String email, String text) {
        if (text == null || text.isBlank()) {
            throw new IllegalArgumentException("Comment text cannot be empty");
        }
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new EntityNotFoundException("Trip not found: " + tripId));
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        Traveller traveller = travellerRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Traveller profile not found"));

        TripComment comment = TripComment.builder()
                .trip(trip)
                .author(traveller)
                .text(text.trim())
                .build();
        comment = tripCommentRepository.save(comment);

        // Notify trip owner (don't notify if owner comments on own post)
        Traveller tripOwner = trip.getTraveller();
        if (!tripOwner.getUser().getEmail().equals(email)) {
            notificationTriggerService.notifyPostCommented(
                tripOwner.getId(),
                traveller.getId(),
                tripId,
                user.getFullName(),
                trip.getDestination(),
                text
            );
        }

        return mapCommentToDto(comment);
    }

    @Override
    public List<TripCommentDto> getComments(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new EntityNotFoundException("Trip not found: " + tripId));
        return tripCommentRepository.findByTripOrderByCreatedAtDesc(trip)
                .stream().map(this::mapCommentToDto).collect(Collectors.toList());
    }

    // ── Helpers ────────────────────────────────────────────

    private TripResponseDto mapToDto(Trip trip) {
        List<TripCommentDto> commentDtos = trip.getComments() == null ? List.of() :
            trip.getComments().stream().map(this::mapCommentToDto).collect(Collectors.toList());

        return TripResponseDto.builder()
                .id(trip.getId())
                .destination(trip.getDestination())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .budget(trip.getBudget())
                .totalPersons(trip.getTotalPersons())
                .description(trip.getDescription())
                .imageUrl(trip.getImageUrl())
                .isPublic(trip.getIsPublic())
                .createdBy(trip.getTraveller().getUser().getFullName())
                .creatorEmail(trip.getTraveller().getUser().getEmail())
                .creatorProfileUrl(trip.getTraveller().getProfileUrl())
                .createdAt(trip.getCreatedAt())
                .updatedAt(trip.getUpdatedAt())
                .likeCount(trip.getLikeCount() != null ? trip.getLikeCount() : 0)
                .likedByEmails(trip.getLikedByEmails() != null ? trip.getLikedByEmails() : List.of())
                .commentCount((long) commentDtos.size())
                .comments(commentDtos)
                .build();
    }

    private TripCommentDto mapCommentToDto(TripComment c) {
        return TripCommentDto.builder()
                .id(c.getId())
                .authorName(c.getAuthor().getUser().getFullName())
                .authorEmail(c.getAuthor().getUser().getEmail())
                .authorProfileUrl(c.getAuthor().getProfileUrl())
                .text(c.getText())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
