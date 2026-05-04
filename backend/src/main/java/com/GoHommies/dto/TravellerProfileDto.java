package com.GoHommies.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TravellerProfileDto {
    private String name;
    private String email;
    private String phone;
    private String address;
    private String gender;
    private String birthday; // ISO format: yyyy-MM-dd
    private String imageUrl;
    private String coverPhotoUrl;
    private String bio;
    private String location;
    private Integer age;
    private String travelStyle;
    private List<String> interests;
    private List<String> languages;
    private Boolean isProfileComplete;
}