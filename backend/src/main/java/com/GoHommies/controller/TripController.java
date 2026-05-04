package com.GoHommies.controller;

import com.GoHommies.dto.*;
import com.GoHommies.service.cloudinaryservice.CloudinaryService;
import com.GoHommies.service.tripmemberservice.TripMemberService;
import com.GoHommies.service.tripservice.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;


@RestController
@RequestMapping("/trips")
@RequiredArgsConstructor
public class TripController {
    private final TripService tripService;
    private final TripMemberService tripMemberService;
    private final CloudinaryService cloudinaryService;

    /**
     * POST /api/trips
     * Create a new trip/travel plan with destination, dates, budget, description, and visibility.
     */
    @PostMapping
    public ResponseEntity<TripResponseDto> createTrip(
            @RequestBody CreateTripDto dto,
            Principal principal) {
        TripResponseDto trip = tripService.createTrip(principal.getName(), dto);
        return ResponseEntity.status(201).body(trip);
    }

    /**
     * POST /api/trips/create-post
     * Compatibility endpoint for frontend form-data based post creation.
     */
    @PostMapping(value = "/create-post", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TripResponseDto> createTripFromPostForm(
            @RequestParam String destination,
            @RequestParam(required = false, defaultValue = "0") String totalPersons,
            @RequestParam String travelDate,
            @RequestParam(name = "BudgetPerPerson") String budgetPerPerson,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile image,
            Principal principal) {

        if (destination == null || destination.isBlank()) {
            throw new IllegalArgumentException("Destination is required");
        }
        if (travelDate == null || travelDate.isBlank()) {
            throw new IllegalArgumentException("Date of travel is required");
        }
        if (budgetPerPerson == null || budgetPerPerson.isBlank()) {
            throw new IllegalArgumentException("Budget per person is required");
        }
        if (description == null || description.isBlank()) {
            throw new IllegalArgumentException("Description is required");
        }

        LocalDate startDate = LocalDate.parse(travelDate);
        BigDecimal budget = new BigDecimal(budgetPerPerson.replace(",", ""));
        Integer totalPersonsValue;
        try {
            totalPersonsValue = Integer.valueOf(totalPersons.trim());
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException("Total persons must be a valid number");
        }
        if (totalPersonsValue < 0) {
            throw new IllegalArgumentException("Total persons cannot be negative");
        }

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            try {
                imageUrl = cloudinaryService.uploadImage(image, "gohomies/trips");
            } catch (IOException ex) {
                // Keep trip creation resilient if image service is temporarily unavailable.
                imageUrl = null;
            }
        }

        CreateTripDto dto = CreateTripDto.builder()
                .destination(destination.trim())
                .startDate(startDate)
                .endDate(startDate)
                .budget(budget)
                .totalPersons(totalPersonsValue)
                .description(description.trim())
                .imageUrl(imageUrl)
                .isPublic(true)
                .build();

        TripResponseDto trip = tripService.createTrip(principal.getName(), dto);
        return ResponseEntity.status(201).body(trip);
    }

    /**
     * GET /api/trips
     * Get all trips for the authenticated user.
     */
    @GetMapping
    public ResponseEntity<List<TripResponseDto>> getMyTrips(Principal principal) {
        List<TripResponseDto> trips = tripService.getMyTrips(principal.getName());
        return ResponseEntity.ok(trips);
    }

    /**
     * GET /api/trips/{tripId}
     * Get trip details by ID.
     */
    @GetMapping("/{tripId}")
    public ResponseEntity<TripResponseDto> getTripById(@PathVariable Long tripId) {
        TripResponseDto trip = tripService.getTripById(tripId);
        return ResponseEntity.ok(trip);
    }

    /**
     * GET /api/trips/public
     * Get all public trips (for discovery).
     */
    @GetMapping("/public")
    public ResponseEntity<List<TripResponseDto>> getPublicTrips() {
        List<TripResponseDto> trips = tripService.getPublicTrips();
        return ResponseEntity.ok(trips);
    }

    /**
     * PUT /api/trips/{tripId}
     * Update trip details (destination, dates, budget, description, visibility).
     */
    @PutMapping("/{tripId}")
    public ResponseEntity<TripResponseDto> updateTrip(
            @PathVariable Long tripId,
            @RequestBody CreateTripDto dto,
            Principal principal) {
        TripResponseDto trip = tripService.updateTrip(tripId, principal.getName(), dto);
        return ResponseEntity.ok(trip);
    }

