package com.GoHommies.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class CreateHotelDto {
    private String name;
    private String location;
    private String description;
    private Integer totalSeats;
    private BigDecimal pricePerNight;
    private Boolean isActive;
}
