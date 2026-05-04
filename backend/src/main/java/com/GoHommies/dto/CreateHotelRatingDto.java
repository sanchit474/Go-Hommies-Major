package com.GoHommies.dto;

import lombok.Data;

@Data
public class CreateHotelRatingDto {
    private Long bookingId;
    private Integer rating;
    private String comment;
}
