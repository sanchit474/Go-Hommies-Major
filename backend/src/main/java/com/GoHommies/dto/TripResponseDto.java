package com.GoHommies.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TripResponseDto {
    private Long id;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal budget;
    private Integer totalPersons;
    private String description;
    private String imageUrl;
    private Boolean isPublic;
    private String createdBy;
    private String creatorEmail;
    private String creatorProfileUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
