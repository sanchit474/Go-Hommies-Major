package com.GoHommies.controller;

import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

// import com.GoHommies.dto.CreateJoinRequestDto;
// import com.GoHommies.dto.CreateTripDto;
// import com.GoHommies.dto.JoinRequestDto;
import com.GoHommies.dto.NotificationDto;
import com.GoHommies.dto.ChatRoomDto;
import com.GoHommies.dto.ChatMessageDto;
import com.GoHommies.dto.SendChatMessageDto;
import com.GoHommies.dto.TravellerProfileDto;
import com.GoHommies.dto.TravellerSearchCriteria;
import com.GoHommies.dto.TravellerSearchResultDto;
// import com.GoHommies.dto.TripMemberDto;
// import com.GoHommies.dto.TripResponseDto;
import com.GoHommies.dto.TripSearchCriteria;
import com.GoHommies.dto.TripSearchResultDto;
import com.GoHommies.service.chatservice.ChatService;
import com.GoHommies.service.notificationservice.NotificationService;
import com.GoHommies.service.searchservice.SearchService;
import com.GoHommies.service.travellerservice.TravellerService;
// import com.GoHommies.service.tripmemberservice.TripMemberService;
// import com.GoHommies.service.tripservice.TripService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/traveller")
@RequiredArgsConstructor
public class UserController {

    private final TravellerService travellerService;
//    private final TripService tripService;
//    private final TripMemberService tripMemberService;
    private final SearchService searchService;
    private final NotificationService notificationService;
    private final ChatService chatService;
    /**
     * GET /traveller/profile
     * Returns name, email, phone, address, gender, birthday for the authenticated traveller    .
     */
    @GetMapping("/profile")
    public ResponseEntity<TravellerProfileDto> getProfile(Principal principal) {
        TravellerProfileDto profile = travellerService.getProfile(principal.getName());
        return ResponseEntity.ok(profile);
    }
    /**
     * PUT /traveller/profile
     * Updates phone, address, gender, birthday (and name) for the authenticated traveller   .
     * Email is never updated.
     */
    @PutMapping("/profile")
    public ResponseEntity<TravellerProfileDto> updateProfile(
            Principal principal,
            @RequestBody TravellerProfileDto dto) {
        TravellerProfileDto updated = travellerService.updateProfile(principal.getName(), dto);
        return ResponseEntity.ok(updated);
    }
    // ─────────────────────────────────────────────────────────
   /* 
     * POST /traveller/profile/image
     * Uploads a profile photo to Cloudinary and saves the URL on the traveller record.
     */
    @PostMapping("/profile/image")
    public ResponseEntity<Map<String, String>> uploadProfileImage(
            @RequestParam("file") MultipartFile file,
            Principal principal) {
        String url = travellerService.uploadProfileImage(principal.getName(), file);
        return ResponseEntity.ok(Map.of("imageUrl", url));
    }

    // ─────────────────────────────────────────────────────────
    // TRIP ENDPOINTS (/traveller/trips)
    // ─────────────────────────────────────────────────────────

