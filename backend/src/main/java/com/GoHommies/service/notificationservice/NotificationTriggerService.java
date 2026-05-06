package com.GoHommies.service.notificationservice;

import org.springframework.stereotype.Service;

import com.GoHommies.entity.Notification.NotificationType;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationTriggerService {

    private final NotificationService notificationService;

    /**
     * Called when a user requests to join a trip
     * Notifies: Trip owner (sender = requester)
     */
    public void notifyJoinRequestSent(Long tripOwnerId, Long requesterId, Long tripId, 
                                      String requesterName, Long joinRequestId) {
        String message = requesterName + " wants to join your trip!";
        notificationService.createNotification(
                tripOwnerId,
                requesterId,
                tripId,
                NotificationType.JOIN_REQUEST_SENT,
                message,
                joinRequestId
        );
    }

    /**
     * Called when trip owner approves a join request
     * Notifies: Requester (sender = trip owner)
     */
    public void notifyJoinRequestApproved(Long requesterId, Long tripOwnerId, Long tripId,
                                         String tripDestination, Long joinRequestId) {
        String message = "Your request to join " + tripDestination + " was approved!";
        notificationService.createNotification(
                requesterId,
                tripOwnerId,
                tripId,
                NotificationType.JOIN_REQUEST_APPROVED,
                message,
                joinRequestId
        );
    }

    /**
     * Called when trip owner rejects a join request
     * Notifies: Requester (sender = trip owner)
     */
    public void notifyJoinRequestRejected(Long requesterId, Long tripOwnerId, Long tripId,
                                         String tripDestination, Long joinRequestId) {
        String message = "Your request to join " + tripDestination + " was rejected.";
        notificationService.createNotification(
                requesterId,
                tripOwnerId,
                tripId,
                NotificationType.JOIN_REQUEST_REJECTED,
                message,
                joinRequestId
        );
    }

    /**
     * Called when a trip is updated
     * Notifies: All approved members (sender = trip owner)
     */
    public void notifyTripUpdated(Long tripOwnerId, Long tripId, String tripDestination,
                                 java.util.List<Long> memberIds) {
        String message = "Trip to " + tripDestination + " has been updated.";
        memberIds.forEach(memberId -> {
            if (!memberId.equals(tripOwnerId)) { // Don't notify owner themselves
                notificationService.createNotification(
                        memberId,
                        tripOwnerId,
                        tripId,
                        NotificationType.TRIP_UPDATED,
                        message,
                        null
                );
            }
        });
    }

    /**
     * Called when a member leaves a trip
     * Notifies: Trip owner (sender = member who left)
     */
    public void notifyMemberLeft(Long tripOwnerId, Long memberId, Long tripId,
                                String memberName, String tripDestination) {
        String message = memberName + " left your trip to " + tripDestination + ".";
        notificationService.createNotification(
                tripOwnerId,
                memberId,
                tripId,
                NotificationType.MEMBER_LEFT,
                message,
                null
        );
    }

    /**
     * Called when someone likes a trip post
     * Notifies: Trip owner (sender = liker)
     */
    public void notifyPostLiked(Long tripOwnerId, Long likerId, Long tripId,
                                String likerName, String destination) {
        String message = likerName + " liked your trip post to " + destination + "!";
        notificationService.createNotification(
                tripOwnerId,
                likerId,
                tripId,
                NotificationType.POST_LIKED,
                message,
                null
        );
    }

    /**
     * Called when someone comments on a trip post
     * Notifies: Trip owner (sender = commenter)
     */
    public void notifyPostCommented(Long tripOwnerId, Long commenterId, Long tripId,
                                    String commenterName, String destination, String commentPreview) {
        String preview = commentPreview != null && commentPreview.length() > 40
                ? commentPreview.substring(0, 40) + "…"
                : commentPreview;
        String message = commenterName + " commented on your trip to " + destination
                + (preview != null ? ": \"" + preview + "\"" : ".");
        notificationService.createNotification(
                tripOwnerId,
                commenterId,
                tripId,
                NotificationType.POST_COMMENTED,
                message,
                null
        );
    }
}
