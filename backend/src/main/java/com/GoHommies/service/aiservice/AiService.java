package com.GoHommies.service.aiservice;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.GoHommies.dto.TripResponseDto;
import com.GoHommies.service.tripservice.TripService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AiService {

    private enum AssistantIntent {
        TRIP_SEARCH,
        EXPLORE_DESTINATION,
        BUDGET,
        GENERAL
    }

    private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";
    private static final String GEMINI_URL_TEMPLATE = "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s";

    private final TripService tripService;
    private final ObjectMapper objectMapper;

    @Value("${ai.openai.api-key:}")
    private String openAiApiKey;

    @Value("${ai.openai.model:gpt-4o}")
    private String openAiModel;

    @Value("${ai.gemini.api-key:}")
    private String geminiApiKey;

    @Value("${ai.gemini.model:gemini-2.5-pro}")
    private String geminiModel;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(20))
            .build();

    public String buildDetailedItinerary(Map<String, Object> payload) {
        if (payload == null) payload = Map.of();

        String destination  = getString(payload, "destination", "");
        String startDate    = getString(payload, "startDate", "");
        String endDate      = getString(payload, "endDate", "");
        String budget       = getString(payload, "budget", "");
        String preferences  = getString(payload, "preferences", "");
        int travelers       = getInt(payload, "travelers", 1);

        Object interestsRaw = payload.get("interests");
        String interests = "";
        if (interestsRaw instanceof List<?> list) {
            interests = list.stream().map(Object::toString).collect(Collectors.joining(", "));
        } else if (interestsRaw instanceof String s) {
            interests = s;
        }

        if (destination.isBlank()) {
            return "Please provide a destination so I can plan your trip.";
        }

        // Calculate number of days if dates provided
        String daysInfo = "";
        if (!startDate.isBlank() && !endDate.isBlank()) {
            try {
                java.time.LocalDate start = java.time.LocalDate.parse(startDate);
                java.time.LocalDate end   = java.time.LocalDate.parse(endDate);
                long days = java.time.temporal.ChronoUnit.DAYS.between(start, end);
                if (days > 0) daysInfo = days + " days (" + startDate + " to " + endDate + ")";
            } catch (Exception ignored) {}
        }

        StringBuilder prompt = new StringBuilder();
        prompt.append("You are a professional travel planner. Create a detailed, realistic, day-by-day travel itinerary.\n\n");
        prompt.append("TRIP DETAILS:\n");
        prompt.append("• Destination: ").append(destination).append("\n");
        if (!daysInfo.isBlank())    prompt.append("• Duration: ").append(daysInfo).append("\n");
        else if (!startDate.isBlank()) prompt.append("• Start Date: ").append(startDate).append("\n");
        prompt.append("• Travelers: ").append(travelers).append(" person(s)\n");
        if (!budget.isBlank())      prompt.append("• Budget: ").append(budget).append("\n");
        if (!interests.isBlank())   prompt.append("• Interests: ").append(interests).append("\n");
        if (!preferences.isBlank()) prompt.append("• Special Preferences: ").append(preferences).append("\n");
        prompt.append("\nFORMAT YOUR RESPONSE EXACTLY LIKE THIS:\n");
        prompt.append("📍 TRIP OVERVIEW\n[2-3 sentence summary of the trip]\n\n");
        prompt.append("🗓️ DAY-BY-DAY ITINERARY\n\n");
        prompt.append("Day 1 – [Theme/Title]\n");
        prompt.append("🌅 Morning: [Activity + tip]\n");
        prompt.append("☀️ Afternoon: [Activity + tip]\n");
        prompt.append("🌙 Evening: [Activity + dinner suggestion]\n");
        prompt.append("🏨 Stay: [Accommodation suggestion]\n\n");
        prompt.append("[Continue for each day...]\n\n");
        prompt.append("💰 BUDGET BREAKDOWN\n[Estimated costs per category]\n\n");
        prompt.append("🚗 TRANSPORT TIPS\n[How to get around]\n\n");
        prompt.append("💡 PRO TIPS\n[3-4 practical tips specific to this destination]");

        String llmResponse = generateWithFallback(prompt.toString());
        if (!llmResponse.isBlank()) {
            return llmResponse;
        }

        // Rich fallback when AI is unavailable
        return buildFallbackItinerary(destination, budget, interests, travelers);
    }

    private String buildFallbackItinerary(String destination, String budget, String interests, int travelers) {
        return "📍 TRIP OVERVIEW\n"
                + "A well-rounded trip to " + destination + " for " + travelers + " traveller(s)."
                + (!budget.isBlank() ? " Budget: " + budget + "." : "") + "\n\n"
                + "🗓️ DAY-BY-DAY ITINERARY\n\n"
                + "Day 1 – Arrival & First Impressions\n"
                + "🌅 Morning: Arrive, check in, freshen up.\n"
                + "☀️ Afternoon: Walk around the main market or city centre. Try local street food.\n"
                + "🌙 Evening: Dinner at a well-rated local restaurant. Early rest.\n"
                + "🏨 Stay: Mid-range hotel near the city centre.\n\n"
                + "Day 2 – Key Attractions\n"
                + "🌅 Morning: Visit the most iconic landmark or heritage site.\n"
                + "☀️ Afternoon: Local museum, art gallery, or cultural experience.\n"
                + "🌙 Evening: Sunset viewpoint or rooftop café.\n"
                + "🏨 Stay: Same hotel.\n\n"
                + "Day 3 – Nature & Adventure\n"
                + "🌅 Morning: Day trip to a nearby natural attraction (hills, beach, or forest).\n"
                + "☀️ Afternoon: " + (interests.isBlank() ? "Hiking, photography, or a scenic drive." : interests.split(",")[0].trim() + " activity.") + "\n"
                + "🌙 Evening: Return, local dinner, souvenir shopping.\n"
                + "🏨 Stay: Same hotel.\n\n"
                + "Day 4 – Leisure & Departure\n"
                + "🌅 Morning: Café breakfast, last-minute shopping.\n"
                + "☀️ Afternoon: Depart.\n\n"
                + "💰 BUDGET BREAKDOWN\n"
                + "• Accommodation: ~40% of budget\n"
                + "• Transport: ~20% of budget\n"
                + "• Food: ~25% of budget\n"
                + "• Activities & Shopping: ~15% of budget\n\n"
                + "🚗 TRANSPORT TIPS\n"
                + "Use local auto-rickshaws or app cabs for short distances. Book intercity travel in advance.\n\n"
                + "💡 PRO TIPS\n"
                + "• Book accommodation at least 3 days in advance.\n"
                + "• Carry cash for local markets and street food.\n"
                + "• Check local weather before packing.\n"
                + "• Download offline maps for " + destination + " before you leave.\n\n"
                + "⚠️ Note: This is a template itinerary. For a fully AI-personalised plan, the AI service will be available shortly.";
    }

    private String getString(Map<String, Object> map, String key, String defaultVal) {
        Object val = map.get(key);
        return val == null ? defaultVal : val.toString().trim();
    }

    private int getInt(Map<String, Object> map, String key, int defaultVal) {
        Object val = map.get(key);
        if (val == null) return defaultVal;
        try { return Integer.parseInt(val.toString()); } catch (Exception e) { return defaultVal; }
    }

    public String buildTripPlanningResponse(String message) {
        String query = Optional.ofNullable(message).orElse("").trim();
        List<TripResponseDto> publicTrips = safePublicTrips();

        AssistantIntent intent = classifyIntent(query);

        if (intent == AssistantIntent.GENERAL) {
            return "Tell me a destination, budget, or what you want to do, and I’ll suggest trips or things to explore.";
        }

        if (intent == AssistantIntent.EXPLORE_DESTINATION) {
            return buildExploreResponse(query, publicTrips);
        }

        if (intent == AssistantIntent.BUDGET) {
            return buildBudgetOptimizationResponse(extractBudget(query));
        }

        String llmResponse = generateWithFallback(buildTripPlanningPrompt(query, publicTrips));
        if (!llmResponse.isBlank()) {
            return llmResponse;
        }

        List<TripResponseDto> matches = findMatchingTrips(query, publicTrips);
        StringBuilder response = new StringBuilder();

        response.append("Here’s a quick trip plan for: \"").append(query).append("\".\n\n");

        if (!matches.isEmpty()) {
            response.append("Best matching public trips right now:\n");
            for (TripResponseDto trip : matches) {
                response.append("• ")
                        .append(trip.getDestination())
                        .append(" | ")
                        .append(formatDate(trip.getStartDate()))
                        .append(" | ₹")
                        .append(formatBudget(trip.getBudget()))
                        .append(" per person\n");
            }
            response.append("\nOpen the trip card and tap Request to Join if one fits your plan.");
        } else if (!publicTrips.isEmpty()) {
            response.append("I couldn’t find an exact match, but these public trips are active right now:\n");
            publicTrips.stream().limit(3).forEach(trip -> response.append("• ")
                    .append(trip.getDestination())
                    .append(" | ")
                    .append(formatDate(trip.getStartDate()))
                    .append(" | ₹")
                    .append(formatBudget(trip.getBudget()))
                    .append(" per person\n"));
            response.append("\nIf you want, refine your search with a destination, budget, or month.");
        } else {
            response.append("There are no public trips listed yet. Create a trip post so others can join it.");
        }

        return response.toString().trim();
    }

    public String buildBudgetOptimizationResponse(Object budgetValue) {
        BigDecimal budget = parseBudget(budgetValue);
        if (budget == null || budget.compareTo(BigDecimal.ZERO) <= 0) {
            return "Please enter a valid budget amount and I’ll break it into travel, stay, food, and buffer costs.";
        }

        String llmResponse = generateWithFallback(buildBudgetPrompt(budget));
        if (!llmResponse.isBlank()) {
            return llmResponse;
        }

        BigDecimal stay = budget.multiply(BigDecimal.valueOf(0.45)).setScale(0, RoundingMode.HALF_UP);
        BigDecimal transport = budget.multiply(BigDecimal.valueOf(0.25)).setScale(0, RoundingMode.HALF_UP);
        BigDecimal food = budget.multiply(BigDecimal.valueOf(0.20)).setScale(0, RoundingMode.HALF_UP);
        BigDecimal buffer = budget.subtract(stay).subtract(transport).subtract(food);

        return String.format(
                Locale.US,
                "For a budget of ₹%s, use about ₹%s for stay, ₹%s for transport, ₹%s for food, and keep ₹%s as a buffer. If you want, I can also suggest a trip style that fits this budget.",
                formatBudget(budget),
                formatBudget(stay),
                formatBudget(transport),
                formatBudget(food),
                formatBudget(buffer)
        );
    }

    public Map<String, Object> buildTravelInsightsResponse() {
        List<TripResponseDto> publicTrips = safePublicTrips();
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalPosts", publicTrips.size());
        stats.put("totalVlogs", 0);
        stats.put("avgBudget", publicTrips.isEmpty() ? 0 : calculateAverageBudget(publicTrips));

        String llmResponse = generateWithFallback(buildInsightsPrompt(publicTrips, stats));

        String response;
        if (!llmResponse.isBlank()) {
            response = llmResponse;
        } else if (publicTrips.isEmpty()) {
            response = "No public trips have been posted yet. Once people start sharing trips, I’ll surface patterns, budgets, and destinations here.";
        } else {
            Map<String, Long> destinationCounts = publicTrips.stream()
                    .map(trip -> normalizeDestination(trip.getDestination()))
                    .filter(dest -> !dest.isBlank())
                    .collect(Collectors.groupingBy(dest -> dest, Collectors.counting()));

            String topDestination = destinationCounts.entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse(publicTrips.get(0).getDestination());

            response = String.format(
                    Locale.US,
                    "Community travel data is growing. There are %d public trips with an average budget of ₹%s. The most common destination right now is %s. Use the feed to join a trip that matches your timing and budget.",
                    publicTrips.size(),
                    stats.get("avgBudget"),
                    topDestination
            );
        }

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("response", response);
        data.put("stats", stats);
        return data;
    }

    private String generateWithFallback(String prompt) {
        String openAiResponse = callOpenAi(prompt);
        if (!openAiResponse.isBlank()) {
            return openAiResponse;
        }

        String geminiResponse = callGemini(prompt);
        if (!geminiResponse.isBlank()) {
            return geminiResponse;
        }

        return "";
    }

    private String callOpenAi(String prompt) {
        if (openAiApiKey == null || openAiApiKey.isBlank()) {
            return "";
        }

        try {
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("model", openAiModel);
            payload.put("temperature", 0.7);
            payload.put("max_tokens", 2048);
            payload.put("messages", List.of(
                    Map.of("role", "system", "content", aiSystemPrompt()),
                    Map.of("role", "user", "content", prompt)
            ));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(OPENAI_URL))
                    .timeout(Duration.ofSeconds(45))
                    .header("Authorization", "Bearer " + openAiApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                System.err.println("[AI] OpenAI error " + response.statusCode() + ": " + response.body());
                return "";
            }

            JsonNode root = objectMapper.readTree(response.body());
            JsonNode content = root.path("choices").path(0).path("message").path("content");
            return content.isTextual() ? content.asText().trim() : "";
        } catch (IOException | InterruptedException ex) {
            Thread.currentThread().interrupt();
            System.err.println("[AI] OpenAI IO error: " + ex.getMessage());
            return "";
        } catch (Exception ex) {
            System.err.println("[AI] OpenAI unexpected error: " + ex.getMessage());
            return "";
        }
    }

    private String callGemini(String prompt) {
        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            return "";
        }

        // Try models in order of availability — flash is free-tier friendly
        String[] modelsToTry = { geminiModel, "gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro" };

        for (String model : modelsToTry) {
            try {
                Map<String, Object> payload = Map.of(
                        "contents", List.of(Map.of(
                                "role", "user",
                                "parts", List.of(Map.of("text", aiSystemPrompt() + "\n\n" + prompt))
                        )),
                        "generationConfig", Map.of(
                                "temperature", 0.7,
                                "topP", 0.95,
                                "maxOutputTokens", 2048
                        )
                );

                String url = String.format(GEMINI_URL_TEMPLATE, model, geminiApiKey);
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .timeout(Duration.ofSeconds(45))
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 404 || response.statusCode() == 400) {
                    // Model not found or bad request — try next model
                    System.err.println("[AI] Gemini model " + model + " returned " + response.statusCode() + ", trying next...");
                    continue;
                }

                if (response.statusCode() < 200 || response.statusCode() >= 300) {
                    System.err.println("[AI] Gemini error " + response.statusCode() + ": " + response.body());
                    continue;
                }

                JsonNode root = objectMapper.readTree(response.body());
                JsonNode text = root.path("candidates").path(0).path("content").path("parts").path(0).path("text");
                if (text.isTextual() && !text.asText().isBlank()) {
                    return text.asText().trim();
                }

            } catch (IOException | InterruptedException ex) {
                Thread.currentThread().interrupt();
                System.err.println("[AI] Gemini IO error with model " + model + ": " + ex.getMessage());
            } catch (Exception ex) {
                System.err.println("[AI] Gemini unexpected error with model " + model + ": " + ex.getMessage());
            }
        }

        return "";
    }

    private String aiSystemPrompt() {
        return "You are GoHomies Trip Assistant. Keep answers concise, practical, and travel-focused. "
                + "Prioritize public trip discovery, joining, budgets, dates, and itinerary suggestions. "
                + "When relevant, recommend community trips the user can join. "
                + "If the user asks about activities, sightseeing, food, or places to explore in a destination, answer that directly and do not repeat the trip-match template.";
    }

    private AssistantIntent classifyIntent(String query) {
        String lowerQuery = Optional.ofNullable(query).orElse("").toLowerCase(Locale.ROOT);
        if (lowerQuery.isBlank()) {
            return AssistantIntent.GENERAL;
        }

        if (isGreeting(lowerQuery)) {
            return AssistantIntent.GENERAL;
        }

        if (containsAny(lowerQuery, "explore", "exploring", "things to do", "what to do", "places to visit", "sightseeing", "food in", "eat in", "around", "nearby", "visit", "do in", "other thing")) {
            return AssistantIntent.EXPLORE_DESTINATION;
        }

        if (containsAny(lowerQuery, "budget", "cost", "price", "cheapest", "cheap", "expense", "spend")) {
            return AssistantIntent.BUDGET;
        }

        if (containsAny(lowerQuery, "trip", "trip plan", "join", "request", "find", "available", "available trip", "manali", "shimla", "go to", "going to", "travel", "plan")) {
            return AssistantIntent.TRIP_SEARCH;
        }

        return AssistantIntent.GENERAL;
    }

    private boolean isGreeting(String lowerQuery) {
        return containsAny(lowerQuery, "hi", "hello", "hey", "hii", "yo") && lowerQuery.split("\\s+").length <= 3;
    }

    private boolean containsAny(String text, String... phrases) {
        for (String phrase : phrases) {
            if (text.contains(phrase)) {
                return true;
            }
        }
        return false;
    }

    private String buildExploreResponse(String query, List<TripResponseDto> publicTrips) {
        String destination = extractDestination(query)
                .orElseGet(() -> publicTrips.stream()
                        .map(TripResponseDto::getDestination)
                        .filter(Objects::nonNull)
                        .findFirst()
                        .orElse("that place"));

        String prompt = "Suggest 5 practical things to explore in " + destination + ". "
                + "Keep it concise, travel-friendly, and concrete. "
                + "Include viewpoints, local experiences, food, and a quick note about the best time or vibe. "
                + "Do not mention trip cards unless the user explicitly asks to find or join a trip.";

        String llmResponse = generateWithFallback(prompt);
        if (!llmResponse.isBlank()) {
            return llmResponse;
        }

        return "In " + destination + ", try local sightseeing, a food stop, a short hike or viewpoint, a relaxed cafe or market visit, and one offbeat experience with a local guide. If you want, I can also suggest a trip that includes those activities.";
    }

    private Optional<String> extractDestination(String query) {
        if (query == null || query.isBlank()) {
            return Optional.empty();
        }

        Matcher matcher = Pattern.compile("(?i)(?:in|at|for|around|to)\\s+([a-zA-Z][a-zA-Z\\s-]{2,})").matcher(query);
        if (matcher.find()) {
            String candidate = matcher.group(1).trim();
            candidate = candidate.replaceAll("[?.!]+$", "");
            if (candidate.length() >= 3) {
                return Optional.of(candidate);
            }
        }

        return Optional.empty();
    }

    private BigDecimal extractBudget(String query) {
        if (query == null || query.isBlank()) {
            return null;
        }

        Matcher matcher = Pattern.compile("(\\d+(?:\\.\\d+)?)").matcher(query.replace(",", ""));
        if (matcher.find()) {
            try {
                return new BigDecimal(matcher.group(1));
            } catch (Exception ignored) {
                return null;
            }
        }

        return null;
    }

    private String buildTripPlanningPrompt(String query, List<TripResponseDto> publicTrips) {
        String tripsContext = publicTrips.stream()
                .limit(8)
                .map(trip -> String.format(Locale.US,
                        "- %s | %s | budget ₹%s | seats %s | creator %s",
                        Optional.ofNullable(trip.getDestination()).orElse("Unknown destination"),
                        Optional.ofNullable(trip.getStartDate()).map(Object::toString).orElse("TBD"),
                        formatBudget(trip.getBudget()),
                        Optional.ofNullable(trip.getTotalPersons()).map(Object::toString).orElse("0"),
                        Optional.ofNullable(trip.getCreatedBy()).orElse("Traveller")))
                .collect(Collectors.joining("\n"));

        return "User request: " + query + "\n\n"
                + "Use the following public trips as the source of truth when recommending options:\n"
                + tripsContext + "\n\n"
                + "Respond with: 1) a short answer, 2) the best matching trip options if any, and 3) a quick next step to request to join.";
    }

    private String buildBudgetPrompt(BigDecimal budget) {
        return "A traveler has a budget of ₹" + formatBudget(budget)
                + ". Suggest a practical split for stay, transport, food, activities, and buffer."
                + " Keep it short and actionable.";
    }

    private String buildInsightsPrompt(List<TripResponseDto> publicTrips, Map<String, Object> stats) {
        String destinationSummary = publicTrips.stream()
                .map(TripResponseDto::getDestination)
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(dest -> dest, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(entry -> entry.getKey() + " (" + entry.getValue() + ")")
                .collect(Collectors.joining(", "));

        return "Community stats: total public trips = " + stats.get("totalPosts")
                + ", average budget = ₹" + stats.get("avgBudget")
                + ". Top destinations: " + (destinationSummary.isBlank() ? "none" : destinationSummary) + ".\n"
                + "Write a short insight for travelers on what kind of trips are trending and what they should do next.";
    }

    private List<TripResponseDto> safePublicTrips() {
        try {
            List<TripResponseDto> trips = tripService.getPublicTrips();
            if (trips == null) {
                return List.of();
            }
            return new ArrayList<>(trips);
        } catch (Exception ex) {
            return List.of();
        }
    }

    private List<TripResponseDto> findMatchingTrips(String query, List<TripResponseDto> publicTrips) {
        String lowerQuery = query.toLowerCase(Locale.ROOT);
        List<TripResponseDto> matched = publicTrips.stream()
                .filter(trip -> matchesDestination(trip.getDestination(), lowerQuery)
                        || matchesDate(trip, lowerQuery)
                        || matchesBudget(trip, lowerQuery))
                .sorted(Comparator.comparing(TripResponseDto::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());

        if (!matched.isEmpty()) {
            return matched.stream().limit(3).collect(Collectors.toList());
        }

        return publicTrips.stream()
                .sorted(Comparator.comparing(TripResponseDto::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(3)
                .collect(Collectors.toList());
    }

    private boolean matchesDestination(String destination, String query) {
        if (destination == null || destination.isBlank()) {
            return false;
        }
        String lowerDestination = destination.toLowerCase(Locale.ROOT);
        return query.contains(lowerDestination) || lowerDestination.contains(query);
    }

    private boolean matchesDate(TripResponseDto trip, String query) {
        if (trip.getStartDate() == null) {
            return false;
        }
        String monthName = trip.getStartDate().getMonth().name().toLowerCase(Locale.ROOT);
        String monthValue = String.valueOf(trip.getStartDate().getMonthValue());
        return query.contains(monthName) || query.contains(monthValue);
    }

    private boolean matchesBudget(TripResponseDto trip, String query) {
        BigDecimal budget = trip.getBudget();
        if (budget == null) {
            return false;
        }

        String digits = query.replaceAll("[^0-9]", " ").trim();
        if (digits.isBlank()) {
            return false;
        }

        String firstNumber = digits.split("\\s+")[0];
        try {
            BigDecimal requested = new BigDecimal(firstNumber);
            BigDecimal delta = requested.multiply(BigDecimal.valueOf(0.35));
            BigDecimal lowerBound = requested.subtract(delta);
            BigDecimal upperBound = requested.add(delta);
            return budget.compareTo(lowerBound) >= 0 && budget.compareTo(upperBound) <= 0;
        } catch (NumberFormatException ex) {
            return false;
        }
    }

    private BigDecimal parseBudget(Object budgetValue) {
        if (budgetValue == null) {
            return null;
        }
        try {
            if (budgetValue instanceof Number number) {
                return BigDecimal.valueOf(number.doubleValue());
            }
            return new BigDecimal(String.valueOf(budgetValue).replaceAll(",", "").trim());
        } catch (Exception ex) {
            return null;
        }
    }

    private String formatBudget(BigDecimal amount) {
        return amount == null ? "0" : amount.setScale(0, RoundingMode.HALF_UP).toPlainString();
    }

    private String formatDate(java.time.LocalDate date) {
        return date == null ? "TBD" : date.toString();
    }

    private int calculateAverageBudget(List<TripResponseDto> trips) {
        BigDecimal total = trips.stream()
                .map(TripResponseDto::getBudget)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        long count = trips.stream().map(TripResponseDto::getBudget).filter(Objects::nonNull).count();
        if (count == 0) {
            return 0;
        }
        return total.divide(BigDecimal.valueOf(count), 0, RoundingMode.HALF_UP).intValue();
    }

    private String normalizeDestination(String destination) {
        return destination == null ? "" : destination.trim();
    }
}