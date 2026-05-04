package com.GoHommies.service.searchservice;

import com.GoHommies.dto.TravellerSearchCriteria;
import com.GoHommies.dto.TravellerSearchResultDto;
import com.GoHommies.dto.TripSearchCriteria;
import com.GoHommies.dto.TripSearchResultDto;
import java.util.List;

public interface SearchService {
    // Traveller search
    List<TravellerSearchResultDto> searchTravellers(TravellerSearchCriteria criteria);
    List<TravellerSearchResultDto> searchTravellersByLocation(String location);
    List<TravellerSearchResultDto> searchTravellersByInterest(String interest);
    List<TravellerSearchResultDto> searchTravellersByTravelStyle(String travelStyle);
    
    // Trip discovery
    List<TripSearchResultDto> discoverTrips(TripSearchCriteria criteria);
    List<TripSearchResultDto> discoverTripsByDestination(String destination);
    List<TripSearchResultDto> discoverTripsByBudgetRange(java.math.BigDecimal minBudget, java.math.BigDecimal maxBudget);
    List<TripSearchResultDto> discoverTripsByDateRange(java.time.LocalDate from, java.time.LocalDate to);
    List<TripSearchResultDto> discoverTripsByTravelStyle(String travelStyle);
}
