package com.GoHommies.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TravellerSearchCriteria {
    private String location;
    private String interest;
    private String travelStyle;
}