    /**
     * POST /traveller/trips
     * Create a new trip/travel plan with destination, dates, budget, description, and visibility.
     */
//    @PostMapping("/trips")
//    public ResponseEntity<TripResponseDto> createTrip(
//            @RequestBody CreateTripDto dto,
//            Principal principal) {
//        TripResponseDto trip = tripService.createTrip(principal.getName(), dto);
//        return ResponseEntity.status(201).body(trip);
//    }
//
//    /**
//     * GET /traveller/trips
//     * Get all trips for the authenticated user.
//     */
//    @GetMapping("/trips")
//    public ResponseEntity<List<TripResponseDto>> getMyTrips(Principal principal) {
//        List<TripResponseDto> trips = tripService.getMyTrips(principal.getName());
//        return ResponseEntity.ok(trips);
//    }
//
//    /**
//     * GET /traveller/trips/{tripId}
//     * Get trip details by ID.
//     */
//    @GetMapping("/trips/{tripId}")
//    public ResponseEntity<TripResponseDto> getTripById(@PathVariable Long tripId) {
//        TripResponseDto trip = tripService.getTripById(tripId);
//        return ResponseEntity.ok(trip);
//    }
//
//    /**
//     * GET /trips/public
//     * Get all public trips (for discovery).
//     */
//    @GetMapping("/trips/public")
//    public ResponseEntity<List<TripResponseDto>> getPublicTrips() {
//        List<TripResponseDto> trips = tripService.getPublicTrips();
//        return ResponseEntity.ok(trips);
//    }
//
//    /**
//     * PUT /patient/trips/{tripId}
//     * Update trip details (destination, dates, budget, description, visibility).
//     */
//    @PutMapping("/trips/{tripId}")
//    public ResponseEntity<TripResponseDto> updateTrip(
//            @PathVariable Long tripId,
//            @RequestBody CreateTripDto dto,
//            Principal principal) {
//        TripResponseDto trip = tripService.updateTrip(tripId, principal.getName(), dto);
//        return ResponseEntity.ok(trip);
//    }
//
//    /**
//     * DELETE /traveller/trips/{tripId}
//     * Delete a trip (only by owner).
//     */
//    @DeleteMapping("/trips/{tripId}")
//    public ResponseEntity<Void> deleteTrip(
//            @PathVariable Long tripId,
//            Principal principal) {
//        tripService.deleteTrip(tripId, principal.getName());
//        return ResponseEntity.noContent().build();
//    }

//    // ─────────────────────────────────────────────────────────
//    // JOIN REQUEST ENDPOINTS (/traveller/trips/{tripId}/join-requests)
//    // ─────────────────────────────────────────────────────────
//
//    /**
//     * POST /traveller/trips/{tripId}/request-join
//     * Request to join a trip.
//     */
//    @PostMapping("/trips/{tripId}/request-join")
//    public ResponseEntity<JoinRequestDto> requestToJoin(
//            @PathVariable Long tripId,
//            @RequestBody CreateJoinRequestDto dto,
//            Principal principal) {
//        JoinRequestDto request = tripMemberService.requestToJoin(tripId, principal.getName(), dto);
//        return ResponseEntity.status(201).body(request);
//    }
//
//    /**
//     * GET /traveller/trips/{tripId}/join-requests/pending
//     * Get pending join requests for a trip (owner only).
//     */
//    @GetMapping("/trips/{tripId}/join-requests/pending")
//    public ResponseEntity<List<JoinRequestDto>> getPendingRequests(
//            @PathVariable Long tripId,
//            Principal principal) {
//        List<JoinRequestDto> requests = tripMemberService.getPendingRequests(tripId, principal.getName());
//        return ResponseEntity.ok(requests);
//    }
//
//    /**
//     * GET /traveller/trips/{tripId}/join-requests
//     * Get all join requests for a trip (owner only).
//     */
//    @GetMapping("/trips/{tripId}/join-requests")
//    public ResponseEntity<List<JoinRequestDto>> getAllRequests(
//            @PathVariable Long tripId,
//            Principal principal) {
//        List<JoinRequestDto> requests = tripMemberService.getAllRequests(tripId, principal.getName());
//        return ResponseEntity.ok(requests);
//    }
//
//    /**
//     * PUT /traveller/trips/{tripId}/join-requests/{requestId}/approve
//     * Approve a join request (owner only).
//     */
//    @PutMapping("/trips/{tripId}/join-requests/{requestId}/approve")
//    public ResponseEntity<JoinRequestDto> approveJoinRequest(
//            @PathVariable Long tripId,
//            @PathVariable Long requestId,
//            Principal principal) {
//        JoinRequestDto request = tripMemberService.approveJoinRequest(tripId, requestId, principal.getName());
//        return ResponseEntity.ok(request);
//    }
//
//    /**
//     * PUT /traveller/trips/{tripId}/join-requests/{requestId}/reject
//     * Reject a join request (owner only).
//     */
//    @PutMapping("/trips/{tripId}/join-requests/{requestId}/reject")
//    public ResponseEntity<JoinRequestDto> rejectJoinRequest(
//            @PathVariable Long tripId,
//            @PathVariable Long requestId,
//            Principal principal) {
//        JoinRequestDto request = tripMemberService.rejectJoinRequest(tripId, requestId, principal.getName());
//        return ResponseEntity.ok(request);
//    }
//
//    /**
//     * GET /traveller/trips/{tripId}/members
//     * Get all members of a trip.
//     */
//    @GetMapping("/trips/{tripId}/members")
//    public ResponseEntity<List<TripMemberDto>> getTripMembers(@PathVariable Long tripId) {
//        List<TripMemberDto> members = tripMemberService.getTripMembers(tripId);
//        return ResponseEntity.ok(members);
//    }
//
//    /**
//     * GET /traveller/trips/joined
//     * Get all trips the user has joined.
//     */
//    @GetMapping("/trips/joined/my-trips")
//    public ResponseEntity<List<JoinRequestDto>> getMyJoinedTrips(Principal principal) {
//        List<JoinRequestDto> trips = tripMemberService.getMyApprovedJoins(principal.getName());
//        return ResponseEntity.ok(trips);
//    }
//
//    /**
//     * DELETE /traveller/trips/{tripId}/leave
//     * Leave a trip.
//     */
//    @DeleteMapping("/trips/{tripId}/leave")
//    public ResponseEntity<Void> leaveTrip(
//            @PathVariable Long tripId,
//            Principal principal) {
//        tripMemberService.leaveTrip(tripId, principal.getName());
//        return ResponseEntity.noContent().build();
//    }

