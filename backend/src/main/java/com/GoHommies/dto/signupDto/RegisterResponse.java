package com.GoHommies.dto.signupDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterResponse {
    private String userId;
    private String name;
    private String email;
    private boolean isAccountVerified;
    private String token;
    private String role;
    private String message;
}

