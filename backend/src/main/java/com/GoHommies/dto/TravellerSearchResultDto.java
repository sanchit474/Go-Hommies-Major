package com.GoHommies.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TravellerSearchResultDto {
    private Long travellerId;
    private String name;
    private String email;
    private String location;
    private String travelStyle;
    private String bio;
    private String profileUrl;
    private List<String> interests;
    private List<String> languages;
    private Double rating;
    private Integer tripsCount;
}
