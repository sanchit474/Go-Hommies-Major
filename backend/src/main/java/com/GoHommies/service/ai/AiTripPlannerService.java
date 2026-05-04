package com.GoHommies.service.ai;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.GoHommies.dto.TripPlanRequest;
import com.GoHommies.dto.TripPlanResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AiTripPlannerService {

    @Value("${OPENAI_API_KEY:}")
    private String openAiApiKey;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Simple in-memory cache to reduce duplicate OpenAI calls. Key = prompt string.
    private static final long CACHE_TTL_MS = 1000L * 60 * 60 * 6; // 6 hours
    private final java.util.concurrent.ConcurrentHashMap<String, CacheEntry> cache = new java.util.concurrent.ConcurrentHashMap<>();

    private static class CacheEntry {
        final TripPlanResponse resp;
        final long ts;
        CacheEntry(TripPlanResponse r, long ts) { this.resp = r; this.ts = ts; }
    }

    public TripPlanResponse planTrip(TripPlanRequest req) throws Exception {
        if (openAiApiKey == null || openAiApiKey.isBlank()) {
            throw new IllegalStateException("OpenAI API key not configured. Set OPENAI_API_KEY or ai.openai.api-key.");
        }

        String prompt = buildPrompt(req);

        // check cache
        CacheEntry cached = cache.get(prompt);
        long now = System.currentTimeMillis();
        if (cached != null && (now - cached.ts) < CACHE_TTL_MS) {
            return cached.resp;
        }

        Map<String, Object> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);

        Map<String, Object> payload = new HashMap<>();
        payload.put("model", "gpt-4o-mini");
        payload.put("messages", List.of(message));
        payload.put("max_tokens", 1000);

        String body = objectMapper.writeValueAsString(payload);

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                .timeout(Duration.ofSeconds(30))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + openAiApiKey)
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() / 100 != 2) {
            throw new IllegalStateException("OpenAI API error: " + response.statusCode() + " " + response.body());
        }

        JsonNode root = objectMapper.readTree(response.body());
        String content = "";
        if (root.has("choices") && root.get("choices").isArray() && root.get("choices").size() > 0) {
            JsonNode first = root.get("choices").get(0);
            if (first.has("message") && first.get("message").has("content")) {
                content = first.get("message").get("content").asText();
            }
        }

        TripPlanResponse resp = TripPlanResponse.builder()
                .itinerary(content)
                .raw(response.body())
                .build();

        cache.put(prompt, new CacheEntry(resp, now));

        // cleanup occasional stale entries (best-effort)
        if (cache.size() > 1000) {
            long cutoff = now - CACHE_TTL_MS;
            cache.entrySet().removeIf(e -> e.getValue().ts < cutoff);
        }

        return resp;
    }

    private String buildPrompt(TripPlanRequest req) {
        StringBuilder sb = new StringBuilder();
        sb.append("Create a day-by-day travel itinerary for the following request.\n\n");
        if (req.getDestination() != null) sb.append("Destination: ").append(req.getDestination()).append("\n");
        if (req.getStartDate() != null || req.getEndDate() != null) {
            sb.append("Dates: ");
            if (req.getStartDate() != null) sb.append(req.getStartDate());
            sb.append(" to ");
            if (req.getEndDate() != null) sb.append(req.getEndDate());
            sb.append("\n");
        }
        if (req.getTravelers() != null) sb.append("Number of travelers: ").append(req.getTravelers()).append("\n");
        if (req.getInterests() != null && !req.getInterests().isEmpty()) sb.append("Interests: ").append(String.join(", ", req.getInterests())).append("\n");
        if (req.getBudget() != null) sb.append("Budget: ").append(req.getBudget()).append("\n");
        if (req.getPreferences() != null) sb.append("Preferences: ").append(req.getPreferences()).append("\n");

        sb.append("Provide recommendations for each day, including morning/afternoon/evening activities, approximate durations, and suggested hotels or neighborhoods. If possible, list estimated costs and transportation tips. Reply concisely but use bullet points and day headings.");

        return sb.toString();
    }
}