    // ─────────────────────────────────────────────────────────
    // DISCOVERY & SEARCH ENDPOINTS (/traveller/discover)
    // ─────────────────────────────────────────────────────────

    /**
     * GET /traveller/discover/travellers
     * Search travellers with optional filters (location, interest, travelStyle).
     * Example: /traveller/discover/travellers?location=Delhi&interest=trekking&travelStyle=Budget
     */
    @GetMapping("/discover/travellers")
    public ResponseEntity<List<TravellerSearchResultDto>> searchTravellers(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String interest,
            @RequestParam(required = false) String travelStyle) {
        TravellerSearchCriteria criteria = TravellerSearchCriteria.builder()
                .location(location)
                .interest(interest)
                .travelStyle(travelStyle)
                .build();
        List<TravellerSearchResultDto> results = searchService.searchTravellers(criteria);
        return ResponseEntity.ok(results);
    }

    /**
     * GET /traveller/discover/travellers/location/{location}
     * Search travellers by location.
     */
    @GetMapping("/discover/travellers/location/{location}")
    public ResponseEntity<List<TravellerSearchResultDto>> searchTravellersByLocation(
            @PathVariable String location) {
        List<TravellerSearchResultDto> results = searchService.searchTravellersByLocation(location);
        return ResponseEntity.ok(results);
    }

    /**
     * GET /traveller/discover/travellers/interest/{interest}
     * Search travellers by interest.
     */
    @GetMapping("/discover/travellers/interest/{interest}")
    public ResponseEntity<List<TravellerSearchResultDto>> searchTravellersByInterest(
            @PathVariable String interest) {
        List<TravellerSearchResultDto> results = searchService.searchTravellersByInterest(interest);
        return ResponseEntity.ok(results);
    }

    /**
     * GET /traveller/discover/travellers/style/{travelStyle}
     * Search travellers by travel style.
     */
    @GetMapping("/discover/travellers/style/{travelStyle}")
    public ResponseEntity<List<TravellerSearchResultDto>> searchTravellersByTravelStyle(
            @PathVariable String travelStyle) {
        List<TravellerSearchResultDto> results = searchService.searchTravellersByTravelStyle(travelStyle);
        return ResponseEntity.ok(results);
    }