    /**
     * DELETE /api/trips/{tripId}
     * Delete a trip (only by owner).
     */
    @DeleteMapping("/{tripId}")
    public ResponseEntity<Void> deleteTrip(
            @PathVariable Long tripId,
            Principal principal) {
        tripService.deleteTrip(tripId, principal.getName());
        return ResponseEntity.noContent().build();
    }
    // ─────────────────────────────────────────────────────────
    // JOIN REQUEST ENDPOINTS (/api/trips/{tripId}/join-requests)
    // ─────────────────────────────────────────────────────────

    /**
     * POST /api/trips/{tripId}/request-join
     * Request to join a trip.
     */
    @PostMapping("/{tripId}/request-join")
    public ResponseEntity<JoinRequestDto> requestToJoin(
            @PathVariable Long tripId,
            @RequestBody CreateJoinRequestDto dto,
            Principal principal) {
        JoinRequestDto request = tripMemberService.requestToJoin(tripId, principal.getName(), dto);
        return ResponseEntity.status(201).body(request);
    }

    /**
     * GET /api/trips/{tripId}/join-requests/pending
     * Get pending join requests for a trip (owner only).
     */
    @GetMapping("/{tripId}/join-requests/pending")
    public ResponseEntity<List<JoinRequestDto>> getPendingRequests(
            @PathVariable Long tripId,
            Principal principal) {
        List<JoinRequestDto> requests = tripMemberService.getPendingRequests(tripId, principal.getName());
        return ResponseEntity.ok(requests);
    }

    /**
     * GET /api/trips/{tripId}/join-requests
     * Get all join requests for a trip (owner only).
     */
    @GetMapping("/{tripId}/join-requests")
    public ResponseEntity<List<JoinRequestDto>> getAllRequests(
            @PathVariable Long tripId,
            Principal principal) {
        List<JoinRequestDto> requests = tripMemberService.getAllRequests(tripId, principal.getName());
        return ResponseEntity.ok(requests);
    }

    /**
     * PUT /api/trips/{tripId}/join-requests/{requestId}/approve
     * Approve a join request (owner only).
     */
    @PutMapping("/{tripId}/join-requests/{requestId}/approve")
    public ResponseEntity<JoinRequestDto> approveJoinRequest(
            @PathVariable Long tripId,
            @PathVariable Long requestId,
            Principal principal) {
        JoinRequestDto request = tripMemberService.approveJoinRequest(tripId, requestId, principal.getName());
        return ResponseEntity.ok(request);
    }

    /**
     * PUT /api/trips/{tripId}/join-requests/{requestId}/reject
     * Reject a join request (owner only).
     */
    @PutMapping("/{tripId}/join-requests/{requestId}/reject")
    public ResponseEntity<JoinRequestDto> rejectJoinRequest(
            @PathVariable Long tripId,
            @PathVariable Long requestId,
            Principal principal) {
        JoinRequestDto request = tripMemberService.rejectJoinRequest(tripId, requestId, principal.getName());
        return ResponseEntity.ok(request);
    }

    /**
     * GET /api/trips/{tripId}/members
     * Get all members of a trip.
     */
    @GetMapping("/{tripId}/members")
    public ResponseEntity<List<TripMemberDto>> getTripMembers(@PathVariable Long tripId) {
        List<TripMemberDto> members = tripMemberService.getTripMembers(tripId);
        return ResponseEntity.ok(members);
    }

    /**
     * GET /api/trips/joined/my-trips
     * Get all trips the user has joined.
     */
    @GetMapping("/joined/my-trips")
    public ResponseEntity<List<JoinRequestDto>> getMyJoinedTrips(Principal principal) {
        List<JoinRequestDto> trips = tripMemberService.getMyApprovedJoins(principal.getName());
        return ResponseEntity.ok(trips);
    }

    /**
     * DELETE /api/trips/{tripId}/leave
     * Leave a trip.
     */
    @DeleteMapping("/{tripId}/leave")
    public ResponseEntity<Void> leaveTrip(
            @PathVariable Long tripId,
            Principal principal) {
        tripMemberService.leaveTrip(tripId, principal.getName());
        return ResponseEntity.noContent().build();
    }
}
