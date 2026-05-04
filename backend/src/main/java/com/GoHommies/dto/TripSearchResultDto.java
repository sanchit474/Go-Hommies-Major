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
public class TripSearchResultDto {
    private Long id;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal budget;
    private String description;
    private String imageUrl;
    private String createdBy;
    private String creatorProfileUrl;
    private Double creatorRating;
    private Integer memberCount;
    private LocalDateTime createdAt;
}
