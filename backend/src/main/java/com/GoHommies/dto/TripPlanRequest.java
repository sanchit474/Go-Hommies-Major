package com.GoHommies.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripPlanRequest {
    private String destination; // city or region
    private String startDate; // ISO date string, optional
    private String endDate; // ISO date string, optional
    private Integer travelers; // number of travelers
    private List<String> interests; // e.g., ["sightseeing","hiking"]
    private String budget; // human readable, e.g., "moderate" or "$1000"
    private String preferences; // free text preferences (food, pace, accessibility)
}
