package com.GoHommies.dto;

import java.time.LocalDateTime;

import com.GoHommies.entity.TripJoinRequest.RequestStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JoinRequestDto {
    private Long id;
    private Long tripId;
    private String requesterName;
    private String requesterEmail;
    private String requesterProfileUrl;
    private String message;
    private RequestStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime approvedAt;
    private LocalDateTime rejectedAt;
}
