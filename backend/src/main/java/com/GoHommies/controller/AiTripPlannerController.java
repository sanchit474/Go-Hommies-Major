package com.GoHommies.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.GoHommies.dto.TripPlanRequest;
import com.GoHommies.dto.TripPlanResponse;
import com.GoHommies.service.ai.AiTripPlannerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiTripPlannerController {

    private final AiTripPlannerService aiTripPlannerService;

    @PostMapping("/trip-planner")
    public ResponseEntity<TripPlanResponse> planTrip(@RequestBody TripPlanRequest req) {
        try {
            TripPlanResponse resp = aiTripPlannerService.planTrip(req);
            return ResponseEntity.ok(resp);
        } catch (IllegalStateException ise) {
            return ResponseEntity.status(500).body(TripPlanResponse.builder().itinerary(ise.getMessage()).raw("").build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(TripPlanResponse.builder().itinerary("AI service error: " + e.getMessage()).raw("").build());
        }
    }
}
