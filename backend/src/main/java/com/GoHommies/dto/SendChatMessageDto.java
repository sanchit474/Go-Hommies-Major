package com.GoHommies.dto;

import com.GoHommies.entity.ChatRoom.ChatType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SendChatMessageDto {
    private String content;
}
