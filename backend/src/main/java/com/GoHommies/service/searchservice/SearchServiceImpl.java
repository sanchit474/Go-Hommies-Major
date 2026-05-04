package com.GoHommies.service.searchservice;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.GoHommies.dto.TravellerSearchCriteria;
import com.GoHommies.dto.TravellerSearchResultDto;
import com.GoHommies.dto.TripSearchCriteria;
import com.GoHommies.dto.TripSearchResultDto;
import com.GoHommies.entity.Trip;
import com.GoHommies.entity.Traveller;
import com.GoHommies.entity.TripJoinRequest;
import com.GoHommies.repository.TravellerRepository;
import com.GoHommies.repository.TripJoinRequestRepository;
import com.GoHommies.repository.TripRepository;
import com.GoHommies.specification.TravellerSpecification;
import com.GoHommies.specification.TripSpecification;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final TravellerRepository travellerRepository;
    private final TripRepository tripRepository;
    private final TripJoinRequestRepository joinRequestRepository;

    @Override
    public List<TravellerSearchResultDto> searchTravellers(TravellerSearchCriteria criteria) {
        return travellerRepository.findAll(
                TravellerSpecification.search(
                        criteria.getLocation(),
                        criteria.getInterest(),
                        criteria.getTravelStyle()
                )
        ).stream()
                .map(this::mapToTravellerSearchResult)
                .collect(Collectors.toList());
    }

    @Override
    public List<TravellerSearchResultDto> searchTravellersByLocation(String location) {
        return travellerRepository.findAll(TravellerSpecification.byLocation(location))
                .stream()
                .map(this::mapToTravellerSearchResult)
                .collect(Collectors.toList());
    }

    @Override
    public List<TravellerSearchResultDto> searchTravellersByInterest(String interest) {
        return travellerRepository.findAll(TravellerSpecification.byInterest(interest))
                .stream()
                .map(this::mapToTravellerSearchResult)
                .collect(Collectors.toList());
    }

    @Override
    public List<TravellerSearchResultDto> searchTravellersByTravelStyle(String travelStyle) {
        return travellerRepository.findAll(TravellerSpecification.byTravelStyle(travelStyle))
                .stream()
                .map(this::mapToTravellerSearchResult)
                .collect(Collectors.toList());
    }

    @Override
    public List<TripSearchResultDto> discoverTrips(TripSearchCriteria criteria) {
        return tripRepository.findAll(
                TripSpecification.search(
                        criteria.getDestination(),
                        criteria.getMinBudget(),
                        criteria.getMaxBudget(),
                        criteria.getStartDateFrom(),
                        criteria.getEndDateTo(),
                        criteria.getTravelStyle()
                )
        ).stream()
                .map(this::mapToTripSearchResult)
                .collect(Collectors.toList());
    }

    @Override
    public List<TripSearchResultDto> discoverTripsByDestination(String destination) {
        return tripRepository.findAll(TripSpecification.byDestination(destination))
                .stream()
                .map(this::mapToTripSearchResult)
                .collect(Collectors.toList());
    }

    @Override
    public List<TripSearchResultDto> discoverTripsByBudgetRange(BigDecimal minBudget, BigDecimal maxBudget) {
        return tripRepository.findAll(TripSpecification.byBudgetRange(minBudget, maxBudget))
                .stream()
                .map(this::mapToTripSearchResult)
                .collect(Collectors.toList());
    }

    @Override
    public List<TripSearchResultDto> discoverTripsByDateRange(LocalDate from, LocalDate to) {
        return tripRepository.findAll(TripSpecification.byDateRange(from, to))
                .stream()
                .map(this::mapToTripSearchResult)
                .collect(Collectors.toList());
    }

    @Override
    public List<TripSearchResultDto> discoverTripsByTravelStyle(String travelStyle) {
        return tripRepository.findAll(TripSpecification.byTravelStyle(travelStyle))
                .stream()
                .map(this::mapToTripSearchResult)
                .collect(Collectors.toList());
    }

    private TravellerSearchResultDto mapToTravellerSearchResult(Traveller traveller) {
        return TravellerSearchResultDto.builder()
                .travellerId(traveller.getId())
                .name(traveller.getUser().getFullName())
                .email(traveller.getUser().getEmail())
                .location(traveller.getLocation())
                .travelStyle(traveller.getTravelStyle())
                .bio(traveller.getBio())
                .profileUrl(traveller.getProfileUrl())
                .interests(traveller.getInterests())
                .languages(traveller.getLanguages())
                .rating(traveller.getRating())
                .tripsCount(traveller.getTripsCount())
                .build();
    }

    private TripSearchResultDto mapToTripSearchResult(Trip trip) {
        // Count approved members
        long memberCount = joinRequestRepository.findByTripAndStatusOrderByCreatedAtDesc(
                trip, TripJoinRequest.RequestStatus.APPROVED).size() + 1; // +1 for owner

        return TripSearchResultDto.builder()
                .id(trip.getId())
                .destination(trip.getDestination())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .budget(trip.getBudget())
                .description(trip.getDescription())
                .imageUrl(trip.getImageUrl())
                .createdBy(trip.getTraveller().getUser().getFullName())
                .creatorProfileUrl(trip.getTraveller().getProfileUrl())
                .creatorRating(trip.getTraveller().getRating())
                .memberCount((int) memberCount)
                .createdAt(trip.getCreatedAt())
                .build();
    }
}
