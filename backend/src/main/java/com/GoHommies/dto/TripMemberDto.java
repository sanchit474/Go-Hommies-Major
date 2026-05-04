package com.GoHommies.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TripMemberDto {
    private Long travellerId;
    private String name;
    private String email;
    private String profileUrl;
    private String bio;
    private Double rating;
    private Integer tripsCount;
}
