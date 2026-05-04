package com.GoHommies.service.travellerservice;

import org.springframework.web.multipart.MultipartFile;

import com.GoHommies.dto.TravellerProfileDto;

public interface TravellerService {
    TravellerProfileDto getProfile(String email);
    TravellerProfileDto updateProfile(String email, TravellerProfileDto dto);
    String uploadProfileImage(String email, MultipartFile file);
}
