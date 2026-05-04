package com.GoHommies.service.tripmemberservice;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.GoHommies.dto.CreateJoinRequestDto;
import com.GoHommies.dto.JoinRequestDto;
import com.GoHommies.dto.TripMemberDto;
import com.GoHommies.entity.Traveller;
import com.GoHommies.entity.Trip;
import com.GoHommies.entity.TripJoinRequest;
import com.GoHommies.entity.UserEntity;
import com.GoHommies.repository.TravellerRepository;
import com.GoHommies.repository.TripJoinRequestRepository;
import com.GoHommies.repository.TripRepository;
import com.GoHommies.repository.UserRepository;

import com.GoHommies.service.notificationservice.NotificationTriggerService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TripMemberServiceImpl implements TripMemberService {

    private final TripRepository tripRepository;
    private final TripJoinRequestRepository joinRequestRepository;
    private final UserRepository userRepository;
    private final TravellerRepository travellerRepository;
    private final NotificationTriggerService notificationTriggerService;

    @Override
    public JoinRequestDto requestToJoin(Long tripId, String email, CreateJoinRequestDto dto) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new EntityNotFoundException("Trip not found: " + tripId));

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        Traveller requester = travellerRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Traveller profile not found for user: " + email + ". Please complete your profile first."));

        // Check if already a member or has pending request
        if (trip.getTraveller().getId().equals(requester.getId())) {
            throw new IllegalArgumentException("You cannot join your own trip");
        }

        var existingRequest = joinRequestRepository.findByTripAndRequester(trip, requester);
        if (existingRequest.isPresent()) {
            if (existingRequest.get().getStatus() == TripJoinRequest.RequestStatus.PENDING) {
                throw new IllegalArgumentException("You already have a pending request for this trip");
            }
            if (existingRequest.get().getStatus() == TripJoinRequest.RequestStatus.APPROVED) {
                throw new IllegalArgumentException("You are already a member of this trip");
            }
        }

        TripJoinRequest request = TripJoinRequest.builder()
                .trip(trip)
                .requester(requester)
                .message(dto.getMessage())
                .status(TripJoinRequest.RequestStatus.PENDING)
                .build();

        request = joinRequestRepository.save(request);
        
        // Verify trip owner exists
        Traveller tripOwner = trip.getTraveller();
        if (tripOwner == null) {
            throw new EntityNotFoundException("Trip owner not found");
        }

        String requesterName = requester.getUser() != null && requester.getUser().getFullName() != null 
            ? requester.getUser().getFullName() 
            : requester.getUser().getEmail();
        
        // Notify trip owner of join request
        notificationTriggerService.notifyJoinRequestSent(
                tripOwner.getId(),
                requester.getId(),
                tripId,
                requesterName,
                request.getId()
        );
        
        return mapToJoinRequestDto(request);
    }

    @Override
    public JoinRequestDto approveJoinRequest(Long tripId, Long requestId, String email) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new EntityNotFoundException("Trip not found: " + tripId));

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        Traveller owner = travellerRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Traveller profile not found"));

        // Verify ownership
        if (!trip.getTraveller().getId().equals(owner.getId())) {
            throw new IllegalArgumentException("You are not the owner of this trip");
        }

        TripJoinRequest request = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Join request not found: " + requestId));

        if (!request.getTrip().getId().equals(tripId)) {
            throw new IllegalArgumentException("Request does not belong to this trip");
        }

        if (request.getStatus() != TripJoinRequest.RequestStatus.PENDING) {
            throw new IllegalArgumentException("Request is not pending");
        }

        request.setStatus(TripJoinRequest.RequestStatus.APPROVED);
        request.setApprovedAt(LocalDateTime.now());
        request = joinRequestRepository.save(request);

        // Notify requester of approval
        notificationTriggerService.notifyJoinRequestApproved(
                request.getRequester().getId(),
                owner.getId(),
                tripId,
                trip.getDestination(),
                request.getId()
        );

        return mapToJoinRequestDto(request);
    }

    @Override
    public JoinRequestDto rejectJoinRequest(Long tripId, Long requestId, String email) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new EntityNotFoundException("Trip not found: " + tripId));

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        Traveller owner = travellerRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Traveller profile not found"));

        // Verify ownership
        if (!trip.getTraveller().getId().equals(owner.getId())) {
            throw new IllegalArgumentException("You are not the owner of this trip");
        }

        TripJoinRequest request = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Join request not found: " + requestId));

        if (!request.getTrip().getId().equals(tripId)) {
            throw new IllegalArgumentException("Request does not belong to this trip");
        }

        if (request.getStatus() != TripJoinRequest.RequestStatus.PENDING) {
            throw new IllegalArgumentException("Request is not pending");
        }

        request.setStatus(TripJoinRequest.RequestStatus.REJECTED);
        request.setRejectedAt(LocalDateTime.now());
        request = joinRequestRepository.save(request);

        // Notify requester of rejection
        notificationTriggerService.notifyJoinRequestRejected(
                request.getRequester().getId(),
                owner.getId(),
                tripId,
                trip.getDestination(),
                request.getId()
        );

        return mapToJoinRequestDto(request);
    }

    @Override
    public List<JoinRequestDto> getPendingRequests(Long tripId, String email) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new EntityNotFoundException("Trip not found: " + tripId));

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        Traveller owner = travellerRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Traveller profile not found"));

        // Verify ownership
        if (!trip.getTraveller().getId().equals(owner.getId())) {
            throw new IllegalArgumentException("You are not the owner of this trip");
        }

        return joinRequestRepository.findByTripAndStatusOrderByCreatedAtDesc(trip, TripJoinRequest.RequestStatus.PENDING)
                .stream()
                .map(this::mapToJoinRequestDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<JoinRequestDto> getAllRequests(Long tripId, String email) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new EntityNotFoundException("Trip not found: " + tripId));

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        Traveller owner = travellerRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Traveller profile not found"));

        // Verify ownership
        if (!trip.getTraveller().getId().equals(owner.getId())) {
            throw new IllegalArgumentException("You are not the owner of this trip");
        }

        return joinRequestRepository.findByTripOrderByCreatedAtDesc(trip)
                .stream()
                .map(this::mapToJoinRequestDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TripMemberDto> getTripMembers(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new EntityNotFoundException("Trip not found: " + tripId));

        // Get trip owner
        List<TripMemberDto> members = List.of(mapToTripMemberDto(trip.getTraveller()));

        // Get approved members
        var approvedMembers = joinRequestRepository.findByTripAndStatusOrderByCreatedAtDesc(
                trip, TripJoinRequest.RequestStatus.APPROVED)
                .stream()
                .map(req -> mapToTripMemberDto(req.getRequester()))
                .collect(Collectors.toList());

        var allMembers = new java.util.ArrayList<>(members);
        allMembers.addAll(approvedMembers);
        return allMembers;
    }

    @Override
    public List<JoinRequestDto> getMyApprovedJoins(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        Traveller traveller = travellerRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Traveller profile not found"));

        return joinRequestRepository.findByRequesterAndStatusOrderByCreatedAtDesc(
                traveller, TripJoinRequest.RequestStatus.APPROVED)
                .stream()
                .map(this::mapToJoinRequestDto)
                .collect(Collectors.toList());
    }

    @Override
    public void leaveTrip(Long tripId, String email) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new EntityNotFoundException("Trip not found: " + tripId));

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        Traveller traveller = travellerRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Traveller profile not found"));

        TripJoinRequest request = joinRequestRepository.findByTripAndRequester(trip, traveller)
                .orElseThrow(() -> new EntityNotFoundException("You are not a member of this trip"));

        if (request.getStatus() != TripJoinRequest.RequestStatus.APPROVED) {
            throw new IllegalArgumentException("You are not an approved member of this trip");
        }

        joinRequestRepository.delete(request);
        
        // Notify trip owner that member left
        notificationTriggerService.notifyMemberLeft(
                trip.getTraveller().getId(),
                traveller.getId(),
                tripId,
                traveller.getUser().getFullName(),
                trip.getDestination()
        );
    }

    @Override
    public boolean isTripMember(Long tripId, String email) {
        Trip trip = tripRepository.findById(tripId).orElse(null);
        if (trip == null) return false;

        UserEntity user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return false;

        Traveller traveller = travellerRepository.findByUser(user).orElse(null);
        if (traveller == null) return false;

        // Check if owner
        if (trip.getTraveller().getId().equals(traveller.getId())) {
            return true;
        }

        // Check if approved member
        var request = joinRequestRepository.findByTripAndRequester(trip, traveller);
        return request.isPresent() && request.get().getStatus() == TripJoinRequest.RequestStatus.APPROVED;
    }

    private JoinRequestDto mapToJoinRequestDto(TripJoinRequest request) {
        return JoinRequestDto.builder()
                .id(request.getId())
                .tripId(request.getTrip().getId())
                .requesterName(request.getRequester().getUser().getFullName())
                .requesterEmail(request.getRequester().getUser().getEmail())
                .requesterProfileUrl(request.getRequester().getProfileUrl())
                .message(request.getMessage())
                .status(request.getStatus())
                .createdAt(request.getCreatedAt())
                .approvedAt(request.getApprovedAt())
                .rejectedAt(request.getRejectedAt())
                .build();
    }

    private TripMemberDto mapToTripMemberDto(Traveller traveller) {
        return TripMemberDto.builder()
                .travellerId(traveller.getId())
                .name(traveller.getUser().getFullName())
                .email(traveller.getUser().getEmail())
                .profileUrl(traveller.getProfileUrl())
                .bio(traveller.getBio())
                .rating(traveller.getRating())
                .tripsCount(traveller.getTripsCount())
                .build();
    }
}
