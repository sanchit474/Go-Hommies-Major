package com.GoHommies.service.authservice;

import com.GoHommies.dto.loginDto.AuthRequest;
import com.GoHommies.dto.loginDto.AuthResponse;
import com.GoHommies.dto.signupDto.RegisterRequest;
import com.GoHommies.dto.signupDto.RegisterResponse;

public interface AuthenticationService {
   //for registration
   RegisterResponse register(RegisterRequest request);
   //for login
   AuthResponse login(AuthRequest request);

   //for registration verification
   void sendOtp(String email);
   void verifyOtp(String email, String otp);

   //password reset
   void sendResetOtp(String email);
   void resetPassword(String email, String otp, String newPassword);
}
