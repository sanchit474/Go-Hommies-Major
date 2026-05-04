package com.GoHommies.specification;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.data.jpa.domain.Specification;

import com.GoHommies.entity.Trip;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class TripSpecification implements Specification<Trip> {

    private final String destination;
    private final BigDecimal minBudget;
    private final BigDecimal maxBudget;
    private final LocalDate startDateFrom;
    private final LocalDate endDateTo;
    private final String travelStyle;

    @Override
    public Predicate toPredicate(Root<Trip> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        Predicate predicate = cb.conjunction();

        // Only public trips
        predicate = cb.and(predicate, cb.equal(root.get("isPublic"), true));

        if (destination != null && !destination.isBlank()) {
            predicate = cb.and(predicate, cb.like(
                    cb.lower(root.get("destination")),
                    "%" + destination.toLowerCase() + "%"
            ));
        }

        if (minBudget != null) {
            predicate = cb.and(predicate, cb.greaterThanOrEqualTo(root.get("budget"), minBudget));
        }

        if (maxBudget != null) {
            predicate = cb.and(predicate, cb.lessThanOrEqualTo(root.get("budget"), maxBudget));
        }

        if (startDateFrom != null) {
            predicate = cb.and(predicate, cb.greaterThanOrEqualTo(root.get("startDate"), startDateFrom));
        }

        if (endDateTo != null) {
            predicate = cb.and(predicate, cb.lessThanOrEqualTo(root.get("endDate"), endDateTo));
        }

        if (travelStyle != null && !travelStyle.isBlank()) {
            predicate = cb.and(predicate, cb.like(
                    cb.lower(root.get("traveller").get("travelStyle")),
                    "%" + travelStyle.toLowerCase() + "%"
            ));
        }

        return predicate;
    }

    public static Specification<Trip> byDestination(String destination) {
        return new TripSpecification(destination, null, null, null, null, null);
    }

    public static Specification<Trip> byBudgetRange(BigDecimal min, BigDecimal max) {
        return new TripSpecification(null, min, max, null, null, null);
    }

    public static Specification<Trip> byDateRange(LocalDate from, LocalDate to) {
        return new TripSpecification(null, null, null, from, to, null);
    }

    public static Specification<Trip> byTravelStyle(String travelStyle) {
        return new TripSpecification(null, null, null, null, null, travelStyle);
    }

    public static Specification<Trip> search(String destination, BigDecimal minBudget, BigDecimal maxBudget,
            LocalDate startDateFrom, LocalDate endDateTo, String travelStyle) {
        return new TripSpecification(destination, minBudget, maxBudget, startDateFrom, endDateTo, travelStyle);
    }
}
