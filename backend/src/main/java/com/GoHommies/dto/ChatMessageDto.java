package com.GoHommies.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessageDto {
    private Long id;
    private Long chatRoomId;
    private String senderName;
    private String senderEmail;
    private String senderProfileUrl;
    private String content;
    private Boolean isRead;
    private LocalDateTime sentAt;
}
