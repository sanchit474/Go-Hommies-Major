package com.GoHommies.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HotelBookingResponseDto {
    private Long id;
    private Long hotelId;
    private String hotelName;
    private String location;
    private Integer seatsBooked;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private BigDecimal totalAmount;
    private String status;
    private String travellerName;
    private String travellerEmail;
    private LocalDateTime createdAt;
}
