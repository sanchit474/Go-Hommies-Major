package com.GoHommies.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TripCommentDto {
    private Long id;
    private String authorName;
    private String authorEmail;
    private String authorProfileUrl;
    private String text;
    private LocalDateTime createdAt;
}
