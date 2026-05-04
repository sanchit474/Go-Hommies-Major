package com.GoHommies.specification;

import org.springframework.data.jpa.domain.Specification;

import com.GoHommies.entity.Traveller;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class TravellerSpecification implements Specification<Traveller> {

    private final String location;
    private final String interest;
    private final String travelStyle;

    @Override
    public Predicate toPredicate(Root<Traveller> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        Predicate predicate = cb.conjunction();

        if (location != null && !location.isBlank()) {
            predicate = cb.and(predicate, cb.like(
                    cb.lower(root.get("location")),
                    "%" + location.toLowerCase() + "%"
            ));
        }

        if (travelStyle != null && !travelStyle.isBlank()) {
            predicate = cb.and(predicate, cb.like(
                    cb.lower(root.get("travelStyle")),
                    "%" + travelStyle.toLowerCase() + "%"
            ));
        }

        if (interest != null && !interest.isBlank()) {
            predicate = cb.and(predicate,
                    cb.isMember(interest, root.get("interests"))
            );
        }

        return predicate;
    }

    public static Specification<Traveller> byLocation(String location) {
        return new TravellerSpecification(location, null, null);
    }

    public static Specification<Traveller> byInterest(String interest) {
        return new TravellerSpecification(null, interest, null);
    }

    public static Specification<Traveller> byTravelStyle(String travelStyle) {
        return new TravellerSpecification(null, null, travelStyle);
    }

    public static Specification<Traveller> search(String location, String interest, String travelStyle) {
        return new TravellerSpecification(location, interest, travelStyle);
    }
}
