package com.GoHommies.service.authservice;

import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.GoHommies.dto.loginDto.AuthRequest;
import com.GoHommies.dto.loginDto.AuthResponse;
import com.GoHommies.dto.signupDto.RegisterRequest;
import com.GoHommies.dto.signupDto.RegisterResponse;
import com.GoHommies.entity.UserEntity;
import com.GoHommies.repository.UserRepository;
import com.GoHommies.service.emailservice.EmailService;
import com.GoHommies.service.userdetailservice.AppUserDetailService;
import com.GoHommies.utils.JwtUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    private final AppUserDetailService appUserDetailService;

    @Override
    public RegisterResponse register(RegisterRequest request) {

        Optional<UserEntity> existingUser = userRepository.findByEmail(request.getEmail());

        if (existingUser.isPresent()) {
            if (existingUser.get().isAccountVerified()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
            } else {
                // 🔁 User exists but NOT verified → resend OTP
                sendOtp(request.getEmail());
                return convertToProfileResponse(existingUser.get());
            }
        }

        UserEntity newUser = convertToUserEntity(request);

        userRepository.save(newUser);
        sendOtp(request.getEmail());

        return convertToProfileResponse(newUser);
    }

    // @Override
    // public RegisterResponse register(RegisterRequest request) {
    //     // FIX: Explicitly check if email exists to ensure the correct error message
    //     if (userRepository.existsByEmail(request.getEmail())) {
    //         throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
    //     }
    //     UserEntity newProfile = convertToUserEntity(request);
    //     // You can remove the try-catch block now since we checked the email above
    //     userRepository.save(newProfile);
    //     sendOtp(request.getEmail());

    //     return convertToProfileResponse(newProfile);
    // }
    @Override
    public AuthResponse login(AuthRequest request) {
        try {
            // Authenticate user
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // Load user details with role
            UserDetails userDetails = appUserDetailService.loadUserByUsername(request.getEmail());

            // Generate JWT token with role
            String jwt = jwtUtils.generateToken(userDetails);

            // Fetch full name from UserEntity
            UserEntity userEntity = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            // Build response with role and userId
            return AuthResponse.builder()
                    .name(userEntity.getFullName())
                    .email(request.getEmail())
                    .token(jwt)
                    .role(userEntity.getRole().name())
                    .build();
        } catch (BadCredentialsException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Incorrect username or password");
        } catch (UsernameNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
    }

    private UserEntity convertToUserEntity(RegisterRequest request) {
        return UserEntity.builder()
                .fullName(request.getName())
                .email(request.getEmail())
                // FIX: Removed the incorrect comment. The password is now correctly encoded.
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserEntity.Role.USER)
                .accountVerified(false)
                .resetOtpExpireAt(0L)
                .verifyOtp(null)
                .verifyOtpExpireAt(0L)
                .resetOtp(null)
                .build();
    }

    private RegisterResponse convertToProfileResponse(UserEntity newProfile) {
        return RegisterResponse.builder()
                .name(newProfile.getFullName())
                .email(newProfile.getEmail())
                .isAccountVerified(newProfile.isAccountVerified())
                .build();
    }


    @Override
    public void sendOtp(String email) {
        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("user not found :" + email));
        if (existingUser.isAccountVerified()) return;
        //generate 6 digit otp
        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));
        //calculate expiry time
        long expiryTime = System.currentTimeMillis() + (15 * 60 * 1000);
        //update the profile/user
        existingUser.setVerifyOtp(otp);
        existingUser.setVerifyOtpExpireAt(expiryTime);
        //save to db
        userRepository.save(existingUser);
        try {
            emailService.sendOtpMail(existingUser.getEmail(), otp);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to send email");
        }
    }

    @Override
    public void verifyOtp(String email, String otp) {
        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("user not found :" + email));
        if (existingUser.getVerifyOtp() == null || !existingUser.getVerifyOtp().equals(otp)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid OTP");
        }
        if (existingUser.getVerifyOtpExpireAt() < System.currentTimeMillis()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP expired");
        }
        // 3. ✅ NEW: Send Welcome Email here (after success)
        try {
            existingUser.setAccountVerified(true);
            existingUser.setVerifyOtp(null);
            existingUser.setVerifyOtpExpireAt(0L);

            userRepository.save(existingUser);
            emailService.sendWelcomeEmail(existingUser.getEmail(), existingUser.getFullName());
        } catch (Exception e) {
            // Log this error, but don't fail the verification just because email failed
            log.warn("Failed to send welcome email for {}", existingUser.getEmail(), e);
        }
    }

    @Override
    public void sendResetOtp(String email) {
        UserEntity existingEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("user not found :" + email));
        //generate 6 dig otp
        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));
        //calculate expiry time
        long expiryTime = System.currentTimeMillis() + (15 * 60 * 1000);
        //update the profile/user
        existingEntity.setResetOtp(otp);
        existingEntity.setResetOtpExpireAt(expiryTime);

        // save into the database;
        userRepository.save(existingEntity);
        try {
//            TODO: send reset otp email
            emailService.sendResetOtpMail(existingEntity.getEmail(), otp);

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to send OTP");
        }
    }

    @Override
    public void resetPassword(String email, String otp, String newPassword) {
        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("user not found :" + email));
        if (existingUser.getResetOtp() == null || !existingUser.getResetOtp().equals(otp)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid OTP");
        }
        if (existingUser.getResetOtpExpireAt() < System.currentTimeMillis()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP expired");
        }

        existingUser.setPassword(passwordEncoder.encode(newPassword));
        existingUser.setResetOtp(null);
        existingUser.setResetOtpExpireAt(0L);

        userRepository.save(existingUser);
    }
}
