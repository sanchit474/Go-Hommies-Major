package com.GoHommies.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.GoHommies.dto.loginDto.AuthRequest;
import com.GoHommies.dto.loginDto.AuthResponse;
import com.GoHommies.dto.signupDto.RegisterRequest;
import com.GoHommies.dto.signupDto.RegisterResponse;
import com.GoHommies.entity.UserEntity;
import com.GoHommies.entity.UserEntity.Role;
import com.GoHommies.repository.UserRepository;
import com.GoHommies.service.authservice.AuthenticationService;
import com.GoHommies.service.userdetailservice.AppUserDetailService;
import com.GoHommies.utils.JwtUtils;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminAuthController {

    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final AppUserDetailService appUserDetailService;
    private final PasswordEncoder passwordEncoder;

    /**
     * Admin Login - Only users with ADMIN role can login
     */
    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@Valid @RequestBody AuthRequest request) {
        try {
            AuthResponse response = authenticationService.login(request);
            
            // Verify the user has ADMIN role
            if (!response.getRole().equals("ADMIN")) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Only admins can login here");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials or not an admin");
        }
    }

    /**
     * Admin Registration - Creates a new ADMIN user
     */
    @PostMapping("/register")
    public RegisterResponse adminRegister(@Valid @RequestBody RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        // Create user with ADMIN role
        UserEntity newAdmin = UserEntity.builder()
                .fullName(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ADMIN)
                .accountVerified(true) // Admins are auto-verified
                .build();

        userRepository.save(newAdmin);

        // Generate JWT token for immediate login
        UserDetails userDetails = appUserDetailService.loadUserByUsername(request.getEmail());
        String token = jwtUtils.generateToken(userDetails);

        return RegisterResponse.builder()
                .userId(String.valueOf(newAdmin.getId()))
                .name(newAdmin.getFullName())
                .email(newAdmin.getEmail())
                .isAccountVerified(true)
                .token(token)
                .role("ADMIN")
                .message("Admin registered successfully")
                .build();
    }
}
