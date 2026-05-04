package com.GoHommies.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PatientListDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String gender;
    private String birthday;
    private String imageUrl;
    private String registeredAt;
    private int totalAppointments;
}
