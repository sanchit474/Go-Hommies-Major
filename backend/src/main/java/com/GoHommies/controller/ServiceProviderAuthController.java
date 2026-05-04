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

/**
 * Service Provider Authentication Controller
 * Handles login and registration specifically for service providers
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/serviceprovider")
public class ServiceProviderAuthController {

    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final AppUserDetailService appUserDetailService;
    private final PasswordEncoder passwordEncoder;

    /**
     * Service Provider Login - Only users with SERVICEPROVIDER role can login
     */
    @PostMapping("/login")
    public ResponseEntity<?> serviceProviderLogin(@Valid @RequestBody AuthRequest request) {
        try {
            AuthResponse response = authenticationService.login(request);
            
            // Verify the user has SERVICEPROVIDER role
            if (!response.getRole().equals("SERVICEPROVIDER")) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Only service providers can login here");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials or not a service provider");
        }
    }

    /**
     * Service Provider Registration - Creates a new SERVICEPROVIDER user
     */
    @PostMapping("/register")
    public RegisterResponse serviceProviderRegister(@Valid @RequestBody RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        // Create user with SERVICEPROVIDER role
        UserEntity newServiceProvider = UserEntity.builder()
                .fullName(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.SERVICEPROVIDER)
                .accountVerified(true) // Service providers are auto-verified
                .build();

        userRepository.save(newServiceProvider);

        // Generate JWT token for immediate login
        UserDetails userDetails = appUserDetailService.loadUserByUsername(request.getEmail());
        String token = jwtUtils.generateToken(userDetails);

        return RegisterResponse.builder()
                .userId(String.valueOf(newServiceProvider.getId()))
                .name(newServiceProvider.getFullName())
                .email(newServiceProvider.getEmail())
                .isAccountVerified(true)
                .token(token)
                .role("SERVICEPROVIDER")
                .message("Service provider registered successfully")
                .build();
    }
}
