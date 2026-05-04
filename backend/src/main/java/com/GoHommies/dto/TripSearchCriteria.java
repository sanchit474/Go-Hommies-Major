package com.GoHommies.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TripSearchCriteria {
    private String destination;
    private BigDecimal minBudget;
    private BigDecimal maxBudget;
    private LocalDate startDateFrom;
    private LocalDate endDateTo;
    private String travelStyle;
}
