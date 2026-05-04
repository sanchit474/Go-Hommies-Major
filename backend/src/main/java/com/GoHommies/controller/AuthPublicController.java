package com.GoHommies.controller;

import java.time.Duration;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.GoHommies.dto.loginDto.AuthRequest;
import com.GoHommies.dto.loginDto.AuthResponse;
import com.GoHommies.dto.passwordDto.ForgotPasswordRequest;
import com.GoHommies.dto.passwordDto.ResetPasswordRequest;
import com.GoHommies.dto.signupDto.RegisterRequest;
import com.GoHommies.dto.signupDto.RegisterResponse;
import com.GoHommies.service.authservice.AuthRateLimiter;
import com.GoHommies.service.authservice.AuthenticationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
@RequestMapping("/public")
public class AuthPublicController {

    private final AuthenticationService profileService;
    private final AuthRateLimiter authRateLimiter;

//    controller for the signup or register user
    @PostMapping("/register")
    public RegisterResponse register(@Valid @RequestBody RegisterRequest request) {
        return profileService.register(request);
    }
    // Inside ProfileController.java
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email"); // ✅ Get email from Body, not Security Context
        String otp = request.get("otp");

        if (email == null || email.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        if (otp == null || otp.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP is required");
        }

        authRateLimiter.check("verify-otp:" + email.toLowerCase(), 8, 60);

        try {
            profileService.verifyOtp(email, otp);
            return new ResponseEntity<>("registered successfully", HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
    // Resend verification OTP to a given email
    @PostMapping("/send-otp")
    public ResponseEntity<?> resendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        authRateLimiter.check("send-otp:" + email.toLowerCase(), 5, 60);
        try {
            profileService.sendOtp(email);
            return new ResponseEntity<>("sent otp", HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
    //    @GetMapping("/profile")
//    public RegisterResponse getProfile(@CurrentSecurityContext(expression = "authentication?.name") String email){
//       return profileService.login(email);
//    }

//      controllers for the login request

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        authRateLimiter.check("login:email:" + request.getEmail().toLowerCase(), 10, 60);
        AuthResponse response = profileService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .path("/")
                .maxAge(Duration.ZERO)
                .sameSite("Strict")
                .build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body("Logged out");
    }
    @PostMapping("/send-reset-otp")
    public ResponseEntity<String> sendResetOtp(@Valid @RequestBody ForgotPasswordRequest request) {
        authRateLimiter.check("send-reset-otp:" + request.getEmail().toLowerCase(), 5, 60);
        try {
            profileService.sendResetOtp(request.getEmail());
            // Production Tip: Return a standard message.
            // Even if email doesn't exist, say "Sent" to prevent hackers from guessing valid emails.
            return ResponseEntity.ok("If an account exists for this email, an OTP has been sent.");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error sending OTP");
        }
    }
    @PostMapping("/reset-password")
    public void resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authRateLimiter.check("reset-password:" + request.getEmail().toLowerCase(), 8, 60);
        try {
            profileService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
    
}


