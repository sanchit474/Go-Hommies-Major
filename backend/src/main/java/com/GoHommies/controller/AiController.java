package com.GoHommies.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.GoHommies.service.aiservice.AiService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/trip-planning")
    public ResponseEntity<Map<String, Object>> tripPlanning(@RequestBody Map<String, String> payload) {
        String message = payload == null ? "" : payload.getOrDefault("message", "");
        return ResponseEntity.ok(Map.of("data", Map.of("response", aiService.buildTripPlanningResponse(message))));
    }

    @PostMapping("/optimize-budget")
    public ResponseEntity<Map<String, Object>> optimizeBudget(@RequestBody Map<String, Object> payload) {
        Object budgetValue = payload == null ? null : payload.get("budget");
        return ResponseEntity.ok(Map.of("data", Map.of("response", aiService.buildBudgetOptimizationResponse(budgetValue))));
    }

    @PostMapping("/travel-insights")
    public ResponseEntity<Map<String, Object>> travelInsights() {
        return ResponseEntity.ok(Map.of("data", aiService.buildTravelInsightsResponse()));
    }
}