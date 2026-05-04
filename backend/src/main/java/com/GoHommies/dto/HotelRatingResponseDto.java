package com.GoHommies.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HotelRatingResponseDto {
    private Long id;
    private Long hotelId;
    private Long bookingId;
    private Integer rating;
    private String comment;
    private String reviewerName;
    private String reviewerEmail;
    private LocalDateTime createdAt;
}
