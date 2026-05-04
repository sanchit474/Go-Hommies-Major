package com.GoHommies.service.travellerservice;

import java.io.IOException;
import java.time.LocalDate;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.GoHommies.dto.TravellerProfileDto;
import com.GoHommies.entity.Traveller;
import com.GoHommies.entity.UserEntity;
import com.GoHommies.repository.TravellerRepository;
import com.GoHommies.repository.UserRepository;
import com.GoHommies.service.cloudinaryservice.CloudinaryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TravellerServiceImpl implements TravellerService {

    private final UserRepository userRepository;
    private final TravellerRepository travellerRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    public TravellerProfileDto getProfile(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        Traveller patient = travellerRepository.findByUser(user)
                .orElse(Traveller.builder().user(user).build());

        return TravellerProfileDto.builder()
                .name(user.getFullName())
                .email(user.getEmail())
                .phone(patient.getPhone())
                .address(patient.getAddress())
                .gender(patient.getGender() != null ? patient.getGender().name() : null)
                .birthday(patient.getBirthday() != null ? patient.getBirthday().toString() : null)
                .imageUrl(patient.getProfileUrl())
                .coverPhotoUrl(patient.getCoverPhotoUrl())
                .bio(patient.getBio())
                .location(patient.getLocation())
                .age(patient.getAge())
                .travelStyle(patient.getTravelStyle())
                .interests(patient.getInterests())
                .languages(patient.getLanguages())
                .isProfileComplete(patient.getIsProfileComplete())
                .build();
    }

    @Override
    public TravellerProfileDto updateProfile(String email, TravellerProfileDto dto) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        // Update name on UserEntity if provided
        if (dto.getName() != null && !dto.getName().isBlank()) {
            user.setFullName(dto.getName());
            userRepository.save(user);
        }

        // Upsert PatientEntity
        Traveller patient = travellerRepository.findByUser(user)
                .orElse(Traveller.builder().user(user).build());

        if (dto.getPhone() != null) patient.setPhone(dto.getPhone());
        if (dto.getAddress() != null) patient.setAddress(dto.getAddress());
        if (dto.getGender() != null) {
            try {
                patient.setGender(Traveller.Gender.valueOf(dto.getGender().toUpperCase()));
            } catch (IllegalArgumentException ignored) {}
        }
        if (dto.getBirthday() != null && !dto.getBirthday().isBlank()) {
            patient.setBirthday(LocalDate.parse(dto.getBirthday()));
        }
        
        // Travel-related fields
        if (dto.getBio() != null) patient.setBio(dto.getBio());
        if (dto.getLocation() != null) patient.setLocation(dto.getLocation());
        if (dto.getAge() != null) patient.setAge(dto.getAge());
        if (dto.getTravelStyle() != null) patient.setTravelStyle(dto.getTravelStyle());
        if (dto.getCoverPhotoUrl() != null) patient.setCoverPhotoUrl(dto.getCoverPhotoUrl());
        if (dto.getInterests() != null) patient.setInterests(dto.getInterests());
        if (dto.getLanguages() != null) patient.setLanguages(dto.getLanguages());

        // Mark profile as complete
        patient.setIsProfileComplete(true);
        travellerRepository.save(patient);

        return TravellerProfileDto.builder()
                .name(user.getFullName())
                .email(user.getEmail())
                .phone(patient.getPhone())
                .address(patient.getAddress())
                .gender(patient.getGender() != null ? patient.getGender().name() : null)
                .birthday(patient.getBirthday() != null ? patient.getBirthday().toString() : null)
                .imageUrl(patient.getProfileUrl())
                .coverPhotoUrl(patient.getCoverPhotoUrl())
                .bio(patient.getBio())
                .location(patient.getLocation())
                .age(patient.getAge())
                .travelStyle(patient.getTravelStyle())
                .interests(patient.getInterests())
                .languages(patient.getLanguages())
                .isProfileComplete(patient.getIsProfileComplete())
                .build();
    }

    @Override
    public String uploadProfileImage(String email, MultipartFile file) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        Traveller patient = travellerRepository.findByUser(user)
                .orElse(Traveller.builder().user(user).build());
        try {
            String url = cloudinaryService.uploadImage(file, "qcare/patients");
            patient.setProfileUrl(url);
            patient.setIsProfileComplete(true);
            travellerRepository.save(patient);
            return url;
        } catch (IOException e) {
            throw new RuntimeException("Image upload failed: " + e.getMessage());
        }
    }
}

