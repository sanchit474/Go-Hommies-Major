package com.GoHommies.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripPlanResponse {
    private String itinerary; // human-readable itinerary returned by AI
    private String raw; // raw AI response JSON (optional)
}
