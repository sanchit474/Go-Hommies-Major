package com.GoHommies.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class CreateHotelBookingDto {
    private Integer seatsBooked;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
}