    /**
     * GET /traveller/discover/trips
     * Discover public trips with optional filters (destination, minBudget, maxBudget, startDateFrom, endDateTo, travelStyle).
     * Example: /traveller/discover/trips?destination=Bali&minBudget=1000&maxBudget=5000&startDateFrom=2026-06-01&endDateTo=2026-06-30
     */
    @GetMapping("/discover/trips")
    public ResponseEntity<List<TripSearchResultDto>> discoverTrips(
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) BigDecimal minBudget,
            @RequestParam(required = false) BigDecimal maxBudget,
            @RequestParam(required = false) LocalDate startDateFrom,
            @RequestParam(required = false) LocalDate endDateTo,
            @RequestParam(required = false) String travelStyle) {
        TripSearchCriteria criteria = TripSearchCriteria.builder()
                .destination(destination)
                .minBudget(minBudget)
                .maxBudget(maxBudget)
                .startDateFrom(startDateFrom)
                .endDateTo(endDateTo)
                .travelStyle(travelStyle)
                .build();
        List<TripSearchResultDto> results = searchService.discoverTrips(criteria);
        return ResponseEntity.ok(results);
    }

    /**
     * GET /traveller/discover/trips/destination/{destination}
     * Discover trips by destination.
     */
    @GetMapping("/discover/trips/destination/{destination}")
    public ResponseEntity<List<TripSearchResultDto>> discoverTripsByDestination(
            @PathVariable String destination) {
        List<TripSearchResultDto> results = searchService.discoverTripsByDestination(destination);
        return ResponseEntity.ok(results);
    }

    /**
     * GET /traveller/discover/trips/budget
     * Discover trips by budget range.
     * Example: /traveller/discover/trips/budget?min=1000&max=5000
     */
    @GetMapping("/discover/trips/budget")
    public ResponseEntity<List<TripSearchResultDto>> discoverTripsByBudgetRange(
            @RequestParam BigDecimal min,
            @RequestParam BigDecimal max) {
        List<TripSearchResultDto> results = searchService.discoverTripsByBudgetRange(min, max);
        return ResponseEntity.ok(results);
    }

    /**
     * GET /traveller/discover/trips/dates
     * Discover trips by date range.
     * Example: /traveller/discover/trips/dates?from=2026-06-01&to=2026-06-30
     */
    @GetMapping("/discover/trips/dates")
    public ResponseEntity<List<TripSearchResultDto>> discoverTripsByDateRange(
            @RequestParam LocalDate from,
            @RequestParam LocalDate to) {
        List<TripSearchResultDto> results = searchService.discoverTripsByDateRange(from, to);
        return ResponseEntity.ok(results);
    }

    /**
     * GET /traveller/discover/trips/style/{travelStyle}
     * Discover trips by travel style.
     */
    @GetMapping("/discover/trips/style/{travelStyle}")
    public ResponseEntity<List<TripSearchResultDto>> discoverTripsByTravelStyle(
            @PathVariable String travelStyle) {
        List<TripSearchResultDto> results = searchService.discoverTripsByTravelStyle(travelStyle);
        return ResponseEntity.ok(results);
    }

    // ─────────────────────────────────────────────────────────
    // NOTIFICATION ENDPOINTS (/traveller/notifications)
    // ─────────────────────────────────────────────────────────

    /**
     * GET /traveller/notifications
     * Get all notifications for the authenticated user.
     */
    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationDto>> getMyNotifications(Principal principal) {
        List<NotificationDto> notifications = notificationService.getMyNotifications(principal.getName());
        return ResponseEntity.ok(notifications);
    }

    /**
     * GET /traveller/notifications/unread
     * Get unread notifications for the authenticated user.
     */
    @GetMapping("/notifications/unread")
    public ResponseEntity<List<NotificationDto>> getUnreadNotifications(Principal principal) {
        List<NotificationDto> notifications = notificationService.getUnreadNotifications(principal.getName());
        return ResponseEntity.ok(notifications);
    }

    /**
     * GET /traveller/notifications/unread/count
     * Get count of unread notifications.
     */
    @GetMapping("/notifications/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Principal principal) {
        long unreadCount = notificationService.getUnreadCount(principal.getName());
        return ResponseEntity.ok(Map.of("unreadCount", unreadCount));
    }

    /**
     * PUT /traveller/notifications/{notificationId}/read
     * Mark a notification as read.
     */
    @PutMapping("/notifications/{notificationId}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long notificationId,
            Principal principal) {
        notificationService.markAsRead(notificationId, principal.getName());
        return ResponseEntity.noContent().build();
    }

    /**
     * PUT /traveller/notifications/read-all
     * Mark all notifications as read.
     */
    @PutMapping("/notifications/read-all")
    public ResponseEntity<Void> markAllAsRead(Principal principal) {
        notificationService.markAllAsRead(principal.getName());
        return ResponseEntity.noContent().build();
    }

    /**
     * DELETE /traveller/notifications/{notificationId}
     * Delete a notification.
     */
    @DeleteMapping("/notifications/{notificationId}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long notificationId,
            Principal principal) {
        notificationService.deleteNotification(notificationId, principal.getName());
        return ResponseEntity.noContent().build();
    }

    /**
     * DELETE /traveller/notifications
     * Delete all notifications.
     */
    @DeleteMapping("/notifications")
    public ResponseEntity<Void> deleteAllNotifications(Principal principal) {
        notificationService.deleteAllNotifications(principal.getName());
        return ResponseEntity.noContent().build();
    }

    // ─────────────────────────────────────────────────────────
    // CHAT & MESSAGING ENDPOINTS (/traveller/chat)
    // ─────────────────────────────────────────────────────────

    /**
     * POST /traveller/chat/direct/{otherTravellerId}
     * Get or create a direct chat room with another traveller.
     */
    @PostMapping("/chat/direct/{otherTravellerId}")
    public ResponseEntity<ChatRoomDto> getOrCreateDirectChat(
            @PathVariable Long otherTravellerId,
            Principal principal) {
        ChatRoomDto chatRoom = chatService.getOrCreateDirectChat(principal.getName(), otherTravellerId);
        return ResponseEntity.status(201).body(chatRoom);
    }

    /**
     * POST /traveller/chat/trip/{tripId}
     * Get or create a group chat room for a trip.
     */
    @PostMapping("/chat/trip/{tripId}")
    public ResponseEntity<ChatRoomDto> getOrCreateTripGroupChat(
            @PathVariable Long tripId,
            Principal principal) {
        ChatRoomDto chatRoom = chatService.getOrCreateTripGroupChat(principal.getName(), tripId);
        return ResponseEntity.status(201).body(chatRoom);
    }

    /**
     * GET /traveller/chat/rooms
     * Get all chat rooms for the authenticated user.
     */
    @GetMapping("/chat/rooms")
    public ResponseEntity<List<ChatRoomDto>> getMyChatRooms(Principal principal) {
        List<ChatRoomDto> rooms = chatService.getMyChatRooms(principal.getName());
        return ResponseEntity.ok(rooms);
    }

    /**
     * GET /traveller/chat/rooms/{roomId}
     * Get details of a specific chat room.
     */
    @GetMapping("/chat/rooms/{roomId}")
    public ResponseEntity<ChatRoomDto> getChatRoom(
            @PathVariable Long roomId,
            Principal principal) {
        ChatRoomDto room = chatService.getChatRoom(roomId, principal.getName());
        return ResponseEntity.ok(room);
    }

    /**
     * POST /traveller/chat/rooms/{roomId}/messages
     * Send a message to a chat room (also persists via WebSocket).
     */
    @PostMapping("/chat/rooms/{roomId}/messages")
    public ResponseEntity<ChatMessageDto> sendMessage(
            @PathVariable Long roomId,
            @RequestBody SendChatMessageDto dto,
            Principal principal) {
        ChatMessageDto message = chatService.sendMessage(roomId, principal.getName(), dto);
        return ResponseEntity.status(201).body(message);
    }

    /**
     * GET /traveller/chat/rooms/{roomId}/messages
     * Get chat history for a room (paginated).
     * Example: /traveller/chat/rooms/1/messages?page=0&size=50
     */
    @GetMapping("/chat/rooms/{roomId}/messages")
    public ResponseEntity<List<ChatMessageDto>> getChatHistory(
            @PathVariable Long roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            Principal principal) {
        List<ChatMessageDto> messages = chatService.getChatHistory(roomId, principal.getName(), page, size);
        return ResponseEntity.ok(messages);
    }

    /**
     * GET /traveller/chat/rooms/{roomId}/unread-count
     * Get unread message count for a chat room.
     */
    @GetMapping("/chat/rooms/{roomId}/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @PathVariable Long roomId,
            Principal principal) {
        long unreadCount = chatService.getUnreadCount(roomId, principal.getName());
        return ResponseEntity.ok(Map.of("unreadCount", unreadCount));
    }

    /**
     * PUT /traveller/chat/rooms/{roomId}/mark-read
     * Mark all messages in a room as read.
     */
    @PutMapping("/chat/rooms/{roomId}/mark-read")
    public ResponseEntity<Void> markChatRoomAsRead(
            @PathVariable Long roomId,
            Principal principal) {
        chatService.markAsRead(roomId, principal.getName());
        return ResponseEntity.noContent().build();
    }

    /**
     * PUT /traveller/chat/messages/{messageId}/read
     * Mark a specific message as read.
     */
    @PutMapping("/chat/messages/{messageId}/read")
    public ResponseEntity<Void> markMessageAsRead(
            @PathVariable Long messageId,
            Principal principal) {
        chatService.markMessageAsRead(messageId, principal.getName());
        return ResponseEntity.noContent().build();
    }
}
