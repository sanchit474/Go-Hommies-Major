package com.GoHommies.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HotelResponseDto {
    private Long id;
    private String name;
    private String location;
    private String description;
    private Integer totalSeats;
    private Integer availableSeats;
    private BigDecimal pricePerNight;
    private Double avgRating;
    private Integer totalRatings;
    private Boolean isActive;
    private List<String> roomPhotoUrls;
    private String providerName;
    private String providerEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
